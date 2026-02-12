import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { BACKEND_URL } from '../../config'

import uploadIcon from '../../assets/Download1.svg'
import emojiIcon from '../../assets/emoji.svg'
import './CreatePostPage.css'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [imageFile, setImageFile] = useState(null)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const onClose = () => navigate(-1)

  // ---------------------- АВАТАР ----------------------
  let avatarSrc = 'https://placehold.co/40'
  const rawAvatar = user?.avatar?.url || user?.avatar

  if (rawAvatar) {
    if (rawAvatar.startsWith('data:image')) avatarSrc = rawAvatar
    else if (rawAvatar.startsWith('http')) avatarSrc = rawAvatar
    else if (rawAvatar.startsWith('/')) avatarSrc = `${BACKEND_URL}${rawAvatar}`
    else avatarSrc = `${BACKEND_URL}/${rawAvatar}`
  }

  // ---------------------- СОЗДАНИЕ ПОСТА ----------------------
  const handleSubmit = async () => {
    if (!imageFile) return
    setLoading(true)

    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('text', caption)

    try {
      const res = await fetch(`${BACKEND_URL}/api/posts`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      })

      const data = await res.json()
      console.log('POST CREATED:', data)

      setLoading(false)
      onClose()
    } catch (err) {
      console.error('POST CREATE ERROR:', err)
      setLoading(false)
    }
  }

  return (
    <div className="create-overlay">
      <div className="create-wrapper">
        <div className="create-header">
          <button
            className="share-button"
            onClick={handleSubmit}
            disabled={!imageFile || loading}
          >
            {loading ? 'Sharing...' : 'Share'}
          </button>
        </div>

        <div className="create-body">
          <div className="create-left">
            {!imageFile ? (
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  hidden
                />
                <img src={uploadIcon} alt="upload" className="upload-svg" />
              </label>
            ) : (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="preview"
                className="preview-image"
              />
            )}
          </div>

          <div className="create-right">
            <div className="user-info">
              <img src={avatarSrc} alt="avatar" className="avatar-img" />
              <span className="username">{user?.username}</span>
            </div>

            <textarea
              className="caption-input"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <div className="caption-footer">
              <img src={emojiIcon} alt="emoji" className="emoji-icon" />
              <span className="char-count">{caption.length}/2200</span>
            </div>

            <div className="divider"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
