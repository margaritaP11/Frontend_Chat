import { useState } from 'react'
import PostComments from './PostComments'
import PostActions from './PostActions'
import SmileIcon from '../../assets/emoji.svg'
import './PostModal.css'

export default function PostModal({
  user,
  post,
  comments,
  isLiked,
  likesCount,
  timeAgo,
  newComment,
  setNewComment,
  onClose,
  onLikeToggle,
  onCommentLike,
  onDeleteComment,
  onAddComment,
  onCommentKeyDown,
  onDeletePost,
  onSaveEdit,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(post.text)

  return (
    <div className="modal-wrapper" onClick={onClose}>
      <div
        className="modal-layout"
        onClick={(e) => e.stopPropagation()} // ← НЕ дає закриватися при кліку всередині
      >
        {menuOpen && <div className="modal-darken" />}

        {/* LEFT SIDE */}
        <div className="modal-left">
          <img src={post.image} alt="post" className="modal-image" />
        </div>

        {/* RIGHT SIDE */}
        <div className="modal-right">
          {/* HEADER */}
          <div className="modal-header">
            <img
              src={user.avatar || 'https://placehold.co/40'}
              alt="avatar"
              className="modal-avatar"
            />

            <span className="modal-username">{user.username}</span>

            <div className="post-menu-dots" onClick={() => setMenuOpen(true)}>
              ⋯
            </div>
          </div>

          {/* MENU */}
          {menuOpen && (
            <div className="post-menu">
              <button
                className="danger"
                onClick={() => {
                  onDeletePost(post._id)
                  setMenuOpen(false)
                }}
              >
                Delete
              </button>

              <button
                onClick={() => {
                  setIsEditing(true)
                  setMenuOpen(false)
                }}
              >
                Edit
              </button>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/post/${post._id}`,
                  )
                }
              >
                Copy link
              </button>

              <button onClick={() => setMenuOpen(false)}>Cancel</button>
            </div>
          )}

          <div className="modal-divider" />

          {/* POST HEADER */}
          <div className="post-header">
            <img
              src={user.avatar || 'https://placehold.co/32'}
              alt="avatar"
              className="post-author-avatar"
            />

            <div className="post-author-block">
              <span className="post-author-name">{user.username}</span>

              {isEditing ? (
                <textarea
                  className="edit-post-input"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span className="post-caption-text">{post.text}</span>
              )}
            </div>
          </div>

          {/* SAVE / CANCEL */}
          {isEditing && (
            <div className="edit-buttons">
              <button
                className="save-btn"
                onClick={() => {
                  onSaveEdit(post._id, editText)
                  setIsEditing(false)
                }}
              >
                Save changes
              </button>

              <button
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false)
                  setEditText(post.text)
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {/* COMMENTS */}
          <PostComments
            comments={comments}
            timeAgo={timeAgo}
            onLike={onCommentLike}
            onDelete={onDeleteComment}
          />

          {/* ACTIONS */}
          <PostActions
            isLiked={isLiked}
            likesCount={likesCount}
            createdAt={post.createdAt}
            timeAgo={timeAgo}
            onLikeToggle={onLikeToggle}
          />

          {/* COMMENT INPUT */}
          <div className="comment-form">
            <img src={SmileIcon} alt="" className="comment-emoji" />

            <input
              type="text"
              className="comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={onCommentKeyDown}
            />

            <button
              className="send-button"
              onClick={onAddComment}
              disabled={!newComment.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
