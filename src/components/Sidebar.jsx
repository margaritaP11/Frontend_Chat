import { useNavigate, useLocation } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'

import logo from '../assets/ichcram.svg'
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiMessageCircle,
  FiBell,
  FiPlusSquare,
  FiLogOut,
} from 'react-icons/fi'

import { BACKEND_URL } from '../config'
import './Sidebar.css'

export default function Sidebar({ onOpenSearch }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useContext(AuthContext)

  const [unread, setUnread] = useState({
    messages: 0,
    notifications: 0,
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  // Load unread counters
  const loadUnread = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages/unread-counts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()
      setUnread({
        messages: data.messages,
        notifications: data.notifications,
      })
    } catch (err) {
      console.error('UNREAD ERROR:', err)
    }
  }

  useEffect(() => {
    loadUnread()
  }, [location.pathname])

  return (
    <div className="sidebar">
      <img src={logo} alt="ICKGRAM" className="logo-img" />

      <nav className="nav">
        <div
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <FiHome className="icon" />
          <span>Home</span>
        </div>

        <div
          className={`nav-item ${isActive('/search') ? 'active' : ''}`}
          onClick={onOpenSearch}
        >
          <FiSearch className="icon" />
          <span>Search</span>
        </div>

        <div
          className={`nav-item ${isActive('/explore') ? 'active' : ''}`}
          onClick={() => navigate('/explore')}
        >
          <FiCompass className="icon" />
          <span>Explore</span>
        </div>

        {/* MESSAGES */}
        <div
          className={`nav-item ${isActive('/messages') ? 'active' : ''}`}
          onClick={() => navigate('/messages')}
          style={{ position: 'relative' }}
        >
          <FiMessageCircle className="icon" />
          <span>Messages</span>

          {unread.messages > 0 && (
            <span className="badge">{unread.messages}</span>
          )}
        </div>

        {/* NOTIFICATIONS */}
        <div
          className={`nav-item ${isActive('/notifications') ? 'active' : ''}`}
          onClick={() => navigate('/notifications')}
          style={{ position: 'relative' }}
        >
          <FiBell className="icon" />
          <span>Notifications</span>

          {unread.notifications > 0 && (
            <span className="badge">{unread.notifications}</span>
          )}
        </div>

        <div
          className={`nav-item ${isActive('/create') ? 'active' : ''}`}
          onClick={() => navigate('/create')}
        >
          <FiPlusSquare className="icon" />
          <span>Create</span>
        </div>

        {/* PROFILE */}
        <div
          className={`nav-item ${
            location.pathname.startsWith('/profile') ? 'active' : ''
          }`}
          onClick={() => navigate('/profile/me')}
        >
          <img
            src={
              user?.avatar
                ? user.avatar.startsWith('http')
                  ? user.avatar
                  : `${BACKEND_URL}/${user.avatar}`
                : 'https://placehold.co/40'
            }
            className="sidebar-avatar"
            alt="avatar"
          />

          <span>Profile</span>
        </div>
      </nav>

      <div className="sidebar-bottom">
        <div className="nav-item logout-btn" onClick={handleLogout}>
          <FiLogOut className="icon" />
          <span>Log out</span>
        </div>
      </div>
    </div>
  )
}
