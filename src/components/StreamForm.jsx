import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './StreamForm.css'

const StreamForm = ({ onClose, onSuccess, room = null }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    platform: room ? 'youtube' : 'youtube',
    title: room?.roomName ? `${room.roomName} - Live Stream` : room?.gameType ? `${room.gameType.toUpperCase()} Live Stream` : '',
    description: room?.description || '',
    streamUrl: '',
    gameType: room?.gameType || 'bgmi',
    isLive: false,
    thumbnail: '',
  })

  const gameOptions = [
    { value: 'bgmi', label: 'BGMI' },
    { value: 'codm', label: 'CODM' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'freefire', label: 'Free Fire' },
    { value: 'minecraft', label: 'Minecraft' },
    { value: 'fortnite', label: 'Fortnite' },
    { value: 'pubg', label: 'PUBG' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.streamUrl) {
      alert('Please enter a stream URL')
      return
    }

    try {
      const { streamStorage } = await import('../services/storage')
      
      const newStream = streamStorage.create({
        creatorId: user.id,
        creatorUsername: user.username,
        platform: formData.platform,
        title: formData.title,
        description: formData.description,
        streamUrl: formData.streamUrl,
        gameType: formData.gameType,
        isLive: formData.isLive,
        thumbnail: formData.thumbnail,
      })

      // If linked to a room, update the room's stream link
      if (room) {
        const { roomStorage } = await import('../services/storage')
        roomStorage.update(room.id, {
          streamLinks: {
            ...room.streamLinks,
            [formData.platform]: formData.streamUrl,
          },
        })
      }

      alert('Stream created successfully!')
      if (onSuccess) onSuccess()
      if (onClose) onClose()
    } catch (error) {
      console.error('Error creating stream:', error)
      alert(`Failed to create stream: ${error.message || 'Please try again.'}`)
    }
  }

  return (
    <div className="stream-form-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="stream-form-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{room?.roomName ? 'Create Stream for Room' : room?.gameType ? `Create Stream for ${room.gameType.toUpperCase()}` : 'Create New Stream'}</h2>

        <form onSubmit={handleSubmit} className="stream-form">
          <div className="form-group">
            <label>Platform *</label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="youtube">YouTube</option>
              <option value="twitch">Twitch</option>
            </select>
          </div>

          <div className="form-group">
            <label>Stream URL *</label>
            <input
              type="url"
              name="streamUrl"
              value={formData.streamUrl}
              onChange={handleChange}
              placeholder={formData.platform === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://twitch.tv/yourchannel'}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Stream title"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Stream description"
              rows="3"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Game Type</label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="form-input"
            >
              {gameOptions.map((game) => (
                <option key={game.value} value={game.value}>
                  {game.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isLive"
                checked={formData.isLive}
                onChange={(e) => setFormData({ ...formData, isLive: e.target.checked })}
              />
              Go Live Now
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StreamForm

