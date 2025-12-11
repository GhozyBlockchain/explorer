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
            const blocks = []
            const txs = []

            const start = currentBlock > BigInt(count) ? currentBlock - BigInt(count - 1) : 0n

            for (let i = currentBlock; i >= start && i >= 0n; i--) {
                const block = await client.getBlock({ blockNumber: i })
                blocks.push(block)

                // Collect transactions from blocks
                if (block.transactions.length > 0 && txs.length < 10) {
                    for (const txHash of block.transactions.slice(0, 5)) {
                        if (txs.length >= 10) break
                        try {
                            const tx = await client.getTransaction({ hash: txHash })
                            txs.push({ ...tx, blockTimestamp: block.timestamp })
                        } catch (e) {
                            console.error('Failed to fetch tx:', e)
                        }
                    }
                }
            }

            setRecentBlocks(blocks)
            setRecentTransactions(txs)

            // Calculate stats
            if (blocks.length > 1) {
                const totalTxs = blocks.reduce((sum, b) => sum + b.transactions.length, 0)
                const timeSpan = Number(blocks[0].timestamp - blocks[blocks.length - 1].timestamp)
                const tps = timeSpan > 0 ? (totalTxs / timeSpan).toFixed(2) : 0
                setStats({
                    totalTransactions: totalTxs,
                    avgBlockTime: timeSpan > 0 ? (timeSpan / (blocks.length - 1)).toFixed(1) : 2,
                    tps: tps
                })
            }

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
