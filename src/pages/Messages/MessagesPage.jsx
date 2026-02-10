import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import ConversationsList from './ConversationsList'
import ChatWindow from './ChatWindow'
import './MessagesLayout.css'
import { io } from 'socket.io-client'

const socket = io('http://localhost:8080')

export default function MessagesPage() {
  const { user } = useContext(AuthContext)
  const { userId } = useParams()

  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)

  // ⭐ Підключення до сокета
  useEffect(() => {
    if (user) {
      socket.emit('join', user._id)
    }
  }, [user])

  // ⭐ Завантаження діалогів
  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/messages', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = await res.json()
        setConversations(Array.isArray(data) ? data : [])
      } catch (err) {
        console.log('Ошибка загрузки диалогов:', err)
      }
    }

    load()
  }, [user])

  // ⭐ Видалення діалогу
  const deleteDialog = async (dialogId) => {
    try {
      await fetch(`http://localhost:8080/api/messages/dialog/${dialogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      // Прибираємо діалог з UI
      setConversations((prev) => prev.filter((c) => c._id !== dialogId))

      // Якщо видалили активний чат → закриваємо
      if (activeChat?._id === dialogId) {
        setActiveChat(null)
      }
    } catch (err) {
      console.error('DELETE DIALOG ERROR:', err)
    }
  }

  // ⭐ Відкриття чату + скидання unread
  useEffect(() => {
    if (!user) return

    const openChat = async () => {
      if (userId) {
        const existing = conversations.find((c) => c._id === userId)

        if (existing) {
          setActiveChat(existing)
        } else {
          const res = await fetch(`http://localhost:8080/api/profile/${userId}`)
          const profile = await res.json()

          setActiveChat({
            _id: userId,
            user: {
              username: profile.username,
              avatar: profile.avatar,
            },
            lastMessage: '',
          })
        }

        // ⭐ Скидаємо unread у бекенді
        socket.emit('mark_messages_read', {
          userId: user._id,
          otherUserId: userId,
        })
      }

      // Якщо просто /messages → відкриваємо перший діалог
      if (!userId && conversations.length > 0 && !activeChat) {
        setActiveChat(conversations[0])
      }
    }

    openChat()
  }, [userId, conversations, user])

  return (
    <div className="messages-layout">
      <Sidebar />

      <ConversationsList
        conversations={conversations}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        deleteDialog={deleteDialog}
      />

      <ChatWindow chat={activeChat} user={user} socket={socket} />
    </div>
  )
}
