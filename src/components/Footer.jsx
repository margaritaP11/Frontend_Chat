import { useNavigate } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <div className="footer-wrapper">
      <div className="footer-menu">
        <span onClick={() => navigate('/')}>Home</span>
        <span onClick={() => navigate('/search')}>Search</span>
        <span onClick={() => navigate('/explore')}>Explore</span>
        <span onClick={() => navigate('/messages')}>Messages</span>
        <span onClick={() => navigate('/notifications')}>Notifications</span>
        <span onClick={() => navigate('/create')}>Create</span>
      </div>

      <div className="footer-copy">
        © 2026{' '}
        <span className="footer-brand" onClick={() => navigate('/')}>
          ICHgram
        </span>
      </div>
    </div>
  )
}
