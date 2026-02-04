import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Search.css'

export default function SearchPanel({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/search/users?q=${query}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        const data = await res.json()
        setResults(data)
      } catch (err) {
        console.error('SEARCH ERROR:', err)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div className="search-panel">
      <h2 className="search-title">Search</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-results">
        {results.map((u) => (
          <div
            key={u._id}
            className="search-user"
            onClick={() => {
              navigate(`/profile/${u._id}`)
              onClose()
            }}
          >
            <img
              src={u.avatar || 'https://placehold.co/40'}
              className="search-avatar"
            />
            <div>
              <div className="search-username">{u.username}</div>
              <div className="search-name">{u.fullName}</div>
            </div>
          </div>
        ))}

        {query && results.length === 0 && (
          <div className="no-results">No users found</div>
        )}
      </div>
    </div>
  )
}
