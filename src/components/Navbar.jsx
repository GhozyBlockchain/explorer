import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="navbar" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            background: 'rgba(5, 5, 5, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '70px',
                gap: '2rem'
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--accent-primary)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '1.1rem',
                        color: 'black'
                    }}>
                        G
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                        Ghozyscan
                    </span>
                </Link>

                {/* Nav Links */}
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Home</Link>
                    <a href="http://localhost:5173" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Main Site</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
