import {
  FiHome,
  FiCompass,
  FiMessageCircle,
  FiSearch,
  FiUser,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import './MobileFooter.css'

export default function MobileFooter() {
  const navigate = useNavigate()

  return (
    <div className="mobile-footer">
      <div className="mobile-footer-inner">
        <FiHome onClick={() => navigate('/')} />
        <FiCompass onClick={() => navigate('/explore')} />
        <FiMessageCircle onClick={() => navigate('/messages')} />
        <FiSearch onClick={() => navigate('/search')} />
        <FiUser onClick={() => navigate('/profile/me')} />
      </div>
    </div>
  )
}
