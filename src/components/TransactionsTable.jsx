import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText } from 'lucide-react'

const TransactionsTable = ({ transactions, compact = false }) => {
    if (!transactions || transactions.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#8a8a8a', fontSize: '0.9rem' }}>
                No transactions yet
            </div>
        )
    }

    const formatAddress = (addr) => {
        if (!addr) return '-'
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`
    }

    const formatValue = (value) => {
        if (!value) return '0 ETH'
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {transactions.map((tx, i) => (
                <div key={tx.hash} style={{
                    padding: '1rem',
                    borderBottom: i < transactions.length - 1 ? '1px solid #222' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    {/* Icon */}
                    <div style={{
                        width: '48px', height: '48px', background: '#222', borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <FileText size={20} color="#8a8a8a" />
                    </div>

                    {/* Tx Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <Link to={`/tx/${tx.hash}`} style={{ color: '#3b82f6', fontWeight: '500', textDecoration: 'none', fontFamily: 'monospace' }}>
                                {tx.hash.slice(0, 10)}...
                            </Link>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#8a8a8a' }}>
                            {formatTime(tx.blockTimestamp)}
                        </div>
                    </div>

                    {/* From / To Info */}
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem' }}>
                            From <Link to={`/address/${tx.from}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{formatAddress(tx.from)}</Link>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '0.2rem' }}>
                            To <Link to={`/address/${tx.to}`} style={{ color: '#3b82f6', textDecoration: 'none' }}>{tx.to ? formatAddress(tx.to) : 'Contract'}</Link>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: '#8a8a8a', padding: '2px 6px', background: '#222', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                            {formatValue(tx.value)}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TransactionsTable
