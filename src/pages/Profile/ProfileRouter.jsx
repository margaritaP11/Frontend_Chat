import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'
import UserProfile from './UserProfile'

export default function ProfileRouter() {
  const { user } = useContext(AuthContext)

  // Если профиля нет → отправляем на создание/редактирование
  if (!user || !user.username) {
    return <Navigate to="/profile/edit" />
  }

  // Если профиль есть → показываем его
  return <UserProfile />
}
