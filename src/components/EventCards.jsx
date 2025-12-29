import React from 'react'
import './EventCards.css'

const EventCards = () => {
  const events = [
    {
      id: 1,
      badge: 'World Tournament',
      badgeColor: 'cyan',
      title: 'ClashX',
      date: 'Every Year',
      description:
        'Welcome to the grand arena of esports excellence, where we stand as the premier organizers of cutting-edge competitive gaming events.',
      image: '/images/thumb1.jpeg',
    },
    {
      id: 2,
      badge: 'Cash Prize And More!',
      badgeColor: 'pink',
      title: 'ZPORTA',
      date: 'Nov 11',
      description:
        'Compete in our elite esports tournaments for a chance to win grand prizes, including cash awards up to $500,000, exclusive sponsorship deals, and top-tier gaming gear.',
      image: '/images/thumb2.jpeg',
    },
  ]

  return (
    <div className="event-cards-section">
      <div className="container">
        <h2 className="section-title">Featured Events</h2>
        <div className="event-cards-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-card-image">
                <img src={event.image} alt={event.title} />
                <div className="event-card-overlay" />
              </div>
              <div className="event-card-content">
                <span className={`event-badge badge-${event.badgeColor}`}>
                  {event.badge}
                </span>
                <h3 className="event-title">{event.title}</h3>
                <div className="event-date">{event.date}</div>
                <p className="event-description">{event.description}</p>
                <a href="#" className="event-link">
                  Continue reading
                  <span className="arrow">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EventCards
