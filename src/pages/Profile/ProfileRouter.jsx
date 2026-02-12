import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

import UserProfile from '../UserProfile/UserProfile'

export default function ProfileRouter() {
  const { user } = useContext(AuthContext)

  if (user === null) {
    return null
  }

  if (!user.username) {
    return <Navigate to="/profile/edit" />
  }

  return <UserProfile />
}
