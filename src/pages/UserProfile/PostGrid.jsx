import './PostGrid.css'

export default function PostGrid({ posts, onOpenPost }) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return <p>No posts yet</p>
  }

  return (
    <div className="grid">
      {posts.map((post) => (
        <img
          key={post._id}
          src={post.image}
          alt={post.caption || ''}
          className="grid-item"
          onClick={() => onOpenPost(post)}
        />
      ))}
    </div>
  )
}
