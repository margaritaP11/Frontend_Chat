import './ConversationsList.css'

export default function ConversationsList({
  conversations,
  activeChat,
  setActiveChat,
  deleteDialog,
}) {
  return (
    <div className="conv-list">
      <h2 className="conv-title">itcareerhub</h2>

      <div className="conv-items">
        {conversations.map((c) => (
          <div
            key={c._id}
            className={`conv-item ${activeChat?._id === c._id ? 'active' : ''}`}
          >
            <div className="conv-main" onClick={() => setActiveChat(c)}>
              <img
                src={c.user?.avatar || 'https://placehold.co/40'}
                className="conv-avatar"
              />

              <div className="conv-info">
                <span className="conv-name">{c.user?.username}</span>
                <span className="conv-last">{c.lastMessage}</span>
                <span className="conv-time">2 week</span>
              </div>
            </div>

            <button className="conv-delete" onClick={() => deleteDialog(c._id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
