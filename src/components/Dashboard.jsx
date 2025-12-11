import { useGhozyRPC } from '../hooks/useGhozyRPC'
import { motion } from 'framer-motion'
import { Box, Activity, Zap, Clock, Fuel } from 'lucide-react'
import BlocksTable from './BlocksTable'
import TransactionsTable from './TransactionsTable'
import SearchBar from './SearchBar'

const Dashboard = () => {
    const { blockNumber, latestBlock, recentBlocks, recentTransactions, stats, isConnected } = useGhozyRPC()

    return (
        <div className="section">
            <div className="container">

                {/* Header */}
                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Ghozyscan</h1>
                        <p style={{ margin: 0 }}>The Ghozy L2 Blockchain Explorer</p>
                    </div>
                    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem' }}>
                        <div style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: isConnected ? 'var(--accent-primary)' : '#ef4444',
                            boxShadow: isConnected ? '0 0 10px var(--accent-glow)' : 'none'
                        }} />
                        <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                            {isConnected ? 'Connected' : 'Connecting...'}
                        </span>
                    </div>
                </div>

                {/* Search Bar - Etherscan Style */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'flex-start' }}
                >
                    <SearchBar large />
                </motion.div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>

                    {/* Latest Block */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Box size={16} color="var(--accent-primary)" />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Latest Block</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace' }}>
                            #{blockNumber.toString()}
                        </div>
                    </motion.div>

                    {/* Chain ID */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Activity size={16} color="var(--accent-primary)" />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Chain ID</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>5207</div>
                    </motion.div>

                    {/* TPS */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Zap size={16} color="var(--accent-primary)" />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>TPS</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.tps}</div>
                    </motion.div>

                    {/* Avg Block Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Clock size={16} color="var(--accent-primary)" />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Block Time</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stats.avgBlockTime}s</div>
                    </motion.div>

                    {/* Gas Price */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Fuel size={16} color="var(--accent-primary)" />
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Gas Price</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>
                            {latestBlock ? (Number(latestBlock.baseFeePerGas || 0) / 1e9).toFixed(2) : '0'}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}> Gwei</span>
                        </div>
                    </motion.div>

                </div>

                {/* Tables Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                    <BlocksTable blocks={recentBlocks} />
                    <TransactionsTable transactions={recentTransactions} />
                </div>

            </div>
        </div>
    )
}

export default Dashboard
