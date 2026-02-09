import { Routes, Route } from 'react-router-dom'

// Main pages
import Feed from '../pages/Feed/Feed'
import Explore from '../pages/Explore/Explore'
import MessagesPage from '../pages/Messages/MessagesPage'
import Notifications from '../pages/Notifications/Notifications'

// Create Post
import CreatePostPage from '../pages/CreatePost/CreatePostPage'

// Profile pages
import UserProfile from '../pages/UserProfile/UserProfile'
import OtherProfilePage from '../pages/Profile/OtherProfilePage'
import CreateProfile from '../pages/Profile/CreateProfile'
import EditProfile from '../pages/EditProfile/EditProfile'

// Auth
import Login from '../pages/Registration/Login'
import Register from '../pages/Registration/Register'
import ResetPassword from '../pages/Registration/ResetPassword'

// Post page
import PostPage from '../pages/PostPage/PostPage'

// Search page ⭐
import SearchPanel from '../pages/Search/SearchPanel'

// 404
import NotFoundPage from '../pages/NotFound/NotFoundPage'

export default function AppRoutes({ location }) {
  return (
    <Routes location={location}>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<ResetPassword />} />
      {/* Main */}
      <Route path="/" element={<Feed />} />
      <Route path="/search" element={<SearchPanel />} /> {/* ⭐ ДОДАНО */}
      <Route path="/explore" element={<Explore />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/notifications" element={<Notifications />} />
      {/* Create Post */}
      <Route path="/create" element={<CreatePostPage />} />
      {/* Profile */}
      <Route path="/profile/me" element={<UserProfile />} />
      <Route path="/profile/create" element={<CreateProfile />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/profile/:id" element={<OtherProfilePage />} />
      {/* Post */}
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/messages/:userId" element={<MessagesPage />} />
      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
