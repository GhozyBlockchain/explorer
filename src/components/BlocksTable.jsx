import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box } from 'lucide-react'

const BlocksTable = ({ blocks }) => {
    if (!blocks || blocks.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Box size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Blocks</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={thStyle}>Block</th>
                            <th style={thStyle}>Age</th>
                            <th style={thStyle}>Txns</th>
                            <th style={thStyle}>Gas Used</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blocks.map((block, i) => (
                            <tr key={block.number.toString()} style={{ borderBottom: i < blocks.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                <td style={tdStyle}>
                                    <Link to={`/block/${block.number}`} style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>
                                        #{block.number.toString()}
                                    </Link>
                                </td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>
                                    {formatTime(block.timestamp)}
                                </td>
                                <td style={tdStyle}>{block.transactions.length}</td>
                                <td style={tdStyle}>
                                    {((Number(block.gasUsed) / Number(block.gasLimit)) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}

const thStyle = {
    textAlign: 'left',
    padding: '0.75rem 0.5rem',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.85rem'
}

const tdStyle = {
    padding: '0.75rem 0.5rem'
}

export default BlocksTable
