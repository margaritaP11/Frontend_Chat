import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { io } from 'socket.io-client'
import './Notifications.css'

const socket = io('http://localhost:8080')

export default function Notifications() {
  const [items, setItems] = useState([])
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  // ⭐ Підключення до сокета
  useEffect(() => {
    if (user) {
      socket.emit('join', user._id)
    }
  }, [user])

  // ⭐ Завантаження уведомлень
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          'http://localhost:8080/api/users/notifications',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )

        const data = await res.json()
        setItems(data)

        // ⭐ Скидаємо unread у бекенді
        socket.emit('mark_notifications_read', user._id)
      } catch (err) {
        console.error('LOAD NOTIFICATIONS ERROR:', err)
      }
    }

    load()
  }, [user])

  // ⭐ Видалення уведомлення
  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/users/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })

      setItems((prev) => prev.filter((n) => n._id !== id))
    } catch (err) {
      console.error('DELETE NOTIFICATION ERROR:', err)
    }
  }

  // ⭐ Формат часу
  const formatTime = (date) => {
    const diff = Date.now() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(days / 7)

    if (days < 1) return 'today'
    if (days === 1) return '1d'
    if (days < 7) return `${days}d`
    if (weeks === 1) return '1w'
    return `${weeks}w`
  }

  return (
    <div className="notif-container">
      <h2 className="notif-title">Notifications</h2>

      {items.map((n) => (
        <div key={n._id} className="notif-item">
          <img
            src={n.fromUser.avatar}
            className="notif-avatar"
            onClick={() => navigate(`/profile/${n.fromUser._id}`)}
          />

          <div className="notif-text">
            <span
              className="notif-username"
              onClick={() => navigate(`/profile/${n.fromUser._id}`)}
            >
              {n.fromUser.username}
            </span>

            {n.type === 'follow' && ' started following you'}
            {n.type === 'like' && ' liked your post'}
            {n.type === 'comment' && ' commented your post'}
            {n.type === 'message' && ' sent you a message'}

            <span className="notif-time"> · {formatTime(n.createdAt)}</span>
          </div>

          {n.post && (
            <img
              src={n.post.image}
              className="notif-post-thumb"
              onClick={() => navigate(`/post/${n.post._id}`)}
            />
          )}

          <button
            className="notif-delete"
            onClick={() => deleteNotification(n._id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
