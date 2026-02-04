import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

import logo from '../assets/ichcram.svg'
import {
  FiHome,
  FiSearch,
  FiCompass,
  FiMessageCircle,
  FiBell,
  FiPlusSquare,
  FiUser,
} from 'react-icons/fi'
import './Sidebar.css'

export default function Sidebar({ onOpenSearch }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useContext(AuthContext)

  return (
    <div className="sidebar">
      <img src={logo} alt="ICKGRAM" className="logo_img" />

      <nav className="nav">
        <div className="nav-item" onClick={() => navigate('/')}>
          <FiHome className="icon" />
          Home
        </div>

        <div className="nav-item" onClick={onOpenSearch}>
          <FiSearch className="icon" />
          Search
        </div>

        <div className="nav-item" onClick={() => navigate('/explore')}>
          <FiCompass className="icon" />
          Explore
        </div>

        <div className="nav-item" onClick={() => navigate('/chat')}>
          <FiMessageCircle className="icon" />
          Messages
        </div>

        <div className="nav-item" onClick={() => navigate('/notifications')}>
          <FiBell className="icon" />
          Notifications
        </div>

        <div className="nav-item" onClick={() => navigate('/create')}>
          <FiPlusSquare className="icon" />
          Create
        </div>

        {/* 🔥 Твій профіль */}
        <div className="nav-item" onClick={() => navigate('/profile/me')}>
          <FiUser className="icon" />
          Profile
        </div>
      </nav>
    </div>
  )
}
