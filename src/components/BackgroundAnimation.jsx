import React, { useEffect, useRef } from 'react'
import './BackgroundAnimation.css'

const BackgroundAnimation = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Thread particles
    const threads = []
    const threadCount = 50

    class Thread {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.length = Math.random() * 200 + 100
        this.opacity = Math.random() * 0.3 + 0.1
        this.color = Math.random() > 0.5 ? '#00D2FF' : '#FF007F'
      }

      update() {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(
          this.x + Math.cos(this.vx) * this.length,
          this.y + Math.sin(this.vy) * this.length
        )
        ctx.strokeStyle = this.color
        ctx.globalAlpha = this.opacity
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.globalAlpha = 1
      }
    }

    // Initialize threads
    for (let i = 0; i < threadCount; i++) {
      threads.push(new Thread())
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between nearby threads
      for (let i = 0; i < threads.length; i++) {
        for (let j = i + 1; j < threads.length; j++) {
          const dx = threads[i].x - threads[j].x
          const dy = threads[i].y - threads[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(threads[i].x, threads[i].y)
            ctx.lineTo(threads[j].x, threads[j].y)
            ctx.strokeStyle = threads[i].color
            ctx.globalAlpha = (1 - distance / 150) * 0.2
            ctx.lineWidth = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }

      // Update and draw threads
      threads.forEach((thread) => {
        thread.update()
        thread.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="background-animation">
      <canvas ref={canvasRef} className="background-canvas" />
      <div className="background-overlay" />
    </div>
  )
}

export default BackgroundAnimation

