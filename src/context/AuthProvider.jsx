import { useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---------------------- АВТО-ЛОГИН ----------------------
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('http://localhost:8080/api/profile/me', {
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

  // ---------------------- ЛОГИН ----------------------
  const login = async ({ identifier, password }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      localStorage.setItem('token', data.token)
      setUser(data.user)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- РЕГИСТРАЦИЯ ----------------------
  const register = async ({ username, fullName, email, password }) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      localStorage.setItem('token', data.token)
      setUser(data.user)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // ---------------------- ВЫХОД ----------------------
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
