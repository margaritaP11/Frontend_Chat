import './PostComments.css'

export default function PostComments({ comments, timeAgo, onLike, onDelete }) {
  return (
    <div className="comments-list">
      {comments.map((c) => (
        <div key={c.id} className="comment-block">
          <div className="comment-row">
            <img src={c.avatar} className="comment-avatar" />

            <span className="comment-author">{c.author}</span>
            <span className="comment-text">{c.text}</span>

            <button
              className={`comment-like ${c.liked ? 'liked' : ''}`}
              onClick={() => onLike(c.id)}
            >
              {c.liked ? '❤️' : '🤍'}
            </button>

            <button className="comment-delete" onClick={() => onDelete(c.id)}>
              ✖
            </button>
          </div>

          <div className="comment-meta">
            <span className="comment-time">{timeAgo(c.createdAt)}</span>
            <span className="comment-likes">
              {c.likes} {c.likes === 1 ? 'like' : 'likes'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
