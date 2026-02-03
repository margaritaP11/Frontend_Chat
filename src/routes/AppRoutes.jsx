import { Routes, Route } from 'react-router-dom'

// Main pages
import Feed from '../pages/Feed/Feed'
import Search from '../pages/Search/SearchPanel' // ← ПРАВИЛЬНО
import Explore from '../pages/Explore'
import Chat from '../pages/Chat'
import Notifications from '../pages/Notifications'

// Create Post
import CreatePostPage from '../pages/CreatePost/CreatePostPage'

// Profile pages
import UserProfile from '../pages/UserProfile/UserProfile'
import CreateProfile from '../pages/Profile/CreateProfile'
import EditProfile from '../pages/EditProfile/EditProfile'

// Auth
import Login from '../pages/Registration/Login'
import Register from '../pages/Registration/Register'
import ResetPassword from '../pages/Registration/ResetPassword'

export default function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<ResetPassword />} />

      {/* Main */}
      <Route path="/" element={<Feed />} />
      <Route path="/search" element={<Search />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Create Post */}
      <Route path="/create" element={<CreatePostPage />} />

      {/* Profile */}
      <Route path="/profile/:id" element={<UserProfile />} />
      <Route path="/profile/create" element={<CreateProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  )
}
