import React from 'react'
import EventCards from '../components/EventCards'
import Footer from '../components/Footer'
import './Events.css'

const Events = () => {
  return (
    <div className="events-page">
      <div className="events-hero">
        <h1>Tournaments & Events</h1>
        <p>Join the biggest esports competitions</p>
      </div>
      <EventCards />
      <Footer />
    </div>
  )
}

export default Events

