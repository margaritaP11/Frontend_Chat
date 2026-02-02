import { useNavigate } from 'react-router-dom'
import './ProfileHeader.css'

export default function ProfileHeader({
  user,
  postsCount,
  showFullBio,
  setShowFullBio,
  bioLimit,
}) {
  const navigate = useNavigate()
  const isLongBio = user?.bio && user.bio.length > bioLimit

  return (
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
            <span className="stat-count">{postsCount}</span>
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

        {user.fullName && <p className="profile-fullname">{user.fullName}</p>}

        {user.bio && (
          <div className="profile-bio">
            {showFullBio ? user.bio : user.bio.slice(0, bioLimit)}
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
  )
}
