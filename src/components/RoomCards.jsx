import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import CredentialsModal from './CredentialsModal'
import { getGameImages } from '../utils/gameImages'
import './RoomCards.css'

const RoomCards = () => {
  const { isAuthenticated } = useAuth()
  const [showCredentialsModal, setShowCredentialsModal] = useState(false)
  const [selectedRoomData, setSelectedRoomData] = useState(null)
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Try API first
        try {
          const { roomService } = await import('../services/api')
          const data = await roomService.getLive()
          setRooms(data)
        } catch (apiError) {
          // Fallback to local storage - get ALL rooms, not just live
          const { roomStorage } = await import('../services/storage')
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
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchRooms, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'red'
      case 'scheduled':
        return 'yellow'
      case 'ended':
        return 'gray'
      default:
        return 'gray'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'live':
        return '🔴 LIVE'
      case 'scheduled':
        return '📅 SCHEDULED'
      case 'ended':
        return '⚪ ENDED'
      default:
        return status.toUpperCase()
    }
  }

  if (loading) {
    return (
      <div className="room-cards-section">
        <div className="container">
          <p style={{ color: 'var(--text-primary)', textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            Loading rooms...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="room-cards-section">
      <div className="container">
        <h2 className="section-title">Gaming Rooms</h2>
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No rooms available at the moment. Be the first to create one!</p>
            {!isAuthenticated() && (
              <p style={{ marginTop: 'var(--spacing-md)', fontSize: '0.9rem', opacity: 0.8 }}>
                <Link to="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>
                  Login to create or join rooms
                </Link>
              </p>
            )}
          </div>
        ) : (
          <div className="room-cards-grid">
            {rooms.map((room) => {
              const gameImages = getGameImages(room.gameType)
              const gamePath = `/game/${room.gameType}`
              const isLive = room.status === 'live'
              const viewers = room.metadata?.views || 0
              const statusColor = getStatusColor(room.status)
              const statusLabel = getStatusLabel(room.status)
              
              return (
                <div key={room.id} className="room-card">
                  <div className="room-card-wrapper">
                    <Link to={`/room/${room.id}`} className="room-card-link">
                      <div className="room-card-image-container">
                        <img 
                          src={gameImages.normal} 
                          className="room-image room-image-1" 
                          alt={room.roomName}
                          onError={(e) => {
                            e.target.src = '/images/bgmi.jpg'
                          }}
                        />
                        <img 
                          src={gameImages.hover} 
                          className="room-image room-image-2" 
                          alt={room.roomName}
                          onError={(e) => {
                            e.target.src = '/images/bgmi.gif'
                          }}
                        />
                        <div className="room-card-overlay" />
                        <div className="room-card-title-overlay">
                          <h3 className="room-title">{room.roomName}</h3>
                          <p className="room-game-type">{room.gameType.toUpperCase()}</p>
                        </div>
                      </div>
                    </Link>
                    <div className="room-card-body">
                      <p className="room-description">
                        {room.description || `Join ${room.roomName} for ${room.gameType.toUpperCase()} gaming sessions`}
                      </p>
                      <div className="room-info">
                        {room.creatorUsername && (
                          <p className="room-creator">👤 Creator: {room.creatorUsername}</p>
                        )}
                        {isLive && (
                          <p className="room-viewers">👁️ {viewers} {viewers === 1 ? 'viewer' : 'viewers'}</p>
                        )}
                        <p className="room-players">
                          👥 {room.currentPlayers || 0}/{room.maxPlayers || 100} players
                        </p>
                        {room.metadata?.category && (
                          <p className="room-category">🏷️ {room.metadata.category}</p>
                        )}
                      </div>
                      <div className="room-card-footer">
                        <div className="room-actions">
                          {isLive && room.credentials ? (
                            <button
                              className="room-btn room-btn-primary"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setSelectedRoomData({ 
                                  gameType: room.gameType, 
                                  credentials: room.credentials, 
                                  roomName: room.roomName 
                                })
                                setShowCredentialsModal(true)
                              }}
                            >
                              View Credentials
                            </button>
                          ) : (
                            <Link 
                              to={`/room/${room.id}`} 
                              className="room-btn room-btn-primary"
                            >
                              {room.status === 'scheduled' ? 'View Details' : 'Join Room'}
                            </Link>
                          )}
                          <Link 
                            to={gamePath}
                            className="room-btn room-btn-secondary"
                          >
                            Game Page
                          </Link>
                        </div>
                        <span className={`room-status status-${statusColor}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      {showCredentialsModal && selectedRoomData && (
        <CredentialsModal
          show={showCredentialsModal}
          onClose={() => {
            setShowCredentialsModal(false)
            setSelectedRoomData(null)
          }}
          gameType={selectedRoomData.gameType}
          credentials={selectedRoomData.credentials}
          roomName={selectedRoomData.roomName}
        />
      )}
    </div>
  )
}

export default RoomCards
