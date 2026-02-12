import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import logo from '../../assets/ichcram.svg'
import phoneImage from '../../assets/Hande.jpg'

export default function Login() {
  const { login, loading, error } = useContext(AuthContext)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login({ identifier, password })
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-phone">
        <img src={phoneImage} alt="Phone preview" />
      </div>

      <div className="auth-card">
        <div className="auth-box">
          <img src={logo} className="auth-logo" />

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Username or email"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <div className="auth-divider">
            <div className="line"></div>
            <div className="or">OR</div>
            <div className="line"></div>
          </div>

          <Link to="/reset" className="auth-link">
            Forgot password?
          </Link>
        </div>

        <div className="secondary">
          Don’t have an account?{' '}
          <Link className="secondary-link" to="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
