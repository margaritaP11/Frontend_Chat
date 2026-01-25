import { Routes, Route } from 'react-router-dom'

import Feed from '../pages/Feed'
import Search from '../pages/Search'
import Explore from '../pages/Explore'
import Chat from '../pages/Chat'
import Notifications from '../pages/Notifications'
import Create from '../pages/Create'
import Profile from '../pages/Profile'

import Login from '../pages/Login'
import Register from '../pages/Register'
import ResetPassword from '../pages/ResetPassword'

export default function AppRoutes() {
  return (
    <Routes>
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
      <Route path="/create" element={<Create />} />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  )
}
