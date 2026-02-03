import { useState, useEffect } from 'react'
import './Search.css'

export default function SearchPanel({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/users/search?q=${query}`,
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
    }

    fetchUsers()
  }, [query])

  return (
    <div className="search-panel">
      <h2 className="search-title">Search</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="search-results">
        {results.map((u) => (
          <div key={u._id} className="search-user">
            <img
              src={u.avatar || 'https://placehold.co/40'}
              className="search-avatar"
            />
            <div>
              <div className="search-username">{u.username}</div>
              <div className="search-name">{u.name}</div>
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
