import React from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

const HeroCarousel = () => {
  const carouselItems = [
    {
      id: 1,
      image: '/images/car3.jpg',
      title: 'Welcome to EZSports',
      description: 'Your gateway to the world of E-sports',
    },
    {
      id: 2,
      image: '/images/car2.jpg',
      title: 'Live Rooms',
      description: '24x7 live rooms! Ready to be joined.',
    },
    {
      id: 3,
      image: '/images/car1.jpg',
      title: 'Seamless Experience',
      description: 'Seamless Gaming Experience With Our Host',
    },
  ]

  const games = [
    { name: 'BGMI', path: '/game/bgmi' },
    { name: 'CODM', path: '/game/codm' },
    { name: 'VALORANT', path: '/game/valorant' },
    { name: 'FREE FIRE', path: '/game/freefire' },
  ]

  return (
    <div className="hero-carousel">
      <div
        id="carouselExample"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="4000"
        data-bs-wrap="true"
        data-bs-pause="hover"
      >
        <div className="carousel-indicators">
          {carouselItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
        <div className="carousel-inner">
          {carouselItems.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <div className="carousel-image-wrapper">
                <img
                  src={item.image}
                  className="carousel-image"
                  alt={item.title}
                />
              </div>
              <div className="carousel-caption">
                <h2 className="carousel-title">{item.title}</h2>
                <p className="carousel-description">{item.description}</p>
                <div className="game-buttons">
                  {games.map((game) => (
                    <Link
                      key={game.path}
                      to={game.path}
                      className="game-btn"
                    >
                      {game.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExample"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  )
}

export default HeroCarousel
