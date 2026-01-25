import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '../assets/ichcram.svg'

export default function Register() {
  const { register: signup, loading, error } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signup({ email, fullName, username, password })
      navigate('/')
    } catch {
      // ошибка уже обработана в AuthContext
    }
  }

  // --- Ошибки по полям ---
  const emailError = error && error.toLowerCase().includes('email')

  const usernameError = error && error.toLowerCase().includes('username')

  const passwordError = error && error.toLowerCase().includes('password')

  return (
    <div className="auth-page center-only">
      <div className="auth-card">
        <div className="auth-box">
          <img src={logo} className="auth-logo" />

          <p className="auth-subtitle">
            Sign up to see photos and videos from your friends.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* EMAIL */}
            <div className="field-with-error">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <div className="field-error">This email is already used.</div>
              )}
            </div>

            {/* FULL NAME */}
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            {/* USERNAME */}
            <div className="field-with-error">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {usernameError && (
                <div className="field-error">
                  This username is already taken.
                </div>
              )}
            </div>

            {/* PASSWORD */}
            <div className="field-with-error">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className="field-error">Password is too weak.</div>
              )}
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
        </div>

        <div className="auth-box secondary">
          Have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}
