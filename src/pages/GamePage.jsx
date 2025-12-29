import React from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LiveStreams from '../components/LiveStreams'
import GameEvents from '../components/GameEvents'
import './GamePage.css'

const GamePage = () => {
  const { gameName } = useParams()
  const { isAuthenticated } = useAuth()

  const gameData = {
    bgmi: {
      name: 'BGMI',
      fullName: 'Battlegrounds Mobile India',
      description: 'Experience the ultimate battle royale experience',
    },
    codm: {
      name: 'CODM',
      fullName: 'Call of Duty: Mobile',
      description: 'Tactical warfare at your fingertips',
    },
    valorant: {
      name: 'VALORANT',
      fullName: 'Valorant',
      description: 'Precision and strategy combined',
    },
    freefire: {
      name: 'FREE FIRE',
      fullName: 'Garena Free Fire',
      description: 'Fast-paced battle royale action',
    },
    minecraft: {
      name: 'MINECRAFT',
      fullName: 'Minecraft',
      description: 'Build, explore, and survive',
    },
    fortnite: {
      name: 'FORTNITE',
      fullName: 'Fortnite',
      description: 'Epic battles and building',
    },
    pubg: {
      name: 'PUBG',
      fullName: 'PlayerUnknown\'s Battlegrounds',
      description: 'The original battle royale',
    },
  }

  const game = gameData[gameName] || {
    name: gameName?.toUpperCase() || 'GAME',
    fullName: 'Game',
    description: 'Join the competition',
  }

  return (
    <div className="game-page">
      <div className="game-hero">
        <div className="game-hero-content">
          <h1 className="game-title">{game.fullName}</h1>
          <p className="game-subtitle">{game.description}</p>
          <div className="game-actions">
            <button className="btn-primary">Join Room</button>
            <button className="btn-secondary">View Tournaments</button>
          </div>
        </div>
      </div>

      <div className="game-content">
        <div className="container">
          <section className="game-intro">
            <h2>About {game.name}</h2>
            <p className="intro-text">
              Welcome to the {game.name} section! This is where you'll find all the information,
              tournaments, and rooms related to {game.fullName}. 
              {/* Content will be added later as requested */}
            </p>
            <p className="intro-text">
              Join our community of players, compete in tournaments, and climb the leaderboards.
              More detailed content will be added here soon.
            </p>
          </section>

          <section className="game-features">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎮</div>
                <h3>Custom Rooms</h3>
                <p>Join or create custom game rooms</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🏆</div>
                <h3>Tournaments</h3>
                <p>Compete in regular tournaments</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>Community</h3>
                <p>Connect with other players</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Leaderboards</h3>
                <p>Track your progress and rankings</p>
              </div>
            </div>
          </section>

          {isAuthenticated() && <LiveStreams gameType={gameName} />}
          {isAuthenticated() && <GameEvents gameType={gameName} />}
          {!isAuthenticated() && (
            <div className="login-prompt">
              <h2>Please log in to view streams and events</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GamePage

