import { useState } from "react"
import { AuthContext } from "./AuthContext"
import { api } from "../api/client"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = async ({ identifier, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/login", { identifier, password })
      setUser(res.data.user)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ email, fullName, username, password }) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.post("/auth/register", {
        email,
        fullName,
        username,
        password,
      })
      setUser(res.data.user)
      return res.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
