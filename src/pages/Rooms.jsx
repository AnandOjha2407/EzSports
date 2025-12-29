import React from 'react'
import RoomCards from '../components/RoomCards'
import Footer from '../components/Footer'
import './Rooms.css'

const Rooms = ({ createMode, joinMode }) => {
  return (
    <div className="rooms-page">
      <div className="rooms-hero">
        <h1>
          {createMode
            ? 'Create a Room'
            : joinMode
            ? 'Join a Room'
            : 'Gaming Rooms'}
        </h1>
        <p>
          {createMode
            ? 'Start your own gaming room and invite players'
            : joinMode
            ? 'Find and join active gaming rooms'
            : 'Browse all available gaming rooms'}
        </p>
      </div>
      <RoomCards />
      <Footer />
    </div>
  )
}

export default Rooms

