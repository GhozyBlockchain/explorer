import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

const SearchBar = ({ large = false }) => {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        const trimmed = query.trim()

        if (!trimmed) return

        // Detect type and navigate
        if (/^0x[a-fA-F0-9]{64}$/.test(trimmed)) {
            // Transaction hash (66 chars including 0x)
            navigate(`/tx/${trimmed}`)
        } else if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
            // Address (42 chars including 0x)
            navigate(`/address/${trimmed}`)
        } else if (/^\d+$/.test(trimmed)) {
            // Block number
            navigate(`/block/${trimmed}`)
        } else if (/^0x[a-fA-F0-9]+$/.test(trimmed) && trimmed.length === 66) {
            // Could be block hash
            navigate(`/block/${trimmed}`)
        } else {
            // Try as block number anyway
            navigate(`/block/${trimmed}`)
        }

        setQuery('')
    }

    return (
        <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            borderRadius: large ? '12px' : '8px',
            border: '1px solid var(--border-color)',
            padding: large ? '0.75rem 1.25rem' : '0.5rem 1rem',
            gap: '0.75rem',
            width: '100%',
            maxWidth: large ? '700px' : '400px',
            transition: 'border-color 0.2s, box-shadow 0.2s'
        }}>
            <Search size={large ? 22 : 18} color="var(--text-secondary)" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Block Number / Tx Hash / Address"
                style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: large ? '1rem' : '0.9rem',
                    width: '100%',
                    fontFamily: 'inherit'
                }}
            />
            <button type="submit" style={{
                background: 'var(--accent-primary)',
                border: 'none',
                borderRadius: '6px',
                padding: large ? '0.5rem 1rem' : '0.4rem 0.8rem',
                color: 'black',
                fontWeight: '600',
                fontSize: large ? '0.9rem' : '0.8rem',
                cursor: 'pointer'
            }}>
                Search
            </button>
        </form>
    )
}

export default SearchBar
