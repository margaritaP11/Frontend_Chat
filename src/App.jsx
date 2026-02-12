import Sidebar from './components/Sidebar'
import AppRoutes from './routes/AppRoutes'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import SearchPanel from './pages/Search/SearchPanel'
import Feed from './pages/Feed/Feed'

import Footer from './components/Footer'
import MobileTopBar from './components/MobileTopBar'
import MobileFooter from './components/MobileFooter'

import './App.css'

export default function App() {
  const location = useLocation()
  const background = location.state?.background

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [lastPath, setLastPath] = useState(location.pathname)

  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/reset'

  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    if (isSearchOpen) {
      setIsSearchOpen(false)
    }
  }

  if (isAuthPage) {
    return <AppRoutes location={location} />
  }

  return (
    <>
      <MobileTopBar />

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
      <MobileFooter />
    </>
  )
}
