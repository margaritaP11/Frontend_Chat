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
      const data = await signup({ email, fullName, username, password })

      if (data?.token) {
        localStorage.setItem('token', data.token)
      }

      // 🔥 ПРАВИЛЬНИЙ ШЛЯХ
      navigate('/profile/edit')
    } catch (err) {
      console.error('REGISTER ERROR:', err)
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
              autoComplete="email"
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
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <div className="field-with-error">
            <input
              type="text"
              placeholder="Username"
              autoComplete="username"
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
              autoComplete="new-password"
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

      <div className="register-secondary">
        Have an account?{' '}
        <Link to="/login" className="register-link">
          Log in
        </Link>
      </div>
    </div>
  )
}
