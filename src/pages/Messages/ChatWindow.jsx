import { useEffect, useState } from 'react'
import { BACKEND_URL } from '../../config'
import './ChatWindow.css'

export default function ChatWindow({ chat, user, socket, onBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const isMobile = window.innerWidth <= 767

  // ---------------------- LOAD MESSAGES ----------------------
  useEffect(() => {
    if (!chat || !chat.user?._id) return

    const load = async () => {
      const res = await fetch(`${BACKEND_URL}/api/messages/${chat.user._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })

      const data = await res.json()
      setMessages(Array.isArray(data) ? data : [])
    }

    load()
  }, [chat])

  // ---------------------- SOCKET RECEIVE ----------------------
  useEffect(() => {
    if (!socket || !chat?.user?._id) return

    const handleReceive = (msg) => {
      const isBetweenUsers =
        (msg.sender === user._id && msg.receiver === chat.user._id) ||
        (msg.sender === chat.user._id && msg.receiver === user._id)

      if (isBetweenUsers) {
        setMessages((prev) => [...prev, msg])
      }
    }

    socket.on('receive_message', handleReceive)

    return () => {
      socket.off('receive_message', handleReceive)
    }
  }, [socket, chat, user])

  // ---------------------- SEND MESSAGE ----------------------
  const sendMessage = async () => {
    if (!text.trim()) return

    const receiverId = chat?.user?._id

    if (!receiverId) {
      console.error('❌ ERROR: receiverId is undefined', chat)
      return
    }

    const res = await fetch(`${BACKEND_URL}/api/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        receiver: receiverId,
        text,
      }),
    })

    if (!res.ok) {
      console.error('SEND MESSAGE ERROR:', await res.text())
      return
    }

    socket.emit('send_message', {
      sender: user._id,
      receiver: receiverId,
      text,
    })

    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!chat || !chat.user) {
    return <div className="chat-empty">Select a conversation</div>
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-header-left">
          {isMobile && (
            <button className="chat-back" onClick={onBack}>
              ← Back
            </button>
          )}

          <img
            src={
              chat.user?.avatar?.startsWith('http')
                ? chat.user.avatar
                : `${BACKEND_URL}/${chat.user.avatar}`
            }
            className="chat-header-avatar"
          />

          <div>
            <div className="chat-header-name">{chat.user?.username}</div>
            <div className="chat-header-sub">
              {chat.user?.username} — ICHgram
            </div>
          </div>
        </div>

        <button className="chat-view-profile">View profile</button>
      </div>

      <div className="chat-messages">
        {messages.map((m, index) => (
          <div
            key={m._id || index}
            className={`chat-bubble ${m.sender === user._id ? 'me' : 'them'}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="chat-input-box">
        <input
          className="chat-input"
          placeholder="Write message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
