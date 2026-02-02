import { useEffect, useState } from 'react'
import './Feed.css'

import likeIcon from '../../assets/Like.svg'
import commentIcon from '../../assets/Mess.svg'

export default function Feed() {
  const [posts, setPosts] = useState([])
  const [expandedText, setExpandedText] = useState({})
  const [openComments, setOpenComments] = useState({})

  useEffect(() => {
    const loadFeed = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/posts/feed', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })

        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.error('FEED LOAD ERROR:', err)
      }
    }

    loadFeed()
  }, [])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = (now - date) / 1000

    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`

    return date.toLocaleDateString()
  }

  const toggleLike = async (postId) => {
    try {
      await fetch(`http://localhost:8080/api/likes/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                liked: !p.liked,
                likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1,
              }
            : p,
        ),
      )
    } catch (err) {
      console.error('LIKE ERROR:', err)
    }
  }

  const toggleText = (postId) => {
    setExpandedText((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  return (
    <div className="feed-container">
      {posts.map((post) => {
        const isLong = post.text.length > 80
        const isExpanded = expandedText[post._id]
        const commentsOpen = openComments[post._id]

        return (
          <div key={post._id} className="feed-post">
            {/* HEADER */}
            <div className="feed-header">
              <div className="feed-header-left">
                <img
                  src={post.user?.avatar || 'https://placehold.co/40'}
                  className="feed-avatar"
                />
                <div className="feed-user-info">
                  <span className="feed-username">{post.user?.username}</span>
                  <span className="feed-date">
                    {formatTime(post.createdAt)}
                  </span>
                </div>
              </div>

              <button className="follow-btn">Follow</button>
            </div>

            {/* IMAGE */}
            <img src={post.image} className="feed-image" />

            {/* ACTIONS */}
            <div className="feed-actions">
              <span className="like-emoji" onClick={() => toggleLike(post._id)}>
                {post.liked ? (
                  '❤️'
                ) : (
                  <img src={likeIcon} className="like-icon" />
                )}
              </span>

              <img src={commentIcon} className="comment-icon" />

              <span className="likes-count">{post.likesCount} likes</span>
            </div>

            {/* CAPTION */}
            <div className="feed-caption">
              <span className="feed-username">{post.user?.username}</span>

              {!isLong && <span>{post.text}</span>}

              {isLong && !isExpanded && (
                <span>
                  {post.text.slice(0, 80)}...
                  <span
                    className="more-btn"
                    onClick={() => toggleText(post._id)}
                  >
                    more
                  </span>
                </span>
              )}

              {isLong && isExpanded && (
                <span>
                  {post.text}
                  <span
                    className="more-btn"
                    onClick={() => toggleText(post._id)}
                  >
                    less
                  </span>
                </span>
              )}
            </div>

            {/* FIRST COMMENT */}
            {post.comments?.length > 0 && post.comments[0]?.user && (
              <div className="feed-comment">
                <span className="comment-user">
                  {post.comments[0].user.username}
                </span>
                <span>{post.comments[0].text}</span>
              </div>
            )}

            {/* OPEN COMMENTS */}
            <div
              className="feed-comments-link"
              onClick={() => toggleComments(post._id)}
            >
              {commentsOpen
                ? 'Hide comments'
                : `View all comments (${post.comments?.length || 0})`}
            </div>

            {commentsOpen && (
              <div className="all-comments">
                {post.comments.map((c) => (
                  <div key={c._id} className="feed-comment">
                    <span className="comment-user">{c.user.username}</span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}

      <div className="feed-end">You've seen all the updates</div>
    </div>
  )
}
