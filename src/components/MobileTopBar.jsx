import { FiPlusSquare, FiBell } from 'react-icons/fi'
import logo from '../assets/ichcram.svg'
import './MobileTopBar.css'
import { useNavigate } from 'react-router-dom'

export default function MobileTopBar() {
  const navigate = useNavigate()

  return (
    <div className="mobile-topbar">
      <div className="mobile-topbar-inner">
        <FiPlusSquare
          className="top-icon"
          onClick={() => navigate('/create')}
        />

        <img src={logo} alt="logo" className="top-logo" />

        <FiBell
          className="top-icon"
          onClick={() => navigate('/notifications')}
        />
      </div>
    </div>
  )
}
