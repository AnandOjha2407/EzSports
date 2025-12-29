import React, { useState } from 'react'
import { formatCredentials } from '../utils/gameCredentials'
import './RoomCredentials.css'

const RoomCredentials = ({ gameType, credentials, roomName }) => {
  const [copied, setCopied] = useState(false)

  const credentialText = formatCredentials(gameType, credentials)

  const handleCopy = () => {
    navigator.clipboard.writeText(credentialText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyField = (fieldName, value) => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="room-credentials">
      <div className="credentials-header">
        <h3>Room Credentials</h3>
        {roomName && <p className="room-name">{roomName}</p>}
      </div>

      <div className="credentials-content">
        {Object.entries(credentials).map(([key, value]) => (
          <div key={key} className="credential-item">
            <div className="credential-label">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </div>
            <div className="credential-value">
              <span>{value}</span>
              <button
                className="copy-btn"
                onClick={() => copyField(key, value)}
                title="Copy"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="copy-all-btn" onClick={handleCopy}>
        {copied ? '✓ Copied!' : '📋 Copy All Credentials'}
      </button>
    </div>
  )
}

export default RoomCredentials

