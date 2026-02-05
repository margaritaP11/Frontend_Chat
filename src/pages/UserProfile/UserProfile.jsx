import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import CreatePostPage from '../CreatePost/CreatePostPage'

import ProfileHeader from './ProfileHeader'
import PostGrid from './PostGrid'
import PostModal from './PostModal'

import './UserProfile.css'

export default function UserProfile() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [posts, setPosts] = useState([])
  const [selectedPost, setSelectedPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  const isCreateOpen = params.get('create') === 'true'

  // LOAD POSTS
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

    if (user?._id) fetchPosts()
  }, [user])

  // LOAD FOLLOWERS & FOLLOWING
  useEffect(() => {
    if (!user?._id) return

    const loadFollowers = async () => {
      const res = await fetch(
        `http://localhost:8080/api/follow/followers/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      const data = await res.json()
      setFollowersCount(data.length)
    }

    const loadFollowing = async () => {
      const res = await fetch(
        `http://localhost:8080/api/follow/following/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )
      const data = await res.json()
      setFollowingCount(data.length)
    }

    loadFollowers()
    loadFollowing()
  }, [user])

  // OPEN POST MODAL — ВИПРАВЛЕНО
  const openPostModal = async (post) => {
    setSelectedPost(post)

    try {
      const res = await fetch(
        `http://localhost:8080/api/comments/${post._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      const data = await res.json()

      // ГОЛОВНЕ ВИПРАВЛЕННЯ — comments завжди масив
      const safeComments = Array.isArray(data) ? data : []

      setComments(
        safeComments.map((c) => ({
          id: c._id,
          author: c.user?.name || 'user',
          text: c.text,
          avatar: c.user?.avatar || user.avatar || 'https://placehold.co/32',
          likes: Array.isArray(c.likes) ? c.likes.length : 0,
          liked: Array.isArray(c.likes) ? c.likes.includes(user._id) : false,
          createdAt: c.createdAt,
        })),
      )
    } catch (err) {
      console.error('FETCH COMMENTS ERROR:', err)
      setComments([]) // fallback
    }

    setNewComment('')
  }

  // CLOSE MODAL
  const closePostModal = () => {
    setSelectedPost(null)
    setComments([])
    setNewComment('')
  }

  // LIKE POST
  const handleLikeToggle = async () => {
    if (!selectedPost) return

    try {
      const res = await fetch(
        `http://localhost:8080/api/likes/${selectedPost._id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      )

      const data = await res.json()

      setSelectedPost((prev) => ({
        ...prev,
        liked: data.liked,
        likesCount: data.likesCount,
      }))

      setPosts((prev) =>
        prev.map((p) =>
          p._id === selectedPost._id
            ? { ...p, liked: data.liked, likesCount: data.likesCount }
            : p,
        ),
      )
    } catch (err) {
      console.error('POST LIKE ERROR:', err)
    }
  }

  // DELETE POST
  const handleDeletePost = async (postId) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setPosts((prev) => prev.filter((p) => p._id !== postId))
      setSelectedPost(null)
    } catch (err) {
      console.error('DELETE POST ERROR:', err)
    }
  }

  // SAVE EDIT
  const handleSaveEdit = async (postId, newText) => {
    try {
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text: newText }),
      })

      const data = await res.json()

      setSelectedPost((prev) => ({
        ...prev,
        text: data.post.text,
      }))

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, text: data.post.text } : p,
        ),
      )
    } catch (err) {
      console.error('UPDATE POST ERROR:', err)
    }
  }

  // COMMENT LIKE
  const handleCommentLike = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/comments/like/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()

      setComments((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, liked: data.liked, likes: data.likes } : c,
        ),
      )
    } catch (err) {
      console.error('COMMENT LIKE ERROR:', err)
    }
  }

  // DELETE COMMENT
  const deleteComment = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      setComments((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      console.error('DELETE COMMENT ERROR:', err)
    }
  }

  // ADD COMMENT
  const handleAddComment = async () => {
    const text = newComment.trim()
    if (!text || !selectedPost) return

    try {
      const res = await fetch(
        `http://localhost:8080/api/comments/${selectedPost._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ text }),
        },
      )

      const c = await res.json()

      const newItem = {
        id: c._id,
        author: c.user?.name || user.username,
        text: c.text,
        avatar: c.user?.avatar || user.avatar || 'https://placehold.co/32',
        liked: false,
        likes: Array.isArray(c.likes) ? c.likes.length : 0,
        createdAt: c.createdAt,
      }

      setComments((prev) => [...prev, newItem])
      setNewComment('')
    } catch (err) {
      console.error('ADD COMMENT ERROR:', err)
    }
  }

  // ENTER KEY
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddComment()
    }
  }

  // TIME AGO
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
        <ProfileHeader
          user={user}
          postsCount={posts.length}
          followersCount={followersCount}
          followingCount={followingCount}
        />

        <div className="profile-grid">
          <PostGrid posts={posts} onOpenPost={openPostModal} />
        </div>
      </div>

      {selectedPost && (
        <PostModal
          user={user}
          post={selectedPost}
          comments={comments}
          isLiked={selectedPost.liked}
          likesCount={selectedPost.likesCount}
          timeAgo={timeAgo}
          newComment={newComment}
          setNewComment={setNewComment}
          onClose={closePostModal}
          onLikeToggle={handleLikeToggle}
          onCommentLike={handleCommentLike}
          onDeleteComment={deleteComment}
          onAddComment={handleAddComment}
          onCommentKeyDown={handleKeyDown}
          onDeletePost={handleDeletePost}
          onSaveEdit={handleSaveEdit}
        />
      )}

      {isCreateOpen && <CreatePostPage onClose={() => navigate('/profile')} />}
    </div>
  )
}
