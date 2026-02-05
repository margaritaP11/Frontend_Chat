import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'
import CreatePostPage from './pages/CreatePost/CreatePostPage'
import { useState, useEffect } from 'react'
import SearchPanel from './pages/Search/SearchPanel'
import Feed from './pages/Feed/Feed'

import './App.css'

export default function App() {
  const location = useLocation()
  const background = location.state?.background

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/reset'

  // Закриваємо пошук при переході на іншу сторінку
  useEffect(() => {
    setIsSearchOpen(false)
  }, [location.pathname])

  if (isAuthPage) {
    return <AppRoutes location={location} />
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />

      <div
        style={{
          marginLeft: '240px',
          width: '100%',
          padding: '0 20px',
          position: 'relative',
        }}
      >
        {isSearchOpen && (
          <div className="home-background">
            <Feed />
          </div>
        )}

        {/* Основні маршрути */}
        <div
          className="routes-layer"
          style={{ display: isSearchOpen ? 'none' : 'block' }}
        >
          <AppRoutes location={background || location} />
        </div>

        {/* SearchPanel поверх усього */}
        {isSearchOpen && (
          <>
            <div className="overlay" onClick={() => setIsSearchOpen(false)} />
            <SearchPanel onClose={() => setIsSearchOpen(false)} />
          </>
        )}
      </div>
    </div>
  )
}
