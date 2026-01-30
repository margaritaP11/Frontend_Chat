import { Routes, Route } from 'react-router-dom'

// Main pages
import Feed from '../pages/Feed'
import Search from '../pages/Search'
import Explore from '../pages/Explore'
import Chat from '../pages/Chat'
import Notifications from '../pages/Notifications'

// Create Post (страница-оверлей)
import CreatePostPage from '../pages/CreatePost/CreatePostPage'

// Profile pages
import ProfileRouter from '../pages/Profile/ProfileRouter'
import UserProfile from '../pages/Profile/UserProfile'
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

      {/* Main app */}
      <Route path="/" element={<Feed />} />
      <Route path="/search" element={<Search />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* Create Post — отдельная страница, но выглядит как модалка */}
      <Route path="/create" element={<CreatePostPage />} />

      {/* Profile logic */}
      <Route path="/profile" element={<ProfileRouter />} />
      <Route path="/profile/view" element={<UserProfile />} />
      <Route path="/profile/create" element={<CreateProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
    </Routes>
  )
}
