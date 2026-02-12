import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import { useNavigate } from 'react-router-dom'

export default function CreateProfile() {
  const { setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [website, setWebsite] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState(null)
  const [preview, setPreview] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const textRes = await fetch('http://localhost:8080/api/profile/me', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ username, fullName, website, bio }),
    })

    let createdUser = await textRes.json()

    if (avatar) {
      const formData = new FormData()
      formData.append('avatar', avatar)

      const avatarRes = await fetch(
        'http://localhost:8080/api/profile/avatar',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        },
      )

      createdUser = await avatarRes.json()
    }

    setUser(createdUser)
    navigate('/profile')
  }

  return (
    <div className="create-page">
      <Sidebar />

      <div className="create-box">
        <h2>Create your profile</h2>

        <form onSubmit={handleSubmit} className="create-form">
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
          </label>

          <label className="photo-upload">
            Upload avatar
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                setAvatar(file)
                setPreview(URL.createObjectURL(file))
              }}
            />
          </label>

          {preview && (
            <img src={preview} alt="preview" className="preview-img" />
          )}

          <button type="submit" className="create-save">
            Create profile
          </button>
        </form>
      </div>
    </div>
  )
}
