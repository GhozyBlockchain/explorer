import { useGhozyRPC } from '../hooks/useGhozyRPC'
import { motion } from 'framer-motion'
import { Box, Fuel, Database } from 'lucide-react'
import BlocksTable from './BlocksTable'
import TransactionsTable from './TransactionsTable'
import SearchBar from './SearchBar'
import EtheralShadow from './ui/EtheralShadow'

const Dashboard = () => {
    const { blockNumber, latestBlock, recentBlocks, recentTransactions, stats, isConnected } = useGhozyRPC()

    return (
        <div style={{ background: '#111111', minHeight: '100vh', color: '#e0e0e0', paddingBottom: '3rem' }}>

            {/* 1. Hero / Search Section */}
            <div style={{
                background: '#0a0a0a',
                borderBottom: '1px solid #222',
                padding: '3rem 0 5rem 0',
                marginBottom: '-2.5rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <EtheralShadow
                        color="rgba(100, 100, 100, 0.3)"
                        animation={{ scale: 60, speed: 40 }}
                        sizing="fill"
                    />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '1.5rem', color: '#fff' }}>
                        Ghozy Testnet Explorer
                    </h1>
                    <div style={{ maxWidth: '600px' }}>
                        <SearchBar large />
                    </div>
                </div>
            </div>

            <div className="container" style={{ position: 'relative', top: '-1.5rem' }}>

                {/* 2. Stats Grid (Etherscan Style) */}
                <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '1.5rem', background: '#151515', border: '1px solid #222' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                        {/* Col 1: Transactions */}
                        <div style={{ padding: '1.5rem', borderRight: '1px solid #222' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ marginTop: '4px' }}><Database size={20} color="#8a8a8a" /></div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#8a8a8a', marginBottom: '0.25rem' }}>TRANSACTIONS</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#fff' }}>
                                        {stats.totalTransactions.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#8a8a8a' }}>({stats.tps} TPS)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Col 2: Base Fee */}
                        <div style={{ padding: '1.5rem', borderRight: '1px solid #222' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ marginTop: '4px' }}><Fuel size={20} color="#8a8a8a" /></div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#8a8a8a', marginBottom: '0.25rem' }}>BASE FEE</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#fff' }}>
                                        {latestBlock ? (Number(latestBlock.baseFeePerGas || 0) / 1e9).toFixed(5) : '0.000'} <span style={{ fontSize: '0.8rem', color: '#8a8a8a' }}>Gwei</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Col 3: Latest Block */}
                        <div style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ marginTop: '4px' }}><Box size={20} color="#8a8a8a" /></div>
                                <div>
                                    <div style={{ fontSize: '0.8rem', color: '#8a8a8a', marginBottom: '0.25rem' }}>LATEST BLOCK</div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#fff' }}>#{blockNumber.toString()} <span style={{ fontSize: '0.8rem', color: '#8a8a8a' }}>({stats.avgBlockTime}s)</span></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. Split View (Blocks | Transactions) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

                    {/* Latest Blocks Panel */}
                    <div className="card" style={{ background: '#151515', border: '1px solid #222', padding: '0' }}>
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#fff' }}>Latest Blocks</h3>
                            <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>View All Blocks</button>
                        </div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <BlocksTable blocks={recentBlocks} compact />
                        </div>
                        <div style={{ padding: '0.75rem', borderTop: '1px solid #222', textAlign: 'center' }}>
                            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>View all blocks set</a>
                        </div>
                    </div>

                    {/* Latest Transactions Panel */}
                    <div className="card" style={{ background: '#151515', border: '1px solid #222', padding: '0' }}>
                        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: 0, color: '#fff' }}>Latest Transactions</h3>
                            <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>View All Transactions</button>
                        </div>
                        <div style={{ padding: '0.5rem 0' }}>
                            <TransactionsTable transactions={recentTransactions} compact />
                        </div>
                        <div style={{ padding: '0.75rem', borderTop: '1px solid #222', textAlign: 'center' }}>
                            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>View all transactions</a>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Dashboard
