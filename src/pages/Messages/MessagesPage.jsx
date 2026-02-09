import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import ConversationsList from './ConversationsList'
import ChatWindow from './ChatWindow'
import './MessagesLayout.css'

export default function MessagesPage() {
  const { user } = useContext(AuthContext)
  const { userId } = useParams()

  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)

  // ⭐ Загружаем список диалогов ТОЛЬКО когда user загружен
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

  // ⭐ Открываем чат
  useEffect(() => {
    if (!user) return

    // 1) Если есть userId в URL → открываем этот чат
    if (userId) {
      const existing = conversations.find((c) => c._id === userId)

      if (existing) {
        setActiveChat(existing)
      } else {
        const loadProfile = async () => {
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
        loadProfile()
      }
      return
    }

    // 2) Если просто /messages → открываем первый диалог
    if (conversations.length > 0 && !activeChat) {
      setActiveChat(conversations[0])
    }
  }, [userId, conversations, user])

  return (
    <div className="messages-layout">
      <Sidebar />

      <ConversationsList
        conversations={conversations}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />

      <ChatWindow chat={activeChat} user={user} />
    </div>
  )
}
