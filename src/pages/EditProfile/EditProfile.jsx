import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URL } from '../../config'
import './EditProfile.css'

export default function EditProfile() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const isNew = !user || !user.username

  const [username, setUsername] = useState(user?.username || '')
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [website, setWebsite] = useState(user?.website || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(null)

  // ---------------------- АВАТАР ----------------------
  let avatarSrc = 'https://placehold.co/150'
  const rawAvatar = user?.avatar?.url || user?.avatar

  if (rawAvatar) {
    if (rawAvatar.startsWith('data:image')) avatarSrc = rawAvatar
    else if (rawAvatar.startsWith('http')) avatarSrc = rawAvatar
    else if (rawAvatar.startsWith('/')) avatarSrc = `${BACKEND_URL}${rawAvatar}`
    else avatarSrc = `${BACKEND_URL}/${rawAvatar}`
  }

  // ---------------------- SUBMIT ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault()

    const method = isNew ? 'POST' : 'PUT'

    // --- TEXT UPDATE ---
    const textRes = await fetch(`${BACKEND_URL}/api/profile/me`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ username, fullName, website, bio }),
    })

    let updatedUser = await textRes.json()

    // --- AVATAR UPDATE ---
    if (avatar) {
      const formData = new FormData()
      formData.append('avatar', avatar)

      const avatarRes = await fetch(`${BACKEND_URL}/api/profile/avatar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      updatedUser = await avatarRes.json()
    }

    setUser(updatedUser)
    navigate('/profile')
  }

  return (
    <div className="edit-page">
      <Sidebar />

      <div className="edit-box">
        <h2 className="edit-title">
          {isNew ? 'Create profile' : 'Edit profile'}
        </h2>

        <div className="edit-header">
          <img
            src={preview || avatarSrc}
            alt="avatar"
            className="edit-avatar"
          />

          <div className="edit-header-content">
            <div className="edit-header-text">
              <div className="edit-username">{username}</div>
              {bio && (
                <div className="edit-subtitle">• {bio.split('\n')[0]}</div>
              )}
            </div>

            <label className="edit-photo-button">
              New photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0]
                  setAvatar(file)
                  setPreview(URL.createObjectURL(file))
                }}
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label>
            Full name
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Website
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>

          <label>
            About
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={150}
            />
            <div className="char-count">{bio.length} / 150</div>
          </label>

          <button type="submit" className="edit-save">
            {isNew ? 'Create profile' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
