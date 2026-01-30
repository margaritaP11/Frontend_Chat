import { useNavigate, useLocation } from 'react-router-dom'
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

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const pathname = location.pathname
  const search = location.search

  // ЛОГИКА АКТИВНОСТИ
  const isCreateActive =
    pathname === '/profile' && search.includes('create=true')

  const isProfileActive =
    pathname === '/profile' && !search.includes('create=true')

  return (
    <div className="sidebar">
      <img src={logo} alt="ICKGRAM" className="logo_img" />

      <nav className="nav">
        <div className="nav-item" onClick={() => navigate('/')}>
          <FiHome className="icon" />
          Home
        </div>

        <div className="nav-item" onClick={() => navigate('/search')}>
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

        {/* CREATE */}
        <div
          className={`nav-item ${isCreateActive ? 'active' : ''}`}
          onClick={() => navigate('/profile?create=true')}
        >
          <FiPlusSquare className="icon" />
          Create
        </div>

        {/* PROFILE */}
        <div
          className={`nav-item ${isProfileActive ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <FiUser className="icon" />
          Profile
        </div>
      </nav>
    </div>
  )
}
