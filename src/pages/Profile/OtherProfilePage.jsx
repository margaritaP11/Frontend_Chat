import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import './OtherProfile.css'

export default function OtherProfilePage() {
  const { id } = useParams()
  const { user: currentUser } = useContext(AuthContext)

  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`http://localhost:8080/api/profile/${id}`)
      const data = await res.json()
      setProfile(data)
    }

    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:8080/api/posts/user/${id}`)
      const data = await res.json()
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
          <div key={post._id} className="post-item">
            <img src={post.image} alt="" />
          </div>
        ))}
      </div>
    </div>
  )
}
