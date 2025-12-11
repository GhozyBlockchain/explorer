import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box } from 'lucide-react'

const BlocksTable = ({ blocks, compact = false }) => {
    if (!blocks || blocks.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#8a8a8a', fontSize: '0.9rem' }}>
                No blocks found
            </div>
        )
    }

    const formatTime = (timestamp) => {
        const now = Date.now() / 1000
        const diff = now - Number(timestamp)
        if (diff < 60) return `${Math.floor(diff)}s ago`
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
        return new Date(Number(timestamp) * 1000).toLocaleTimeString()
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {blocks.map((block, i) => (
                <div key={block.number.toString()} style={{
                    padding: '1rem',
                    borderBottom: i < blocks.length - 1 ? '1px solid #222' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    {/* Icon */}
                    <div style={{
                        width: '48px', height: '48px', background: '#222', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Box size={20} color="#8a8a8a" />
                    </div>

                    {/* Block Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <Link to={`/block/${block.number}`} style={{ color: '#3b82f6', fontWeight: '500', textDecoration: 'none' }}>
                                {block.number.toString()}
                            </Link>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#8a8a8a' }}>
                            {formatTime(block.timestamp)}
                        </div>
                    </div>

                    {/* Miner / Reward Info */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem' }}>
                            Fee Recipient <Link to={`/address/${block.miner}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{block.miner.slice(0, 6)}...</Link>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#8a8a8a' }}>
                            <span style={{ color: '#fff', fontWeight: '500' }}>{block.transactions.length}</span> txns
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BlocksTable
