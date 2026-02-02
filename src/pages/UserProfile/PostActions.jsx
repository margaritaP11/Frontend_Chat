import './PostActions.css'

export default function PostActions({
  isLiked,
  likesCount,
  createdAt,
  timeAgo,
  onLikeToggle,
}) {
  return (
    <div className="actions-row">
      <button className="like-button" onClick={onLikeToggle}>
        {isLiked ? (
          <svg className="heart-icon liked" viewBox="0 0 24 24" fill="#ed4956">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 
                     19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        ) : (
          <svg
            className="heart-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8e8e8e"
            strokeWidth="2"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                     2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                     C13.09 3.81 14.76 3 16.5 3 
                     19.58 3 22 5.42 22 8.5
                     c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        )}
      </button>

      <span className="likes-count">
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </span>

      <span className="time-ago">{timeAgo(createdAt)}</span>
    </div>
  )
}
