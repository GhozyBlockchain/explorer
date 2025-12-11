import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightLeft } from 'lucide-react'

const TransactionsTable = ({ transactions }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No transactions yet
            </div>
        )
    }

    const formatAddress = (addr) => {
        if (!addr) return '-'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const formatValue = (value) => {
        if (!value) return '0'
        const eth = Number(value) / 1e18
        if (eth === 0) return '0 ETH'
        if (eth < 0.0001) return '<0.0001 ETH'
        return `${eth.toFixed(4)} ETH`
    }

    const formatTime = (timestamp) => {
        if (!timestamp) return '-'
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
            transition={{ delay: 0.3 }}
            className="card"
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ArrowRightLeft size={20} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Recent Transactions</h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={thStyle}>Tx Hash</th>
                            <th style={thStyle}>Block</th>
                            <th style={thStyle}>From</th>
                            <th style={thStyle}>To</th>
                            <th style={thStyle}>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx, i) => (
                            <tr key={tx.hash} style={{ borderBottom: i < transactions.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                                <td style={tdStyle}>
                                    <Link to={`/tx/${tx.hash}`} style={{ color: 'var(--accent-primary)', fontFamily: 'monospace' }}>
                                        {tx.hash.slice(0, 10)}...
                                    </Link>
                                </td>
                                <td style={tdStyle}>
                                    <Link to={`/block/${tx.blockNumber}`} style={{ color: 'var(--text-primary)' }}>
                                        {tx.blockNumber?.toString()}
                                    </Link>
                                </td>
                                <td style={tdStyle}>
                                    <Link to={`/address/${tx.from}`} style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                        {formatAddress(tx.from)}
                                    </Link>
                                </td>
                                <td style={tdStyle}>
                                    <Link to={`/address/${tx.to}`} style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                                        {tx.to ? formatAddress(tx.to) : 'Contract Create'}
                                    </Link>
                                </td>
                                <td style={tdStyle}>{formatValue(tx.value)}</td>
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

export default TransactionsTable
