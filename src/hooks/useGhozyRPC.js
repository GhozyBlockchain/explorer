import { createPublicClient, http, formatEther } from 'viem'
import { useState, useEffect, useCallback } from 'react'

// Ghozy Chain Configuration
const ghozyChain = {
    id: 5207,
    name: 'Ghozy L2',
    network: 'ghozy',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: [import.meta.env.VITE_L2_RPC_URL || 'http://localhost:8545'] },
        public: { http: [import.meta.env.VITE_L2_RPC_URL || 'http://localhost:8545'] },
    },
}

const client = createPublicClient({
    chain: ghozyChain,
    transport: http(ghozyChain.rpcUrls.default.http[0], {
        batch: true,
        fetchOptions: {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        }
    })
})

export const useGhozyRPC = () => {
    const [blockNumber, setBlockNumber] = useState(0n)
    const [latestBlock, setLatestBlock] = useState(null)
    const [recentBlocks, setRecentBlocks] = useState([])
    const [recentTransactions, setRecentTransactions] = useState([])
    const [isConnected, setIsConnected] = useState(false)
    const [stats, setStats] = useState({
        totalTransactions: 0,
        avgBlockTime: 2,
        tps: 0
    })

    const fetchRecentBlocks = useCallback(async (count = 10) => {
        try {
            const currentBlock = await client.getBlockNumber()

            // 1. Fetch recent 10 blocks for UI tables
            const blocks = []
            const txs = []
            const tableStart = currentBlock > 9n ? currentBlock - 9n : 0n

            for (let i = currentBlock; i >= tableStart && i >= 0n; i--) {
                const block = await client.getBlock({ blockNumber: i })
                blocks.push(block)

                // Collect transactions
                if (block.transactions.length > 0 && txs.length < 10) {
                    for (const txHash of block.transactions.slice(0, 10)) {
                        if (txs.length >= 10) break
                        try {
                            const tx = await client.getTransaction({ hash: txHash })
                            txs.push({ ...tx, blockTimestamp: block.timestamp })
                        } catch (e) { console.error('Failed to fetch tx:', e) }
                    }
                }
            }

            setRecentBlocks(blocks)
            setRecentTransactions(txs)

            // 2. Scan up to 1000 blocks for Total Transaction Stats (Chunked)
            const scanDepth = 1000n
            const statsStart = currentBlock > scanDepth ? currentBlock - scanDepth : 0n

            // Chunked fetching
            const chunkSize = 50
            let totalTxs = 0
            let firstBlockTime = 0n
            let lastBlockTime = 0n
            let blocksCounted = 0

            const processRange = async (from, to) => {
                const innerPromises = []
                for (let i = from; i >= to; i--) {
                    innerPromises.push(client.getBlock({ blockNumber: i, includeTransactions: false }))
                }
                const results = await Promise.all(innerPromises)
                results.forEach(b => {
                    totalTxs += b.transactions.length
                    if (blocksCounted === 0) firstBlockTime = b.timestamp
                    lastBlockTime = b.timestamp
                    blocksCounted++
                })
            }

            // Loop in chunks to avoid overloading RPC
            for (let i = currentBlock; i >= statsStart; i -= BigInt(chunkSize)) {
                const chunkEnd = (i - BigInt(chunkSize) + 1n) > statsStart ? (i - BigInt(chunkSize) + 1n) : statsStart
                await processRange(i, chunkEnd)
            }

            const timeSpan = Number(firstBlockTime - lastBlockTime)
            const tps = timeSpan > 0 ? (totalTxs / timeSpan).toFixed(2) : '0.00'
            const avgTime = timeSpan > 0 ? (timeSpan / blocksCounted).toFixed(2) : '2.00'

            setStats({
                totalTransactions: totalTxs,
                avgBlockTime: avgTime,
                tps: tps
            })

            return blocks
        } catch (error) {
            console.error("Failed to fetch recent blocks:", error)
            return []
        }
    }, [])

    const getBlock = useCallback(async (blockNumberOrHash) => {
        try {
            if (typeof blockNumberOrHash === 'string' && blockNumberOrHash.startsWith('0x')) {
                return await client.getBlock({ blockHash: blockNumberOrHash })
            }
            return await client.getBlock({ blockNumber: BigInt(blockNumberOrHash) })
        } catch (error) {
            console.error("Failed to fetch block:", error)
            return null
        }
    }, [])

    const getTransaction = useCallback(async (hash) => {
        try {
            const tx = await client.getTransaction({ hash })
            const receipt = await client.getTransactionReceipt({ hash })
            return { ...tx, receipt }
        } catch (error) {
            console.error("Failed to fetch transaction:", error)
            return null
        }
    }, [])

    const getAddressInfo = useCallback(async (address) => {
        try {
            const balance = await client.getBalance({ address })
            const txCount = await client.getTransactionCount({ address })
            return {
                address,
                balance: formatEther(balance),
                transactionCount: txCount
            }
        } catch (error) {
            console.error("Failed to fetch address info:", error)
            return null
        }
    }, [])

    useEffect(() => {
        const fetchBlock = async () => {
            try {
                const num = await client.getBlockNumber()
                setBlockNumber(num)

                const block = await client.getBlock({ blockNumber: num })
                setLatestBlock(block)
                setIsConnected(true)
            } catch (error) {
                console.error("Failed to connect to Ghozy RPC:", error)
                setIsConnected(false)
            }
        }

        fetchBlock()
        fetchRecentBlocks(10)

        const interval = setInterval(() => {
            fetchBlock()
            fetchRecentBlocks(10)
        }, 4000) // Poll every 4s to avoid overload

        return () => clearInterval(interval)
    }, [fetchRecentBlocks])

    return {
        client,
        blockNumber,
        latestBlock,
        recentBlocks,
        recentTransactions,
        stats,
        isConnected,
        getBlock,
        getTransaction,
        getAddressInfo,
        fetchRecentBlocks
    }
}

export { client, ghozyChain }
