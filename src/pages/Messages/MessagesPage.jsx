import { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import ConversationsList from './ConversationsList'
import ChatWindow from './ChatWindow'
import './MessagesLayout.css'
import { io } from 'socket.io-client'
import { BACKEND_URL } from '../../config'

// SOCKET через BACKEND_URL
const socket = io(BACKEND_URL)

export default function MessagesPage() {
  const { user } = useContext(AuthContext)
  const { userId } = useParams()

  const [conversations, setConversations] = useState([])
  const [activeChat, setActiveChat] = useState(null)

  // ---------------------- JOIN SOCKET ----------------------
  useEffect(() => {
    if (user) {
      socket.emit('join', user._id)
    }
  }, [user])

  // ---------------------- LOAD CONVERSATIONS ----------------------
  useEffect(() => {
    if (!user) return

    const load = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/messages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = await res.json()

        // ⭐ Додаємо user._id вручну
        const fixed = data.map((d) => ({
          ...d,
          user: {
            ...d.user,
            _id: d._id, // ←←← ВАЖЛИВО
          },
        }))

        setConversations(fixed)
      } catch (err) {
        console.log('Ошибка загрузки диалогов:', err)
      }
    }

    load()
  }, [user])

  // ---------------------- DELETE DIALOG ----------------------
  const deleteDialog = async (dialogId) => {
    try {
      await fetch(`${BACKEND_URL}/api/messages/dialog/${dialogId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setConversations((prev) => prev.filter((c) => c._id !== dialogId))

      if (activeChat?._id === dialogId) {
        setActiveChat(null)
      }
    } catch (err) {
      console.error('DELETE DIALOG ERROR:', err)
    }
  }

  // ---------------------- OPEN CHAT ----------------------
  useEffect(() => {
    if (!user) return

    const openChat = async () => {
      if (userId) {
        const existing = conversations.find((c) => c._id === userId)

        if (existing) {
          setActiveChat(existing)
        } else {
          const res = await fetch(`${BACKEND_URL}/api/profile/${userId}`)
          const profile = await res.json()

          setActiveChat({
            _id: userId,
            user: {
              username: profile.username,
              avatar: profile.avatar,
              _id: userId, // ←←← ДОДАНО
            },
            lastMessage: '',
          })
        }

        socket.emit('mark_messages_read', {
          userId: user._id,
          otherUserId: userId,
        })
      }

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
