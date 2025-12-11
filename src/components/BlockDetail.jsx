import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, ArrowLeft, Clock, Fuel, Hash } from 'lucide-react'
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
            <div className="section">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Loading block...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (!block) {
        return (
            <div className="section">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Block not found</div>
                        <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const formatHash = (hash) => hash ? `${hash.slice(0, 20)}...${hash.slice(-10)}` : '-'

    return (
        <div className="section">
            <div className="container">
                <Link to="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                }}>
                    <ArrowLeft size={16} /> Back to explorer
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            background: 'var(--accent-primary)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Box size={24} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Block #{block.number.toString()}</h1>
                            <p style={{ margin: 0 }}>{new Date(Number(block.timestamp) * 1000).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Hash size={18} color="var(--accent-primary)" /> Block Details
                        </h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <InfoRow label="Block Height" value={block.number.toString()} />
                            <InfoRow label="Timestamp" value={new Date(Number(block.timestamp) * 1000).toLocaleString()} icon={<Clock size={14} />} />
                            <InfoRow label="Transactions" value={`${block.transactions.length} transactions`} />
                            <InfoRow label="Hash" value={block.hash} mono />
                            <InfoRow label="Parent Hash" value={block.parentHash} mono link={`/block/${Number(block.number) - 1}`} />
                            <InfoRow label="Gas Used" value={`${block.gasUsed.toLocaleString()} (${((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(2)}%)`} icon={<Fuel size={14} />} />
                            <InfoRow label="Gas Limit" value={block.gasLimit.toLocaleString()} />
                            <InfoRow label="Base Fee" value={`${(Number(block.baseFeePerGas || 0) / 1e9).toFixed(4)} Gwei`} />
                            <InfoRow label="Miner" value={block.miner} mono link={`/address/${block.miner}`} />
                        </div>
                    </div>

                    {block.transactions.length > 0 && (
                        <div className="card" style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                                Transactions ({block.transactions.length})
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {block.transactions.slice(0, 20).map((txHash) => (
                                    <Link
                                        key={txHash}
                                        to={`/tx/${txHash}`}
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: '0.85rem',
                                            color: 'var(--accent-primary)',
                                            padding: '0.5rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        {txHash}
                                    </Link>
                                ))}
                                {block.transactions.length > 20 && (
                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', padding: '0.5rem' }}>
                                        +{block.transactions.length - 20} more transactions
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

const InfoRow = ({ label, value, mono, link, icon }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0.75rem 0',
        borderBottom: '1px solid var(--border-color)',
        gap: '1rem',
        flexWrap: 'wrap'
    }}>
        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
            {icon} {label}
        </span>
        {link ? (
            <Link to={link} style={{
                fontFamily: mono ? 'monospace' : 'inherit',
                color: 'var(--accent-primary)',
                wordBreak: 'break-all',
                textAlign: 'right',
                flex: 1
            }}>
                {value}
            </Link>
        ) : (
            <span style={{
                fontFamily: mono ? 'monospace' : 'inherit',
                wordBreak: 'break-all',
                textAlign: 'right',
                flex: 1
            }}>
                {value}
            </span>
        )}
    </div>
)

export default BlockDetail
