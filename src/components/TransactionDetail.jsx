import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRightLeft, ArrowLeft, CheckCircle, XCircle, Clock, Fuel } from 'lucide-react'
import { useGhozyRPC } from '../hooks/useGhozyRPC'

const TransactionDetail = () => {
    const { hash } = useParams()
    const { getTransaction } = useGhozyRPC()
    const [tx, setTx] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTx = async () => {
            setLoading(true)
            const data = await getTransaction(hash)
            setTx(data)
            setLoading(false)
        }
        fetchTx()
    }, [hash, getTransaction])

    if (loading) {
        return (
            <div className="section">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Loading transaction...</div>
                    </div>
                </div>
            </div>
        )
    }

    if (!tx) {
        return (
            <div className="section">
                <div className="container">
                    <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div style={{ color: 'var(--text-secondary)' }}>Transaction not found</div>
                        <Link to="/" style={{ color: 'var(--accent-primary)', marginTop: '1rem', display: 'inline-block' }}>
                            ← Back to home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const isSuccess = tx.receipt?.status === 'success'
    const valueEth = Number(tx.value || 0) / 1e18
    const gasPriceGwei = Number(tx.gasPrice || 0) / 1e9
    const gasUsed = tx.receipt?.gasUsed || 0
    const txFee = (Number(gasUsed) * Number(tx.gasPrice || 0)) / 1e18

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
                            background: isSuccess ? 'var(--accent-primary)' : '#ef4444',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {isSuccess ? <CheckCircle size={24} color="black" /> : <XCircle size={24} color="white" />}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Transaction Details</h1>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                background: isSuccess ? 'rgba(255, 255, 255, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                color: isSuccess ? 'white' : '#ef4444',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                            }}>
                                {isSuccess ? 'Success' : 'Failed'}
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowRightLeft size={18} color="var(--accent-primary)" /> Transaction Info
                        </h3>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <InfoRow label="Transaction Hash" value={tx.hash} mono />
                            <InfoRow label="Status" value={isSuccess ? '✅ Success' : '❌ Failed'} />
                            <InfoRow label="Block" value={tx.blockNumber?.toString()} link={`/block/${tx.blockNumber}`} />
                            <InfoRow label="From" value={tx.from} mono link={`/address/${tx.from}`} />
                            <InfoRow label="To" value={tx.to || 'Contract Creation'} mono link={tx.to ? `/address/${tx.to}` : null} />
                            <InfoRow label="Value" value={`${valueEth.toFixed(6)} ETH`} />
                            <InfoRow label="Transaction Fee" value={`${txFee.toFixed(8)} ETH`} icon={<Fuel size={14} />} />
                            <InfoRow label="Gas Price" value={`${gasPriceGwei.toFixed(4)} Gwei`} />
                            <InfoRow label="Gas Used" value={gasUsed.toLocaleString()} />
                            <InfoRow label="Gas Limit" value={tx.gas?.toLocaleString() || '-'} />
                            <InfoRow label="Nonce" value={tx.nonce?.toString()} />
                        </div>
                    </div>

                    {tx.input && tx.input !== '0x' && (
                        <div className="card" style={{ marginTop: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Input Data</h3>
                            <div style={{
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                background: 'rgba(255,255,255,0.02)',
                                padding: '1rem',
                                borderRadius: '8px',
                                wordBreak: 'break-all',
                                color: 'var(--text-secondary)',
                                maxHeight: '200px',
                                overflow: 'auto'
                            }}>
                                {tx.input}
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
        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '140px' }}>
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

export default TransactionDetail
