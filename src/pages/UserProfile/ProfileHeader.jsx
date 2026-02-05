import './ProfileHeader.css'

export default function ProfileHeader({
  user,
  postsCount,
  followersCount,
  followingCount,
}) {
  return (
    <div className="profile-header">
      <img
        src={user.avatar || 'https://placehold.co/120'}
        className="profile-avatar"
      />

      <div className="profile-info">
        <h2>{user.username}</h2>

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
