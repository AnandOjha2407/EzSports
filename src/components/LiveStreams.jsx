import React, { useState, useEffect } from 'react'
import { getGameImages } from '../utils/gameImages'
import './LiveStreams.css'

const LiveStreams = ({ gameType = null }) => {
  const [streams, setStreams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch live streams from API
    const fetchStreams = async () => {
      try {
        // Try API first
        try {
          const { streamService } = await import('../services/api')
          const data = gameType 
            ? await streamService.getByGame(gameType)
            : await streamService.getLive()
          setStreams(data)
        } catch (apiError) {
          // Fallback to local storage
          const { streamStorage, roomStorage } = await import('../services/storage')
          
          // Get live streams
          let liveStreams = gameType 
            ? await streamStorage.getByGame(gameType)
            : await streamStorage.getLive()
          
          // Also get live rooms with stream links
          const liveRooms = await roomStorage.getLive()
          const roomsWithStreams = liveRooms
            .filter(r => r.streamLinks && (r.streamLinks.youtube || r.streamLinks.twitch))
            .map(room => ({
              id: `room-${room.id}`,
              creatorId: room.creatorId,
              creatorUsername: room.creatorUsername,
              platform: room.streamLinks.youtube ? 'youtube' : 'twitch',
              title: `${room.roomName} - Live Stream`,
              description: room.description || '',
              streamUrl: room.streamLinks.youtube || room.streamLinks.twitch,
              gameType: room.gameType,
              isLive: true,
              viewerCount: room.metadata?.views || 0,
            }))
          
          // Combine streams and rooms
          setStreams([...liveStreams, ...roomsWithStreams])
        }
      } catch (error) {
        console.error('Error fetching streams:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStreams()
    
    // Refresh streams every 30 seconds
    const interval = setInterval(fetchStreams, 30000)
    return () => clearInterval(interval)
  }, [gameType])

  const filteredStreams = gameType
    ? streams.filter((s) => s.gameType === gameType)
    : streams

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'youtube':
        return '▶️'
      case 'twitch':
        return '🎮'
      default:
        return '📺'
    }
  }

  const formatViewerCount = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <div className="live-streams">
      <div className="container">
        <div className="streams-header">
          <h2>
            <span className="live-indicator">🔴</span> Live Streams
          </h2>
          {gameType && (
            <p className="streams-subtitle">Streaming {gameType.toUpperCase()} now</p>
          )}
        </div>

        {filteredStreams.length === 0 ? (
          <div className="no-streams">
            <p>No live streams at the moment</p>
          </div>
        ) : (
          <div className="streams-grid">
          {filteredStreams.map((stream) => {
            const gameImages = getGameImages(stream.gameType)
            
            return (
              <a
                key={stream.id}
                href={stream.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="stream-card"
              >
                <div className="stream-thumbnail">
                  <img 
                    src={gameImages.normal} 
                    alt={stream.title}
                    className="stream-image-normal"
                    onError={(e) => {
                      e.target.src = '/images/bgmi.jpg'
                    }}
                  />
                  <img 
                    src={gameImages.hover} 
                    alt={stream.title}
                    className="stream-image-hover"
                    onError={(e) => {
                      e.target.src = '/images/bgmi.gif'
                    }}
                  />
                  <div className="stream-overlay">
                    <div className="stream-platform">{getPlatformIcon(stream.platform)}</div>
                    <div className="stream-viewers">
                      👁️ {formatViewerCount(stream.viewerCount || stream.metadata?.views || 0)}
                    </div>
                  </div>
                  <div className="stream-live-badge">🔴 LIVE</div>
                </div>
                <div className="stream-info">
                  <h3 className="stream-title">{stream.title}</h3>
                  <p className="stream-creator">{stream.creatorUsername || stream.creator}</p>
                  <p className="stream-game">{stream.gameType?.toUpperCase()}</p>
                  <span className="stream-link">Watch Stream →</span>
                </div>
              </a>
            )
          })}
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveStreams

