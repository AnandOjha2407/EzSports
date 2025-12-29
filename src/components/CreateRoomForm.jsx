import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getGameFields } from '../utils/gameCredentials'
import './CreateRoomForm.css'

const CreateRoomForm = ({ onClose, onSuccess }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    gameType: 'bgmi',
    roomName: '',
    description: '',
    credentials: {},
    streamLinks: {
      youtube: '',
      twitch: '',
    },
    scheduledTime: '',
    maxPlayers: 100,
    status: 'scheduled',
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

  const gameFields = getGameFields(formData.gameType)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('credential.')) {
      const fieldName = name.split('.')[1]
      setFormData({
        ...formData,
        credentials: {
          ...formData.credentials,
          [fieldName]: value,
        },
      })
    } else if (name.startsWith('stream.')) {
      const platform = name.split('.')[1]
      setFormData({
        ...formData,
        streamLinks: {
          ...formData.streamLinks,
          [platform]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required credential fields
    const gameFields = getGameFields(formData.gameType)
    const requiredFields = gameFields.fields.filter(f => f.required)
    const missingFields = requiredFields.filter(f => !formData.credentials[f.name])
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`)
      return
    }

    // API call to create room
    try {
      const { roomService } = await import('../services/api')
      
      // Try to create room via API
      try {
        const response = await roomService.create(formData)
        console.log('Room created:', response)
        
        // Show success message
        alert('Room created successfully!')
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      } catch (apiError) {
        // If API fails (backend not connected), use mock data
        const isNetworkError = 
          apiError.message?.includes('Failed to fetch') || 
          apiError.message?.includes('NetworkError') ||
          apiError.message?.includes('Backend server is not available') ||
          apiError.name === 'TypeError'
        
        if (isNetworkError) {
          console.warn('Backend not available, using mock data:', apiError)
          
          // Mock successful creation
          const mockResponse = {
            id: Date.now(),
            ...formData,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
          }
          
          console.log('Room created (mock):', mockResponse)
          
          // Use storage service
          const { roomStorage } = await import('../services/storage')
          
          if (!user) {
            alert('Please log in to create a room')
            return
          }
          
          try {
            const newRoom = roomStorage.create({
              creatorId: user.id,
              creatorUsername: user.username,
              gameType: formData.gameType,
              roomName: formData.roomName,
              description: formData.description,
              credentials: formData.credentials,
              streamLinks: formData.streamLinks,
              maxPlayers: formData.maxPlayers,
              status: formData.status || 'scheduled',
              scheduledTime: formData.scheduledTime || null,
              isPublic: true,
              allowSpectators: true,
            })
            
            console.log('Room created:', newRoom)
            alert('Room created successfully!')
            if (onSuccess) onSuccess()
            if (onClose) onClose()
          } catch (storageError) {
            alert(storageError.message || 'Failed to create room')
          }
        } else {
          // Other API errors
          throw apiError
        }
      }
    } catch (error) {
      console.error('Error creating room:', error)
      alert(`Failed to create room: ${error.message || 'Please try again.'}`)
    }
  }

  const renderField = (field) => {
    if (field.type === 'select') {
      return (
        <select
          name={`credential.${field.name}`}
          value={formData.credentials[field.name] || ''}
          onChange={handleChange}
          required={field.required}
          className="form-input"
        >
          <option value="">Select {field.label}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type={field.type}
        name={`credential.${field.name}`}
        value={formData.credentials[field.name] || ''}
        onChange={handleChange}
        placeholder={field.placeholder}
        required={field.required}
        maxLength={field.maxLength}
        className="form-input"
      />
    )
  }

  return (
    <div className="create-room-modal">
      <div className="modal-overlay" onClick={onClose} />
      <div className="create-room-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <h2>Create New Room</h2>

        <form onSubmit={handleSubmit} className="create-room-form">
          <div className="form-group">
            <label>Game Type *</label>
            <select
              name="gameType"
              value={formData.gameType}
              onChange={handleChange}
              className="form-input"
              required
            >
              {gameOptions.map((game) => (
                <option key={game.value} value={game.value}>
                  {game.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Room Name *</label>
            <input
              type="text"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              placeholder="e.g., Daily TDM #123"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your room..."
              rows="3"
              className="form-input"
            />
          </div>

          <div className="credentials-section">
            <h3>Room Credentials</h3>
            <p className="section-description">
              Enter the room credentials that players will use to join
            </p>
            {gameFields.fields.map((field) => (
              <div key={field.name} className="form-group">
                <label>
                  {field.label} {field.required && '*'}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="stream-links-section">
            <h3>Stream Links (Optional)</h3>
            <div className="form-group">
              <label>YouTube URL</label>
              <input
                type="url"
                name="stream.youtube"
                value={formData.streamLinks.youtube}
                onChange={handleChange}
                placeholder="https://youtube.com/watch?v=..."
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Twitch URL</label>
              <input
                type="url"
                name="stream.twitch"
                value={formData.streamLinks.twitch}
                onChange={handleChange}
                placeholder="https://twitch.tv/yourchannel"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Scheduled Time</label>
              <input
                type="datetime-local"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Max Players</label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleChange}
                min="1"
                max="1000"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRoomForm

