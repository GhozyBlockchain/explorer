import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, ArrowLeft, Wallet, Hash, Copy, Check } from 'lucide-react'
import { useGhozyRPC } from '../hooks/useGhozyRPC'

const AddressPage = () => {
    const { address } = useParams()
    const { getAddressInfo, client } = useGhozyRPC()
    const [info, setInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true)
            const data = await getAddressInfo(address)
            setInfo(data)
            setLoading(false)
        }
        fetchInfo()
    }, [address, getAddressInfo])

    const copyAddress = () => {
        navigator.clipboard.writeText(address)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="section">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Loading address info...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (!info) {
        return (
            <div className="section">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Address not found or invalid</div>
                        <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

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
                            <User size={24} color="black" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Address</h1>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    color: 'var(--text-secondary)',
                                    wordBreak: 'break-all'
                                }}>
                                    {address}
                                </span>
                                <button
                                    onClick={copyAddress}
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '6px',
                                        padding: '0.35rem 0.6rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    {copied ? <Check size={14} color="var(--accent-primary)" /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Balance Card */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Wallet size={20} color="var(--accent-primary)" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ETH Balance</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                                {parseFloat(info.balance).toFixed(6)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>ETH</span>
                            </div>
                        </div>

                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <Hash size={20} color="var(--accent-primary)" />
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Transactions</span>
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                                {info.transactionCount}
                            </div>
                        </div>
                    </div>

                    {/* Info Card */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Address Details</h3>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <InfoRow label="Address" value={info.address} mono />
                            <InfoRow label="ETH Balance" value={`${info.balance} ETH`} />
                            <InfoRow label="Transaction Count" value={info.transactionCount.toString()} />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const InfoRow = ({ label, value, mono }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '0.75rem 0',
        borderBottom: '1px solid var(--border-color)',
        gap: '1rem',
        flexWrap: 'wrap'
    }}>
        <span style={{ color: 'var(--text-secondary)', minWidth: '150px' }}>{label}</span>
        <span style={{
            fontFamily: mono ? 'monospace' : 'inherit',
            wordBreak: 'break-all',
            textAlign: 'right',
            flex: 1
        }}>
            {value}
        </span>
    </div>
)

export default AddressPage
