import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'
import CreatePostPage from './pages/CreatePost/CreatePostPage'
import { useState } from 'react'
import SearchPanel from './pages/Search/SearchPanel'

import './App.css'

export default function App() {
  const location = useLocation()
  const background = location.state?.background

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/reset'

  if (isAuthPage) {
    return <AppRoutes location={location} />
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />

      <div style={{ marginLeft: '240px', width: '100%', padding: '0 20px' }}>
        <AppRoutes location={background || location} />

        {location.pathname === '/create' && <CreatePostPage />}
      </div>

      {isSearchOpen && (
        <>
          <div className="overlay" onClick={() => setIsSearchOpen(false)} />
          <SearchPanel onClose={() => setIsSearchOpen(false)} />
        </>
      )}
    </div>
  )
}
