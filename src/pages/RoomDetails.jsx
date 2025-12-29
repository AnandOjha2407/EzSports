import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import RoomCredentials from '../components/RoomCredentials'
import './RoomDetails.css'

const RoomDetails = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { roomStorage } = await import('../services/storage')
        const fetchedRoom = roomStorage.getById(roomId)
        
        if (fetchedRoom) {
          setRoom(fetchedRoom)
        } else {
          // Try API
          try {
            const { roomService } = await import('../services/api')
            const data = await roomService.getById(roomId)
            setRoom(data)
          } catch (apiError) {
            console.error('Room not found:', apiError)
            navigate('/')
          }
        }
      } catch (error) {
        console.error('Error fetching room:', error)
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      fetchRoom()
    }
  }, [roomId, navigate])

  if (loading) {
    return (
      <div className="room-details-page">
        <div className="container">
          <p>Loading room details...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="room-details-page">
        <div className="container">
          <h2>Room not found</h2>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="room-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="room-details-header">
          <div className="room-status-badge">
            <span className={`status-indicator status-${room.status}`}>
              {room.status === 'live' ? '🔴 LIVE' : room.status === 'scheduled' ? '📅 SCHEDULED' : '⚫ ENDED'}
            </span>
          </div>
          <h1>{room.roomName}</h1>
          <p className="room-game-type">{room.gameType.toUpperCase()}</p>
        </div>

        <div className="room-details-content">
          <div className="room-main-info">
            <div className="info-card">
              <h3>Room Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Creator:</span>
                  <span className="info-value">{room.creatorUsername}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Status:</span>
                  <span className="info-value">{room.status.toUpperCase()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Max Players:</span>
                  <span className="info-value">{room.maxPlayers}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Current Players:</span>
                  <span className="info-value">{room.currentPlayers || 0}</span>
                </div>
                {room.scheduledTime && (
                  <div className="info-item">
                    <span className="info-label">Scheduled Time:</span>
                    <span className="info-value">
                      {new Date(room.scheduledTime).toLocaleString()}
                    </span>
                  </div>
                )}
                {room.startedAt && (
                  <div className="info-item">
                    <span className="info-label">Started At:</span>
                    <span className="info-value">
                      {new Date(room.startedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {room.description && (
              <div className="info-card">
                <h3>Description</h3>
                <p className="room-description">{room.description}</p>
              </div>
            )}

            {room.status === 'live' && room.credentials && (
              <div className="info-card">
                <RoomCredentials
                  gameType={room.gameType}
                  credentials={room.credentials}
                  roomName={room.roomName}
                />
              </div>
            )}

            {room.streamLinks && (room.streamLinks.youtube || room.streamLinks.twitch) && (
              <div className="info-card">
                <h3>Watch Stream</h3>
                <div className="stream-links">
                  {room.streamLinks.youtube && (
                    <a
                      href={room.streamLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stream-link youtube"
                    >
                      📺 Watch on YouTube
                    </a>
                  )}
                  {room.streamLinks.twitch && (
                    <a
                      href={room.streamLinks.twitch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="stream-link twitch"
                    >
                      🎮 Watch on Twitch
                    </a>
                  )}
                </div>
              </div>
            )}

            {room.metadata && (
              <div className="info-card">
                <h3>Room Stats</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Views</span>
                    <span className="stat-value">{room.metadata.views || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Likes</span>
                    <span className="stat-value">{room.metadata.likes || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Shares</span>
                    <span className="stat-value">{room.metadata.shares || 0}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomDetails

