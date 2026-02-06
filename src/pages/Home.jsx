import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import HeroCarousel from '../components/HeroCarousel'
import EventCards from '../components/EventCards'
import LiveStreams from '../components/LiveStreams'
import GameEvents from '../components/GameEvents'
import Footer from '../components/Footer'
import { getGameImages } from '../utils/gameImages'
import '../utils/autoLiveChecker' // Auto-check for scheduled rooms
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const [rooms, setRooms] = useState([])
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check for auto-go-live first
        const { checkAndAutoGoLive } = await import('../utils/autoLiveChecker')
        await checkAndAutoGoLive()
        
        const { roomStorage, streamStorage } = await import('../services/storage')
        
        // Get all rooms (all statuses)
        const allRooms = await roomStorage.getAll()
        // Sort: live first, then scheduled, then others
        const sortedRooms = allRooms.sort((a, b) => {
          if (a.status === 'live' && b.status !== 'live') return -1
          if (a.status !== 'live' && b.status === 'live') return 1
          if (a.status === 'scheduled' && b.status !== 'scheduled') return -1
          if (a.status !== 'scheduled' && b.status === 'scheduled') return 1
          return 0
        })
        setRooms(sortedRooms)
        
        // Get all live streams
        const liveStreams = await streamStorage.getLive()
        setStreams(liveStreams)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Refresh data every 30 seconds to check for new live streams
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-page">
      <HeroCarousel />
      <EventCards />
      
      {/* Show All Rooms - Limited to 3 */}
      {rooms.length > 0 && (
        <section className="rooms-preview-section">
          <div className="container">
            <h2 className="section-title">ROOMS</h2>
            <div className="rooms-preview-grid">
              {rooms.slice(0, 3).map((room) => {
                const gameImages = getGameImages(room.gameType)
                const roomId = room.id ?? room._id
                if (!roomId) return null
                return (
                  <Link
                    key={roomId}
                    to={`/room/${roomId}`}
                    className="room-preview-card"
                  >
                    <div className="room-preview-image">
                      <img 
                        src={gameImages.normal} 
                        alt={room.roomName}
                        className="room-image-normal"
                        onError={(e) => {
                          e.target.src = '/images/bgmi.jpg'
                        }}
                      />
                      <img 
                        src={gameImages.hover} 
                        alt={room.roomName}
                        className="room-image-hover"
                        onError={(e) => {
                          e.target.src = '/images/bgmi.gif'
                        }}
                      />
                      <div className="room-preview-overlay">
                        <span className={`status-badge status-${room.status}`}>
                          {room.status === 'live' ? '🔴 LIVE' : room.status === 'scheduled' ? '📅 SCHEDULED' : '⚪ ENDED'}
                        </span>
                      </div>
                    </div>
                    <div className="room-preview-content">
                      <div className="room-preview-header">
                        <h3>{room.roomName}</h3>
                      </div>
                      <p className="room-preview-game">{(room.gameType ?? '').toUpperCase() || 'N/A'}</p>
                      <p className="room-preview-creator">by {room.creatorUsername}</p>
                      {room.description && (
                        <p className="room-preview-description">{room.description}</p>
                      )}
                      {room.maxPlayers && (
                        <p className="room-preview-players">👥 Max: {room.maxPlayers} players</p>
                      )}
                      {room.metadata?.views !== undefined && (
                        <p className="room-preview-views">👁️ {room.metadata.views} viewers</p>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
            {rooms.length > 3 && (
              <div className="view-more-container">
                <Link to="/rooms" className="view-more-btn">
                  View More Rooms →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {isAuthenticated() && <LiveStreams />}
      {isAuthenticated() && <GameEvents />}
      {!isAuthenticated() && (
        <div className="login-prompt">
          <div className="container">
            <h2>Welcome to EZSports</h2>
            <p>Please log in to view detailed live streams, gaming rooms, and events</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Home

