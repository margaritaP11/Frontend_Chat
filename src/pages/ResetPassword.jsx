import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Login.css'
import logo from '../assets/ichcram.svg'

export default function ResetPassword() {
  const [identifier, setIdentifier] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/reset', { identifier })
      alert('Reset link sent!')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="auth-page center-only">
      <div className="auth-card">
        <div className="auth-box">
          <img src={logo} className="auth-logo" />

          <h3 className="auth-title">Trouble logging in?</h3>

          <p className="auth-text">
            Enter your email or username and we’ll send you a link to get back
            into your account.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="text"
              placeholder="Email or Username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <button type="submit">Reset your password</button>
          </form>

          <div className="auth-divider">OR</div>

          <Link to="/register" className="auth-link">
            Create new account
          </Link>

          <Link to="/login" className="auth-back">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
