import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer style={{
            borderTop: '1px solid var(--border-color)',
            marginTop: '4rem',
            padding: '2rem 0'
        }}>
            <div className="container">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    {/* Logo & Copyright */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '28px',
                            height: '28px',
                            background: 'var(--accent-primary)',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '800',
                            fontSize: '0.9rem',
                            color: 'black'
                        }}>
                            G
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            © 2025 Ghozyscan. Powered by Ghozy L2
                        </span>
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <Link to="/" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Home</Link>

                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Chain ID: 5207</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
