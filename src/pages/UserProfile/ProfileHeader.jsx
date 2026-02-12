import './ProfileHeader.css'
import { BACKEND_URL } from '../../config'

export default function ProfileHeader({
  user,
  postsCount,
  followersCount,
  followingCount,
  isOwner,
}) {
  const avatarSrc = user.avatar
    ? user.avatar.startsWith('http')
      ? user.avatar
      : `${BACKEND_URL}/${user.avatar}`
    : 'https://placehold.co/120'

  return (
    <div className="profile-header">
      <img
        src={avatarSrc}
        className="profile-avatar"
      />

      <div className="profile-info">
        <div className="profile-top-row">
          <h2 className="profile-username">{user.username}</h2>

          {isOwner && (
            <button
              className="edit-profile-btn"
              onClick={() => (window.location.href = '/profile/edit')}
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-stats">
          <span>
            <b>{postsCount}</b> posts
          </span>
          <span>
            <b>{followersCount}</b> followers
          </span>
          <span>
            <b>{followingCount}</b> following
          </span>
        </div>

        <div className="profile-fullname">{user.fullName}</div>
        <div className="profile-bio">{user.bio}</div>
      </div>
    </div>
  )
}
