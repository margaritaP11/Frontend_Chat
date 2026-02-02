import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'
import CreatePostPage from './pages/CreatePost/CreatePostPage'

export default function App() {
  const location = useLocation()
  const background = location.state?.background

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/reset'

  // Если это страница авторизации — не показываем Sidebar
  if (isAuthPage) {
    return <AppRoutes location={location} />
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '240px', width: '100%', padding: '0 20px' }}>
        {/* Основные маршруты */}
        <AppRoutes location={background || location} />

        {/* Модалка создания поста */}
        {location.pathname === '/create' && <CreatePostPage />}
      </div>
    </div>
  )
}
