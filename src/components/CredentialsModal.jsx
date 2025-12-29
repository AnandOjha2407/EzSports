import React from 'react'
import RoomCredentials from './RoomCredentials'
import './CredentialsModal.css'

const CredentialsModal = ({ show, onClose, gameType, credentials, roomName }) => {
  if (!show) return null

  return (
    <div className="credentials-modal-overlay" onClick={onClose}>
      <div className="credentials-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Room Credentials</h2>
        {credentials && (
          <RoomCredentials
            gameType={gameType}
            credentials={credentials}
            roomName={roomName}
          />
        )}
      </div>
    </div>
  )
}

export default CredentialsModal

