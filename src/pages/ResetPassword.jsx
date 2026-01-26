import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ResetPassword.css'
import logo from '../assets/ichcram.svg'
import lockIcon from '../assets/Schlussel.svg' // добавь иконку замка
import { api } from '../api/client.js'

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
    <div className="reset-page">
      {/* Верхняя полоса */}
      <div className="reset-header">
        <img src={logo} className="reset-logo" />
      </div>

      {/* Центральная карточка */}
      <div className="reset-box">
        <img src={lockIcon} className="reset-icon" />

        <h3 className="reset-title">Trouble logging in?</h3>

        <p className="reset-text">
          Enter your email, phone, or username and we’ll send you a link to get
          back into your account.
        </p>

        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <button type="submit">Reset your password</button>
        </form>

        <div className="reset-divider">
          <div className="line"></div>
          <div className="or">OR</div>
          <div className="line"></div>
        </div>

        <Link to="/register" className="reset-link">
          Create new account
        </Link>

        <div className="reset-back-container">
          <Link to="/login" className="reset-back-text">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
