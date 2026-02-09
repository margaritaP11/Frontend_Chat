import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    fetch('http://localhost:8080/api/profile/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Ошибка авторизации')
        return res.json()
      })
      .then((data) => {
        setUser(data.profile || data)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })
  }, [])

  const login = async ({ identifier, password }) => {
    setLoading(true)
    setError(null)

    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      setLoading(false)
      throw new Error(data.message)
    }

    localStorage.setItem('token', data.token)
    setUser(data.user)
    setLoading(false)
  }

  const register = async ({ username, fullName, email, password }) => {
    setLoading(true)
    setError(null)

    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, fullName, email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      setLoading(false)
      throw new Error(data.message)
    }

    localStorage.setItem('token', data.token)
    setUser(data.user)
    setLoading(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
