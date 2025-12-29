import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginModal from './LoginModal'
import SearchBar from './SearchBar'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, isCreator, user, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showCreatorMessage, setShowCreatorMessage] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null) // 'games' or 'rooms' or null
  const [gamesWithLiveRooms, setGamesWithLiveRooms] = useState([])
  const navigate = useNavigate()

  // All available games
  const allGames = [
    { name: 'BGMI', path: '/game/bgmi', key: 'bgmi' },
    { name: 'CODM', path: '/game/codm', key: 'codm' },
    { name: 'VALORANT', path: '/game/valorant', key: 'valorant' },
    { name: 'FREE FIRE', path: '/game/freefire', key: 'freefire' },
    { name: 'MINECRAFT', path: '/game/minecraft', key: 'minecraft' },
    { name: 'FORTNITE', path: '/game/fortnite', key: 'fortnite' },
    { name: 'PUBG', path: '/game/pubg', key: 'pubg' },
  ]

  // Fetch games with live rooms
  useEffect(() => {
    let isRateLimited = false
    
    const fetchLiveRooms = async () => {
      try {
        const { roomStorage } = await import('../services/storage')
        const liveRooms = await roomStorage.getLive()
        
        // Get unique game types from live rooms
        const uniqueGames = [...new Set(liveRooms.map(room => room.gameType))]
        const gamesWithRooms = allGames.filter(game => 
          uniqueGames.includes(game.key)
        )
        setGamesWithLiveRooms(gamesWithRooms)
        isRateLimited = false // Reset on success
      } catch (error) {
        // Silently handle rate limit errors to avoid console spam
        if (error.message && (error.message.includes('429') || error.message.includes('Too many requests'))) {
          isRateLimited = true
          // Don't log to avoid spam
        } else {
          // Only log non-rate-limit errors
          console.error('Error fetching live rooms:', error)
        }
      }
    }

    fetchLiveRooms()
    
    // Refresh every 30 seconds to avoid rate limiting (was 10 seconds)
    // This reduces requests from 6/min to 2/min
    const interval = setInterval(fetchLiveRooms, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking inside a dropdown or its button
      const dropdownElement = e.target.closest('.nav-dropdown')
      if (!dropdownElement) {
        setActiveDropdown(null)
      }
    }
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [activeDropdown])

  const handleLoginClick = () => {
    setShowLogin(true)
  }

  const handleCloseLogin = () => {
    setShowLogin(false)
  }

  const handleCreatorClick = (e) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      alert('Login as a creator first!')
      setShowLogin(true)
      return
    }
    if (!isCreator()) {
      alert('You\'re not a creator! Join our creator program.')
      return
    }
    navigate('/creator/dashboard')
  }



  return (
    <>
      <nav className="navbar-custom">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <span className="brand-text">EZ</span>
            <span className="brand-accent">Sports</span>
          </Link>

          <button
            className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Events
            </Link>

            <div 
              className={`nav-dropdown ${activeDropdown === 'games' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('games')}
              onMouseLeave={() => {
                // Close on mouse leave after a small delay to allow moving to dropdown menu
                setTimeout(() => {
                  const dropdownElement = document.querySelector('.nav-dropdown.active')
                  if (dropdownElement && !dropdownElement.matches(':hover')) {
                    setActiveDropdown(null)
                  }
                }, 150)
              }}
            >
              <button 
                type="button"
                className="nav-link dropdown-btn"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const newState = activeDropdown === 'games' ? null : 'games'
                  setActiveDropdown(newState)
                }}
              >
                Games <span className={`dropdown-arrow ${activeDropdown === 'games' ? 'active' : ''}`}>▼</span>
              </button>
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                {allGames.map((game) => (
                  <Link
                    key={game.path}
                    to={game.path}
                    className="dropdown-item"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setActiveDropdown(null)
                    }}
                  >
                    {game.name}
                  </Link>
                ))}
              </div>
            </div>

            <div 
              className={`nav-dropdown ${activeDropdown === 'rooms' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('rooms')}
              onMouseLeave={() => {
                // Close on mouse leave after a small delay to allow moving to dropdown menu
                setTimeout(() => {
                  const dropdownElement = document.querySelector('.nav-dropdown.active')
                  if (dropdownElement && !dropdownElement.matches(':hover')) {
                    setActiveDropdown(null)
                  }
                }, 150)
              }}
            >
              <button 
                type="button"
                className="nav-link dropdown-btn"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const newState = activeDropdown === 'rooms' ? null : 'rooms'
                  setActiveDropdown(newState)
                }}
              >
                Rooms <span className={`dropdown-arrow ${activeDropdown === 'rooms' ? 'active' : ''}`}>▼</span>
              </button>
              <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                {gamesWithLiveRooms.length > 0 ? (
                  <>
                    {gamesWithLiveRooms.map((game) => (
                      <Link
                        key={game.path}
                        to={`/game/${game.key}`}
                        className="dropdown-item live-game-item"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsMenuOpen(false)
                          setActiveDropdown(null)
                        }}
                      >
                        <span className="live-indicator-small">🔴</span>
                        {game.name}
                      </Link>
                    ))}
                    <div className="dropdown-divider"></div>
                    <Link to="/rooms" className="dropdown-item" onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setActiveDropdown(null)
                    }}>
                      Browse All Rooms
                    </Link>
                    <Link to="/rooms/create" className="dropdown-item" onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setActiveDropdown(null)
                    }}>
                      Create Room
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="dropdown-item disabled">No live rooms available</div>
                    <div className="dropdown-divider"></div>
                    <Link to="/rooms" className="dropdown-item" onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setActiveDropdown(null)
                    }}>
                      Browse Rooms
                    </Link>
                    <Link to="/rooms/create" className="dropdown-item" onClick={(e) => {
                      e.stopPropagation()
                      setIsMenuOpen(false)
                      setActiveDropdown(null)
                    }}>
                      Create Room
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>

            <div className="navbar-actions">
              <SearchBar />
              {isAuthenticated() && isCreator() ? (
                <Link to="/creator/dashboard" className="btn-creator">
                  Creator
                </Link>
              ) : (
                <button
                  className={`btn-creator ${!isAuthenticated() || !isCreator() ? 'btn-creator-disabled' : ''}`}
                  onClick={handleCreatorClick}
                >
                  Creator
                </button>
              )}
              {isAuthenticated() ? (
                <>
                  <span className="user-greeting">Hi, {user?.username}</span>
                  <button className="btn-logout" onClick={logout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-login" onClick={handleLoginClick}>
                    Log In
                  </button>
                  <button className="btn-signup" onClick={handleLoginClick}>
                    Sign Up
                  </button>
                </>
              )}
            </div>
        </div>
      </nav>
      <LoginModal show={showLogin} onClose={handleCloseLogin} />
    </>
  )
}

export default Navbar
