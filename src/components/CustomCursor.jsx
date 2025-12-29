import React, { useEffect, useState } from 'react'

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      
      // Dot follows with slight delay
      setTimeout(() => {
        setDotPosition({ x: e.clientX, y: e.clientY })
      }, 50)

      // Check if hovering over interactive element
      const target = e.target
      const isInteractive = target.matches('a, button, input, select, textarea, [role="button"], .room-card, .event-card, .game-btn')
      setIsHovering(isInteractive)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    document.addEventListener('mousemove', updateCursor)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <>
      <div
        className={`cursor ${isHovering ? 'hover' : ''} ${isClicking ? 'click' : ''}`}
        style={{
          left: `${position.x - 10}px`,
          top: `${position.y - 10}px`,
        }}
      />
      <div
        className="cursor-dot"
        style={{
          left: `${dotPosition.x - 2}px`,
          top: `${dotPosition.y - 2}px`,
        }}
      />
    </>
  )
}

export default CustomCursor

