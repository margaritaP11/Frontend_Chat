import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import PostModal from '../UserProfile/PostModal'
import './OtherProfile.css'

export default function OtherProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useContext(AuthContext)

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)

  const [selectedPost, setSelectedPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:8080/api/profile/${id}`)
      const data = await res.json()
      setProfile(data)
    }

    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:8080/api/posts/user/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      const data = await res.json()

      if (!Array.isArray(data)) {
        console.error('BACKEND ERROR:', data)
        setPosts([])
        return
      }

      setPosts(data)
    }

    const checkFollow = async () => {
      const res = await fetch(`http://localhost:8080/api/follow/check/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      const data = await res.json()
      setIsFollowing(data.isFollowing)
    }

    fetchProfile()
    fetchPosts()
    checkFollow()
  }, [id])

  // FOLLOW / UNFOLLOW
  const handleFollow = async () => {
    const url = isFollowing
      ? `http://localhost:8080/api/follow/unfollow/${id}`
      : `http://localhost:8080/api/follow/follow/${id}`

    await fetch(url, {
      method: isFollowing ? 'DELETE' : 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    setIsFollowing(!isFollowing)

    setProfile((prev) => ({
      ...prev,
      followers: isFollowing
        ? prev.followers.filter((f) => f !== currentUser._id)
        : [...prev.followers, currentUser._id],
    }))
  }

  // OPEN POST MODAL
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

      setComments(
        Array.isArray(data)
          ? data.map((c) => ({
              id: c._id,
              author: c.user?.username || 'user',
              text: c.text,
              avatar: c.user?.avatar || 'https://placehold.co/32',
              likes: Array.isArray(c.likes) ? c.likes.length : 0,
              liked: Array.isArray(c.likes)
                ? c.likes.includes(currentUser._id)
                : false,
              createdAt: c.createdAt,
            }))
          : [],
      )
    } catch (err) {
      console.error('FETCH COMMENTS ERROR:', err)
      setComments([])
    }

    setNewComment('')
  }

  const closePostModal = () => {
    setSelectedPost(null)
    setComments([])
    setNewComment('')
  }

  // LIKE POST
  const handleLikeToggle = async () => {
    if (!selectedPost) return

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
        author: c.user?.username || currentUser.username,
        text: c.text,
        avatar: c.user?.avatar || currentUser.avatar,
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddComment()
    }
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="other-profile">
      <div className="profile-header">
        <img
          src={profile.avatar || 'https://placehold.co/120'}
          className="profile-avatar"
        />

        <div className="profile-info">
          <div className="profile-flex">
            <h2>{profile.username}</h2>

            <div className="profile-actions">
              <button className="follow-btn" onClick={handleFollow}>
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>

              <button className="message-btn">Message</button>
            </div>
          </div>

          <div className="profile-stats">
            <span>
              <b>{posts.length}</b> posts
            </span>
            <span>
              <b>{profile.followers?.length || 0}</b> followers
            </span>
            <span>
              <b>{profile.following?.length || 0}</b> following
            </span>
          </div>

          <div className="profile-fullname">{profile.fullName}</div>
          <div className="profile-bio">{profile.bio}</div>
        </div>
      </div>

      <div className="profile-posts-grid">
        {posts.map((post) => (
          <div
            key={post._id}
            className="post-item"
            onClick={() => openPostModal(post)}
          >
            <img src={post.image} alt="" />
          </div>
        ))}
      </div>

      {selectedPost && (
        <PostModal
          user={profile}
          post={selectedPost}
          comments={comments}
          isLiked={selectedPost.liked}
          likesCount={selectedPost.likesCount}
          timeAgo={() => ''}
          newComment={newComment}
          setNewComment={setNewComment}
          onClose={closePostModal}
          onLikeToggle={handleLikeToggle}
          onCommentLike={handleCommentLike}
          onDeleteComment={deleteComment}
          onAddComment={handleAddComment}
          onCommentKeyDown={handleKeyDown}
          onDeletePost={() => {}}
          onSaveEdit={() => {}}
        />
      )}
    </div>
  )
}
