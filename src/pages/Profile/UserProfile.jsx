import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import CreatePostPage from '../CreatePost/CreatePostPage'

import './UserProfile.css'

export default function UserProfile() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [posts, setPosts] = useState([])
  const [showFullBio, setShowFullBio] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const BIO_LIMIT = 60
  const isLongBio = user?.bio && user.bio.length > BIO_LIMIT
  const isCreateOpen = params.get('create') === 'true'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/posts/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        )
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.error('FETCH POSTS ERROR:', err)
      }
    }

    if (user?._id) {
      fetchPosts()
    }
  }, [user])

  const openPostModal = (post) => {
    setSelectedPost(post)

    setIsLiked(false)
    setLikesCount(Number.isFinite(post.likesCount) ? post.likesCount : 0)

    setComments(
      (post.comments || []).map((c) => ({
        id: c.id ?? c._id ?? Math.random().toString(36).slice(2),
        author: c.author ?? 'user',
        text: c.text ?? '',
        likes: Number.isFinite(c.likes) ? c.likes : 0,
        liked: false,
        createdAt: c.createdAt ?? new Date().toISOString(),
      })),
    )

    setNewComment('')
  }

  const closePostModal = () => {
    setSelectedPost(null)
    setIsLiked(false)
    setLikesCount(0)
    setComments([])
    setNewComment('')
  }

  const handleLikeToggle = () => {
    setIsLiked((prevLiked) => {
      setLikesCount((prevCount) => {
        const safePrev = Number.isFinite(prevCount) ? prevCount : 0
        return prevLiked ? safePrev - 1 : safePrev + 1
      })
      return !prevLiked
    })
  }

  const handleCommentLike = (id) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            }
          : c,
      ),
    )
  }

  const deleteComment = (id) => {
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  const handleAddComment = () => {
    const text = newComment.trim()
    if (!text) return

    const newItem = {
      id: Date.now(),
      author: user.username,
      text,
      liked: false,
      likes: 0,
      createdAt: new Date().toISOString(),
    }

    setComments((prev) => [...prev, newItem])
    setNewComment('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddComment()
    }
  }

  const timeAgo = (dateString) => {
    if (!dateString) return ''
    const created = new Date(dateString)
    const now = new Date()
    const diffMs = now - created
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return 'just now'
    if (diffHours < 24) return `${diffHours} h.`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`
  }

  if (!user) return <p>Loading...</p>

  return (
    <div className="profile-page">
      <Sidebar />

      <div className="profile-box">
        <div className="profile-header">
          <img
            src={user.avatar || 'https://placehold.co/150'}
            alt="avatar"
            className="profile-avatar"
          />

          <div className="profile-info">
            <div className="profile-top">
              <div className="profile-username">{user.username}</div>

              <button
                className="profile-edit-button"
                onClick={() => navigate('/profile/edit')}
              >
                Edit profile
              </button>
            </div>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-count">{posts.length}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="stat">
                <span className="stat-count">{user.followersCount ?? 0}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat">
                <span className="stat-count">{user.followingCount ?? 0}</span>
                <span className="stat-label">following</span>
              </div>
            </div>

            {user.fullName && (
              <p className="profile-fullname">{user.fullName}</p>
            )}

            {user.bio && (
              <div className="profile-bio">
                {showFullBio ? user.bio : user.bio.slice(0, BIO_LIMIT)}
                {isLongBio && (
                  <span
                    className="bio-more"
                    onClick={() => setShowFullBio(!showFullBio)}
                  >
                    {showFullBio ? ' less' : '... more'}
                  </span>
                )}
              </div>
            )}

            {user.website && (
              <a
                href={user.website}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-website"
              >
                {user.website}
              </a>
            )}
          </div>
        </div>

        <div className="profile-grid">
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            <div className="grid">
              {posts.map((post) => (
                <img
                  key={post._id}
                  src={post.image}
                  alt={post.caption || ''}
                  className="grid-item"
                  onClick={() => openPostModal(post)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <div className="modal-overlay" onClick={closePostModal}>
          <div className="modal-layout" onClick={(e) => e.stopPropagation()}>
            <div className="modal-left">
              <img
                src={selectedPost.image}
                alt="post"
                className="modal-image"
              />
            </div>

            <div className="modal-right">
              <div className="modal-header">
                <img
                  src={user.avatar || 'https://placehold.co/40'}
                  alt="avatar"
                  className="modal-avatar"
                />
                <span className="modal-username">{user.username}</span>
              </div>

              <div className="modal-divider" />

              <div className="post-header">
                <img
                  src={user.avatar || 'https://placehold.co/32'}
                  alt="avatar"
                  className="post-author-avatar"
                />
                <div className="post-author-block">
                  <span className="post-author-name">{user.username}</span>
                  <span className="post-caption-text">{selectedPost.text}</span>
                </div>
              </div>

              <div className="comments-list">
                {comments.map((c) => (
                  <div key={c.id} className="comment-block">
                    <div className="comment-row">
                      <span className="comment-author">{c.author}</span>
                      <span className="comment-text">{c.text}</span>

                      <button
                        className={`comment-like ${c.liked ? 'liked' : ''}`}
                        onClick={() => handleCommentLike(c.id)}
                      >
                        {c.liked ? '❤️' : '🤍'}
                      </button>

                      <button
                        className="comment-delete"
                        onClick={() => deleteComment(c.id)}
                      >
                        ✖
                      </button>
                    </div>

                    <div className="comment-meta">
                      <span className="comment-time">
                        {timeAgo(c.createdAt)}
                      </span>
                      <span className="comment-likes">
                        {c.likes} {c.likes === 1 ? 'like' : 'likes'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="actions-row">
                <button
                  className={`like-button ${isLiked ? 'liked' : ''}`}
                  onClick={handleLikeToggle}
                >
                  {isLiked ? '❤️' : '🤍'}
                </button>
                <span className="likes-count">
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
                <span className="time-ago">
                  {timeAgo(selectedPost.createdAt)}
                </span>
              </div>

              <div className="comment-form">
                <span className="emoji">😊</span>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="send-button"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCreateOpen && <CreatePostPage onClose={() => navigate('/profile')} />}
    </div>
  )
}
