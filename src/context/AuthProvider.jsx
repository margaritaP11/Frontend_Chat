import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { BACKEND_URL } from '../config'

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

    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error()

        const data = await res.json()
        setUser(data.profile || data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async ({ identifier, password }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      localStorage.setItem('token', data.token)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ username, fullName, email, password }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, email, password }),
      })

      const data = await res.json()

      console.log('REGISTER RESPONSE:', data) // ← ОТУТ ДОДАТИ

      if (!res.ok) throw new Error(data.message)

      localStorage.setItem('token', data.token)
      setUser(data.user)

      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
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
