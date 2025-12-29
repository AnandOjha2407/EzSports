import React, { useState, useEffect } from 'react'
import './GameEvents.css'

const GameEvents = ({ gameType = null }) => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  // Static events as fallback
  const staticEvents = [
            {
              id: 1,
              gameType: 'bgmi',
              title: 'BGMI Championship 2024 - Grand Finals',
              description: 'The biggest BGMI tournament of the year with $100,000 prize pool. Top teams from around the world compete for the ultimate glory.',
              eventType: 'tournament',
              image: '/images/thumb1.jpeg',
              startDate: '2024-02-01T18:00:00Z',
              endDate: '2024-02-15T22:00:00Z',
              priority: 'high',
              link: '#',
              metadata: {
                organizer: 'EZSports',
                prizePool: '$100,000',
                participants: 128,
                tags: ['tournament', 'championship', 'prize'],
              },
            },
            {
              id: 2,
              gameType: 'valorant',
              title: 'Valorant Patch 7.08 Released - New Agent "Astra"',
              description: 'New agent and map updates now live. Experience the latest tactical gameplay with new abilities and strategies.',
              eventType: 'update',
              image: '/images/room31.jpg',
              startDate: '2024-01-20T00:00:00Z',
              priority: 'high',
              link: '#',
              metadata: {
                organizer: 'Riot Games',
                tags: ['update', 'patch', 'new-agent'],
              },
            },
            {
              id: 3,
              gameType: 'codm',
              title: 'CODM Season 12 Giveaway - Exclusive Skins',
              description: 'Win exclusive skins and rewards by participating in daily challenges. Limited time offer!',
              eventType: 'giveaway',
              image: '/images/room51.jpg',
              startDate: '2024-01-15T00:00:00Z',
              endDate: '2024-01-30T23:59:59Z',
              priority: 'medium',
              link: '#',
              metadata: {
                organizer: 'Activision',
                tags: ['giveaway', 'skins', 'rewards'],
              },
            },
            {
              id: 4,
              gameType: 'minecraft',
              title: 'Minecraft 1.21 Update: Tricky Trials',
              description: 'Explore new trial chambers, craft auto-crafters, and face new mobs in this exciting update!',
              eventType: 'patch',
              image: '/images/rooms11.jpg',
              startDate: '2024-01-10T00:00:00Z',
              priority: 'medium',
              link: '#',
              metadata: {
                organizer: 'Mojang',
                tags: ['update', 'new-features'],
              },
            },
            {
              id: 5,
              gameType: 'freefire',
              title: 'Free Fire MAX - Clash Squad Championship',
              description: 'Compete in the Clash Squad mode championship. Show your skills and win amazing prizes!',
              eventType: 'tournament',
              image: '/images/thumb2.jpeg',
              startDate: '2024-02-05T19:00:00Z',
              endDate: '2024-02-20T22:00:00Z',
              priority: 'high',
              link: '#',
              metadata: {
                organizer: 'Garena',
                prizePool: '$50,000',
                participants: 64,
                tags: ['tournament', 'championship'],
              },
            },
            {
              id: 6,
              gameType: 'fortnite',
              title: 'Fortnite Chapter 5 Season 2 Launch',
              description: 'New season, new map, new weapons! Jump into the action and discover what\'s new.',
              eventType: 'update',
              image: '/images/room41.jpg',
              startDate: '2024-01-25T00:00:00Z',
              priority: 'high',
              link: '#',
              metadata: {
                organizer: 'Epic Games',
                tags: ['season', 'update', 'new-content'],
              },
            },
          ]

  useEffect(() => {
    // Fetch events from API
    const fetchEvents = async () => {
      try {
        // Try API first
        try {
          const { eventService } = await import('../services/api')
          const data = gameType
            ? await eventService.getByGame(gameType)
            : await eventService.getAll()
          
          // If API returns data, use it; otherwise use static events
          if (data && Array.isArray(data) && data.length > 0) {
            setEvents(data)
          } else {
            // API returned empty array, use static events
            const filtered = gameType
              ? staticEvents.filter(e => e.gameType === gameType)
              : staticEvents
            setEvents(filtered)
          }
        } catch (apiError) {
          // API call failed, fallback to static data
          console.warn('API call failed, using static events:', apiError)
          const filtered = gameType
            ? staticEvents.filter(e => e.gameType === gameType)
            : staticEvents
          setEvents(filtered)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        // Ensure static events are set even if there's an error
        const filtered = gameType
          ? staticEvents.filter(e => e.gameType === gameType)
          : staticEvents
        setEvents(filtered)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [gameType])

  const filteredEvents = gameType
    ? events.filter((e) => e.gameType === gameType)
    : events

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'tournament':
        return '🏆'
      case 'update':
        return '🆕'
      case 'patch':
        return '🔧'
      case 'giveaway':
        return '🎁'
      default:
        return '📢'
    }
  }

  const getPriorityClass = (priority) => {
    return `priority-${priority}`
  }

  return (
    <div className="game-events">
      <div className="events-header">
        <h2>Events & Updates</h2>
        {gameType && (
          <p className="events-subtitle">Latest updates for {gameType.toUpperCase()}</p>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          <p>No events at the moment</p>
        </div>
      ) : (
        <div className="events-list">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`event-card ${getPriorityClass(event.priority)}`}>
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-type-badge">
                  {getEventTypeIcon(event.eventType)}
                </div>
              </div>
              <div className="event-content">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className={`priority-badge ${getPriorityClass(event.priority)}`}>
                    {event.priority}
                  </span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-meta">
                  <span className="event-date">
                    📅 {new Date(event.startDate).toLocaleDateString()}
                    {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                  </span>
                  <span className="event-game">{event.gameType.toUpperCase()}</span>
                </div>
                {event.link && (
                  <a href={event.link} className="event-link">
                    Learn More →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default GameEvents

