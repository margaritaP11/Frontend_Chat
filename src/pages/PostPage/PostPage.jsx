import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import PostModal from '../UserProfile/PostModal'
import { BACKEND_URL } from '../../config'

export default function PostPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  // ⭐ LOAD POST
  useEffect(() => {
    const loadPost = async () => {
      const res = await fetch(`${BACKEND_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })

      const data = await res.json()

      setPost({
        ...data,
        liked: Array.isArray(data.likes)
          ? data.likes.includes(user._id)
          : false,
        likesCount: Array.isArray(data.likes) ? data.likes.length : 0,
        image: data.image, // ⭐ ВАЖЛИВО: НЕ ЧІПАЄМО BASE64
      })
    }

    loadPost()
  }, [id, user])

  // ⭐ LOAD COMMENTS
  useEffect(() => {
    const loadComments = async () => {
      const res = await fetch(`${BACKEND_URL}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })

      const data = await res.json()
      const safe = Array.isArray(data) ? data : []

      setComments(
        safe.map((c) => ({
          id: c._id,
          author: c.user?.username || 'user',
          text: c.text,
          avatar: c.user?.avatar
            ? c.user.avatar.startsWith('http')
              ? c.user.avatar
              : `${BACKEND_URL}/${c.user.avatar}`
            : 'https://placehold.co/32',
          likes: Array.isArray(c.likes) ? c.likes.length : 0,
          liked: Array.isArray(c.likes) ? c.likes.includes(user._id) : false,
          createdAt: c.createdAt,
        })),
      )
    }

    loadComments()
  }, [id, user])

  // ⭐ LIKE POST
  const handleLikeToggle = async () => {
    const res = await fetch(`${BACKEND_URL}/api/likes/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    const data = await res.json()

    setPost((prev) => ({
      ...prev,
      liked: data.liked,
      likesCount: data.likesCount,
    }))
  }

  // ⭐ LIKE COMMENT
  const handleCommentLike = async (commentId) => {
    const res = await fetch(`${BACKEND_URL}/api/comments/like/${commentId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    const data = await res.json()

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, liked: data.liked, likes: data.likes } : c,
      ),
    )
  }

  // ⭐ ADD COMMENT
  const handleAddComment = async () => {
    const text = newComment.trim()
    if (!text) return

    const res = await fetch(`${BACKEND_URL}/api/comments/${post._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ text }),
    })

    const c = await res.json()

    const newItem = {
      id: c._id,
      author: c.user?.username || user.username,
      text: c.text,
      avatar: c.user?.avatar
        ? c.user.avatar.startsWith('http')
          ? c.user.avatar
          : `${BACKEND_URL}/${c.user.avatar}`
        : user.avatar,
      liked: false,
      likes: 0,
      createdAt: c.createdAt,
    }

    setComments((prev) => [...prev, newItem])
    setNewComment('')
  }

  const handleClose = () => navigate(-1)

  if (!post) return <p>Loading...</p>

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <PostModal
        user={user}
        post={post}
        comments={comments}
        isLiked={post.liked}
        likesCount={post.likesCount}
        timeAgo={() => ''}
        newComment={newComment}
        setNewComment={setNewComment}
        onClose={handleClose}
        onLikeToggle={handleLikeToggle}
        onCommentLike={handleCommentLike}
        onDeleteComment={() => {}}
        onAddComment={handleAddComment}
        onCommentKeyDown={() => {}}
        onDeletePost={() => {}}
        onSaveEdit={() => {}}
      />
    </div>
  )
}
