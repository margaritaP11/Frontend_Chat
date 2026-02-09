import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import SearchPanel from './pages/Search/SearchPanel'
import Feed from './pages/Feed/Feed'
import Footer from './components/Footer'

import './App.css'

export default function App() {
  const location = useLocation()
  const background = location.state?.background

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/reset'

  useEffect(() => {
    setIsSearchOpen(false)
  }, [location.pathname])

  if (isAuthPage) {
    return <AppRoutes location={location} />
  }

  return (
    <>
      <div className="app-layout">
        <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />

        <div className="content-wrapper">
          {isSearchOpen && (
            <div className="home-background">
              <Feed />
            </div>
          )}

          <div
            className="routes-layer"
            style={{ display: isSearchOpen ? 'none' : 'block' }}
          >
            <AppRoutes location={background || location} />
          </div>

          {isSearchOpen && (
            <>
              <div className="overlay" onClick={() => setIsSearchOpen(false)} />
              <SearchPanel onClose={() => setIsSearchOpen(false)} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
