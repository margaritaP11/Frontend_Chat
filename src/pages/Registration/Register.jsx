import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import logo from '../../assets/ichcram.svg'

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
      navigate('/edit')
    } catch (err) {
      console.error(err)
    }
  }

  const emailError = error && error.toLowerCase().includes('email')
  const usernameError = error && error.toLowerCase().includes('username')
  const passwordError = error && error.toLowerCase().includes('password')

  return (
    <div className="register-page">
      <div className="register-box">
        <img src={logo} className="register-logo" />

        <p className="register-subtitle">
          Sign up to see photos and videos from your friends.
        </p>

        <form onSubmit={handleSubmit} className="register-form">
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

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="field-with-error">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <div className="field-error">This username is already taken.</div>
            )}
          </div>

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

          <p className="register-note">
            People who use our service may have uploaded your contact
            information to Instagram.{' '}
            <span className="link-like">Learn More</span>
          </p>

          <p className="register-note small">
            By signing up, you agree to our{' '}
            <span className="link-like">Terms</span>,{' '}
            <span className="link-like">Privacy Policy</span> and{' '}
            <span className="link-like">Cookies Policy</span>.
          </p>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>

      <div className="register-secondary">
        Have an account?{' '}
        <Link to="/login" className="register-link">
          Log in
        </Link>
      </div>
    </div>
  )
}
