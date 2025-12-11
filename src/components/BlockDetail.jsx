import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, ArrowLeft, Clock, Info, CheckCircle2 } from 'lucide-react'
import { useGhozyRPC } from '../hooks/useGhozyRPC'

const BlockDetail = () => {
    const { number } = useParams()
    const { getBlock } = useGhozyRPC()
    const [block, setBlock] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBlock = async () => {
            setLoading(true)
            const data = await getBlock(number)
            setBlock(data)
            setLoading(false)
        }
        fetchBlock()
    }, [number, getBlock])

    if (loading) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8a8a8a', background: '#111', minHeight: '100vh' }}>
                <span className="loading-spinner"></span> Loading block data...
            </div>
        )
    }

    if (!block) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8a8a8a', background: '#111', minHeight: '100vh' }}>
                Block not found. <Link to="/" style={{ color: '#3b82f6' }}>Go Home</Link>
            </div>
        )
    }

    // Etherscan-like Row Component
    const DetailRow = ({ label, value, tooltip }) => (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '1rem 0',
            borderBottom: '1px solid #222',
            fontSize: '0.95rem',
            alignItems: 'flex-start'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#8a8a8a', width: '200px', flexShrink: 0 }}>
                {tooltip && <Info size={14} color="#555" />}
                {label}:
            </div>
            <div style={{ color: '#e0e0e0', wordBreak: 'break-all', flex: 1, minWidth: '250px' }}>
                {value}
            </div>
        </div>
    )

    return (
        <div style={{ background: '#111', minHeight: '100vh', padding: '2rem 0 4rem 0', color: '#e0e0e0' }}>
            <div className="container">

                {/* Header */}
                <div style={{ borderBottom: '1px solid #222', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                        Block <span style={{ color: '#8a8a8a' }}>#{block.number.toString()}</span>
                    </h1>
                </div>

                {/* Tabs (Visual Only) */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '2rem', borderBottom: '1px solid #222' }}>
                    <div style={{ paddingBottom: '0.75rem', borderBottom: '2px solid #3b82f6', color: '#3b82f6', fontWeight: '500', fontSize: '0.95rem' }}>
                        Overview
                    </div>
                    <div style={{ paddingBottom: '0.75rem', color: '#666', fontSize: '0.95rem', cursor: 'pointer' }}>
                        Consensus Info
                    </div>
                    <div style={{ paddingBottom: '0.75rem', color: '#666', fontSize: '0.95rem', cursor: 'pointer' }}>
                        MEV Info
                    </div>
                </div>

                {/* Main Content Card */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{ background: '#111', border: '1px solid #3330', padding: '0' }}
                >
                    <DetailRow
                        label="Block Height"
                        value={
                            <span style={{ fontWeight: '500' }}>{block.number.toString()}</span>
                        }
                    />

                    <DetailRow
                        label="Status"
                        value={
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                background: 'rgba(0, 200, 83, 0.1)', color: '#00c853',
                                padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600'
                            }}>
                                <CheckCircle2 size={12} /> Finalized
                            </span>
                        }
                    />

                    <DetailRow
                        label="Timestamp"
                        value={
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={16} color="#8a8a8a" />
                                <span>{new Date(Number(block.timestamp) * 1000).toLocaleString()}</span>
                            </div>
                        }
                    />

                    <DetailRow
                        label="Transactions"
                        value={
                            <Link to="#txs" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                {block.transactions.length} transactions
                            </Link>
                        }
                    />

                    {/* Separator Line */}
                    <div style={{ height: '1px', background: '#222', margin: '0' }}></div>

                    <DetailRow
                        label="Fee Recipient"
                        value={
                            <Link to={`/address/${block.miner}`} style={{ color: '#3b82f6', textDecoration: 'none', fontFamily: 'monospace' }}>
                                {block.miner}
                            </Link>
                        }
                        tooltip
                    />

                    <DetailRow
                        label="Gas Used"
                        value={
                            <div>
                                {Number(block.gasUsed).toLocaleString()}
                                <span style={{ color: '#8a8a8a', marginLeft: '0.5rem', fontSize: '0.85rem' }}>
                                    ({((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        }
                    />

                    <DetailRow
                        label="Gas Limit"
                        value={Number(block.gasLimit).toLocaleString()}
                    />

                    <DetailRow
                        label="Base Fee Per Gas"
                        value={
                            <span>
                                {(Number(block.baseFeePerGas || 0) / 1e9).toFixed(5)} Gwei
                                <span style={{ color: '#8a8a8a', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                                    (0.000000 ETH)
                                </span>
                            </span>
                        }
                        tooltip
                    />

                    <DetailRow
                        label="Extra Data"
                        value={
                            <div style={{
                                fontFamily: 'monospace', background: '#222', padding: '0.4rem 0.8rem',
                                borderRadius: '4px', display: 'inline-block', fontSize: '0.85rem', color: '#a0a0a0'
                            }}>
                                {block.extraData || '0x'}
                            </div>
                        }
                        tooltip
                    />

                    <DetailRow
                        label="Hash"
                        value={<span style={{ fontFamily: 'monospace' }}>{block.hash}</span>}
                    />

                    <DetailRow
                        label="Parent Hash"
                        value={
                            <Link to={`/block/${Number(block.number) - 1}`} style={{ color: '#3b82f6', textDecoration: 'none', fontFamily: 'monospace' }}>
                                {block.parentHash}
                            </Link>
                        }
                    />

                </motion.div>

                <div style={{ marginTop: '2rem', color: '#8a8a8a', fontSize: '0.9rem' }}>
                    <Info size={14} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    Blocks are batches of transactions with a hash of the previous block in the chain.
                </div>

            </div>
        </div>
    )
}

export default BlockDetail
