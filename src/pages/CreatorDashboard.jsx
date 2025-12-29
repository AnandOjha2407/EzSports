import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { roomService } from '../services/api'
import CreateRoomForm from '../components/CreateRoomForm'
import StreamForm from '../components/StreamForm'
import AnalyticsDashboard from '../components/AnalyticsDashboard'
import '../utils/autoLiveChecker' // Auto-check for scheduled rooms
import './CreatorDashboard.css'

const CreatorDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('rooms')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showStreamForm, setShowStreamForm] = useState(false)
  const [selectedRoomForStream, setSelectedRoomForStream] = useState(null)
  const [myRooms, setMyRooms] = useState([])
  const [myStreams, setMyStreams] = useState([])
  const [stats, setStats] = useState({
    totalRooms: 0,
    liveRooms: 0,
    totalViewers: 0,
    scheduledRooms: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch creator's rooms
    const fetchRooms = async () => {
      try {
        // Check for auto-go-live first
        const { checkAndAutoGoLive } = await import('../utils/autoLiveChecker')
        await checkAndAutoGoLive()
        
        // Try API first
        try {
          const rooms = await roomService.getMyRooms()
          setMyRooms(rooms)
          
          // Calculate stats
          const totalRooms = rooms.length
          const liveRooms = rooms.filter(r => r.status === 'live').length
          const totalViewers = rooms.reduce((sum, r) => sum + (r.metadata?.views || 0), 0)
          const scheduledRooms = rooms.filter(r => r.status === 'scheduled').length
          
          setStats({
            totalRooms,
            liveRooms,
            totalViewers,
            scheduledRooms,
          })
        } catch (apiError) {
          // Fallback to local storage
          const { roomStorage } = await import('../services/storage')
          const fetchedRooms = await roomStorage.getByCreator(user.id)
          setMyRooms(fetchedRooms)
          
          // Calculate stats
          const totalRooms = fetchedRooms.length
          const liveRooms = fetchedRooms.filter(r => r.status === 'live').length
          const totalViewers = fetchedRooms.reduce((sum, r) => sum + (r.metadata?.views || 0), 0)
          const scheduledRooms = fetchedRooms.filter(r => r.status === 'scheduled').length
          
          setStats({
            totalRooms,
            liveRooms,
            totalViewers,
            scheduledRooms,
          })
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchRooms()
    }
  }, [user])

  // Fetch creator's streams
  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const { streamStorage } = await import('../services/storage')
        const streams = await streamStorage.getByCreator(user?.id || '')
        setMyStreams(streams)
      } catch (error) {
        console.error('Error fetching streams:', error)
      }
    }

    if (user) {
      fetchStreams()
    }
  }, [user])

  const handleDeleteRoom = async (roomId) => {
    if (!roomId) {
      console.error('Room ID is missing')
      alert('Error: Room ID is missing')
      return
    }

    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return
    }

    try {
      const { roomStorage, streamStorage } = await import('../services/storage')
      
      // Delete the room
      await roomStorage.delete(roomId)
      
      // Also delete associated streams
      const streams = await streamStorage.getAll()
      const associatedStreams = streams.filter(s => 
        s.title && s.title.includes(`room-${roomId}`) ||
        (s.metadata && s.metadata.roomId === roomId)
      )
      
      for (const stream of associatedStreams) {
        await streamStorage.delete(stream.id || stream._id)
      }
      
      // Refresh the rooms list
      const { roomStorage: refreshRoomStorage } = await import('../services/storage')
      const updatedRooms = await refreshRoomStorage.getByCreator(user.id)
      setMyRooms(updatedRooms)
      
      // Update stats
      const totalRooms = updatedRooms.length
      const liveRooms = updatedRooms.filter(r => r.status === 'live').length
      const totalViewers = updatedRooms.reduce((sum, r) => sum + (r.metadata?.views || 0), 0)
      const scheduledRooms = updatedRooms.filter(r => r.status === 'scheduled').length
      
      setStats({
        totalRooms,
        liveRooms,
        totalViewers,
        scheduledRooms,
      })
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room')
    }
  }

  const handleDeleteStream = async (streamId) => {
    if (!streamId) {
      console.error('Stream ID is missing')
      alert('Error: Stream ID is missing')
      return
    }

    if (!window.confirm('Are you sure you want to delete this stream? This action cannot be undone.')) {
      return
    }

    try {
      const { streamStorage } = await import('../services/storage')
      await streamStorage.delete(streamId)
      
      // Refresh the streams list
      const allStreams = await streamStorage.getAll()
      const updatedStreams = allStreams.filter(s => s.creatorId === user.id || s.creatorId?._id?.toString() === user.id?.toString())
      setMyStreams(updatedStreams)
    } catch (error) {
      console.error('Error deleting stream:', error)
      alert('Failed to delete stream')
    }
  }

  return (
    <div className="creator-dashboard">
      <div className="dashboard-header">
        <h1>Creator Dashboard</h1>
        <button className="btn-create-room" onClick={() => setShowCreateForm(true)}>
          + Create Room
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>{stats.totalRooms}</h3>
            <p>Total Rooms</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <h3>{stats.liveRooms}</h3>
            <p>Live Now</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <h3>{stats.totalViewers}</h3>
            <p>Total Viewers</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <h3>{stats.scheduledRooms}</h3>
            <p>Scheduled</p>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          My Rooms
        </button>
        <button
          className={`tab-btn ${activeTab === 'stream' ? 'active' : ''}`}
          onClick={() => setActiveTab('stream')}
        >
          Stream
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'rooms' && (
          <div className="rooms-list">
            <div className="rooms-list-header">
              <h2>My Rooms</h2>
              <button className="btn-create-room-inline" onClick={() => setShowCreateForm(true)}>
                + Create New Room
              </button>
            </div>
            {myRooms.length === 0 ? (
              <div className="empty-state">
                <p>No rooms created yet. Create your first room!</p>
                <button className="btn-primary" onClick={() => setShowCreateForm(true)}>
                  Create Room
                </button>
              </div>
            ) : (
              <div className="rooms-grid">
                {myRooms.map((room) => (
                  <div key={room.id || room._id} className="room-card-dashboard">
                    <div className="room-card-header">
                      <h3>{room.roomName}</h3>
                      <span className={`status-badge status-${room.status}`}>
                        {room.status === 'live' ? '🔴 Live' : '📅 Scheduled'}
                      </span>
                    </div>
                    <div className="room-card-body">
                      <p className="game-type">{room.gameType.toUpperCase()}</p>
                      <p className="viewers">👁️ {room.metadata?.views || 0} viewers</p>
                      {room.scheduledTime && (
                        <p className="scheduled-time">
                          Scheduled: {new Date(room.scheduledTime).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="room-card-actions">
                      {room.status === 'live' ? (
                        <>
                          <button 
                            className="btn-action"
                            onClick={() => window.location.href = `/room/${room.id || room._id}`}
                          >
                            View
                          </button>
                          <button 
                            className="btn-action btn-danger"
                            onClick={async () => {
                              try {
                                const { roomStorage, streamStorage } = await import('../services/storage')
                                await roomStorage.endRoom(room.id || room._id)
                                // End associated stream if exists
                                const streams = await streamStorage.getAll()
                                const associatedStream = streams.find(s => 
                                  (s.creatorId === room.creatorId || s.creatorId?._id?.toString() === room.creatorId?.toString()) && 
                                  s.gameType === room.gameType &&
                                  s.isLive
                                )
                                if (associatedStream) {
                                  await streamStorage.update(associatedStream.id || associatedStream._id, { isLive: false, endedAt: new Date().toISOString() })
                                }
                                window.location.reload()
                              } catch (error) {
                                alert('Failed to end room')
                              }
                            }}
                          >
                            End Room
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn-action">Edit</button>
                          <button 
                            className="btn-action btn-primary"
                            onClick={async () => {
                              try {
                                const { roomStorage, streamStorage } = await import('../services/storage')
                                
                                // Go live with room
                                await roomStorage.goLive(room.id || room._id)
                                
                                // Create stream if stream links exist
                                if (room.streamLinks && (room.streamLinks.youtube || room.streamLinks.twitch)) {
                                  const platform = room.streamLinks.youtube ? 'youtube' : 'twitch'
                                  const streamUrl = room.streamLinks.youtube || room.streamLinks.twitch
                                  
                                  await streamStorage.create({
                                    creatorId: room.creatorId,
                                    creatorUsername: room.creatorUsername,
                                    platform: platform,
                                    title: `${room.roomName} - Live Stream`,
                                    description: room.description || '',
                                    streamUrl: streamUrl,
                                    gameType: room.gameType,
                                    isLive: true,
                                  })
                                }
                                
                                window.location.reload()
                              } catch (error) {
                                alert('Failed to go live')
                              }
                            }}
                          >
                            Go Live
                          </button>
                        </>
                      )}
                      <button 
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteRoom(room.id || room._id)}
                        title="Delete Room"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stream' && (
          <div className="stream-section">
            <div className="stream-section-header">
              <h2>Stream Management</h2>
              <button 
                className="btn-create-stream"
                onClick={() => {
                  setSelectedRoomForStream(null)
                  setShowStreamForm(true)
                }}
              >
                + Create New Stream
              </button>
            </div>
            
            {/* My Streams Section */}
            <div className="my-streams-section">
              <h3>My Streams</h3>
              {myStreams.length === 0 ? (
                <div className="empty-state">
                  <p>No streams created yet</p>
                </div>
              ) : (
                <div className="live-rooms-stream-grid">
                  {myStreams.map((stream) => (
                    <div key={stream.id || stream._id} className="live-room-stream-card">
                      <div className="live-room-stream-header">
                        <h4>{stream.title}</h4>
                        <span className={stream.isLive ? "status-badge-live" : "status-badge-ended"}>
                          {stream.isLive ? '🔴 LIVE' : '⚪ ENDED'}
                        </span>
                      </div>
                      <div className="live-room-stream-body">
                        <span className="game-badge-small">{stream.gameType?.toUpperCase() || 'GENERAL'}</span>
                        <p className="room-description-small">{stream.description || 'No description'}</p>
                        <p className="viewers-count">👁️ {stream.viewerCount || 0} viewers</p>
                        <p className="platform-badge">📺 {stream.platform?.toUpperCase() || 'UNKNOWN'}</p>
                      </div>
                      <div className="live-room-stream-actions">
                        {stream.streamUrl && (
                          <a 
                            href={stream.streamUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-action-small btn-primary"
                          >
                            Watch
                          </a>
                        )}
                        <button
                          className="btn-action-small btn-delete-small"
                          onClick={() => handleDeleteStream(stream.id || stream._id)}
                          title="Delete Stream"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Live Rooms Section - Small Cards */}
            <div className="live-rooms-stream-section">
              <h3>Live Rooms</h3>
              {myRooms.filter(r => r.status === 'live').length === 0 ? (
                <div className="empty-state">
                  <p>No live rooms at the moment</p>
                </div>
              ) : (
                <div className="live-rooms-stream-grid">
                  {myRooms
                    .filter(r => r.status === 'live')
                    .map((room) => (
                      <div key={room.id || room._id} className="live-room-stream-card">
                        <div className="live-room-stream-header">
                          <h4>{room.roomName}</h4>
                          <span className="status-badge-live">🔴 LIVE</span>
                        </div>
                        <div className="live-room-stream-body">
                          <span className="game-badge-small">{room.gameType.toUpperCase()}</span>
                          <p className="room-description-small">{room.description || 'No description'}</p>
                          {room.metadata?.views !== undefined && (
                            <p className="viewers-count">👁️ {room.metadata.views} viewers</p>
                          )}
                        </div>
                        <div className="live-room-stream-actions">
                          <button
                            className="btn-action-small btn-primary"
                            onClick={() => {
                              setSelectedRoomForStream(room)
                              setShowStreamForm(true)
                            }}
                          >
                            Create Stream
                          </button>
                          <button
                            className="btn-action-small btn-delete-small"
                            onClick={() => handleDeleteRoom(room.id || room._id)}
                            title="Delete Room"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick Create Stream by Game */}
            <div className="quick-stream-section">
              <h3>Quick Create Stream by Game</h3>
              <div className="game-stream-buttons">
                {['bgmi', 'valorant', 'freefire', 'fortnite', 'minecraft', 'codm'].map((game) => (
                  <button
                    key={game}
                    className="game-stream-btn"
                    onClick={() => {
                      setSelectedRoomForStream({ gameType: game })
                      setShowStreamForm(true)
                    }}
                  >
                    <span className="game-icon">{game === 'bgmi' ? '🎮' : game === 'valorant' ? '🔫' : game === 'freefire' ? '🔥' : game === 'fortnite' ? '🏗️' : game === 'minecraft' ? '⛏️' : '📱'}</span>
                    <span className="game-name">{game.toUpperCase()}</span>
                    <span className="stream-icon">📺</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard rooms={myRooms} />
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Settings</h2>
            <p>Creator settings coming soon...</p>
          </div>
        )}
      </div>

      {showCreateForm && (
        <CreateRoomForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false)
            window.location.reload()
          }}
        />
      )}

      {showStreamForm && (
        <StreamForm
          room={selectedRoomForStream}
          onClose={() => {
            setShowStreamForm(false)
            setSelectedRoomForStream(null)
          }}
          onSuccess={() => {
            setShowStreamForm(false)
            setSelectedRoomForStream(null)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}

export default CreatorDashboard

