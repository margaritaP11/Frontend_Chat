import { NavLink } from 'react-router-dom'
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
  return (
    <div className="sidebar">
      <img src={logo} alt="ICKGRAM" className="logo_img" />

      <nav className="nav">
        <NavLink to="/" className="nav-item">
          <FiHome className="icon" />
          Home
        </NavLink>

        <NavLink to="/search" className="nav-item">
          <FiSearch className="icon" />
          Search
        </NavLink>

        <NavLink to="/explore" className="nav-item">
          <FiCompass className="icon" />
          Explore
        </NavLink>

        <NavLink to="/chat" className="nav-item">
          <FiMessageCircle className="icon" />
          Messages
        </NavLink>

        <NavLink to="/notifications" className="nav-item">
          <FiBell className="icon" />
          Notifications
        </NavLink>

        <NavLink to="/create" className="nav-item">
          <FiPlusSquare className="icon" />
          Create
        </NavLink>

        <NavLink to="/profile/me" className="nav-item">
          <FiUser className="icon" />
          Profile
        </NavLink>
      </nav>
    </div>
  )
}
