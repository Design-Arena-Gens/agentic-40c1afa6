'use client'

import { useEffect, useRef, useState } from 'react'

export default function PolishIndependenceDay() {
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Animation state
    let animationFrame = 0
    const maxFrames = 600 // 10 seconds at 60fps
    let particles = []
    let flags = []

    // Color palette
    const colors = {
      skyTop: { r: 255, g: 140, b: 60 },
      skyBottom: { r: 255, g: 200, b: 120 },
      red: '#DC143C',
      white: '#FFFFFF',
      golden: '#FFD700'
    }

    // Particle system for atmospheric effects
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 0.5 - 0.25
        this.speedY = Math.random() * -0.5
        this.opacity = Math.random() * 0.5 + 0.2
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.y < 0) this.y = canvas.height
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
        ctx.fillRect(this.x, this.y, this.size, this.size)
      }
    }

    // Flag system
    class Flag {
      constructor(x, y, isRed) {
        this.x = x
        this.y = y
        this.isRed = isRed
        this.waveOffset = Math.random() * Math.PI * 2
        this.scale = Math.random() * 0.5 + 0.5
      }

      draw(frame) {
        const wave = Math.sin(frame * 0.05 + this.waveOffset) * 10
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.scale(this.scale, this.scale)

        // Flag pole
        ctx.fillStyle = '#8B4513'
        ctx.fillRect(-2, 0, 4, 100)

        // Flag fabric
        ctx.fillStyle = this.isRed ? colors.red : colors.white
        ctx.beginPath()
        ctx.moveTo(0, 10)
        ctx.quadraticCurveTo(30 + wave, 20, 60, 10)
        ctx.quadraticCurveTo(30 + wave, 30, 0, 40)
        ctx.closePath()
        ctx.fill()

        // Flag shadow/depth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
        ctx.beginPath()
        ctx.moveTo(0, 20)
        ctx.quadraticCurveTo(30 + wave * 0.8, 25, 60, 20)
        ctx.lineTo(60, 30)
        ctx.quadraticCurveTo(30 + wave * 0.8, 35, 0, 30)
        ctx.closePath()
        ctx.fill()

        ctx.restore()
      }
    }

    // Initialize particles
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle())
    }

    // Initialize flags in crowd
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * canvas.width
      const y = canvas.height * 0.6 + Math.random() * canvas.height * 0.3
      flags.push(new Flag(x, y, Math.random() > 0.5))
    }

    function drawSky(frame) {
      const progress = Math.min(frame / maxFrames, 1)

      // Dynamic gradient sky
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      const sunIntensity = 0.3 + progress * 0.7

      gradient.addColorStop(0, `rgba(${colors.skyTop.r}, ${colors.skyTop.g}, ${colors.skyTop.b}, 1)`)
      gradient.addColorStop(0.5, `rgba(${colors.skyBottom.r}, ${colors.skyBottom.g}, ${colors.skyBottom.b}, 1)`)
      gradient.addColorStop(1, `rgba(255, 220, 180, 1)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sun with lens flare
      const sunX = canvas.width * 0.2 + progress * canvas.width * 0.1
      const sunY = canvas.height * 0.2
      const sunRadius = 80 + Math.sin(frame * 0.02) * 5

      // Sun glow
      const sunGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 3)
      sunGradient.addColorStop(0, `rgba(255, 255, 200, ${0.3 * sunIntensity})`)
      sunGradient.addColorStop(0.5, `rgba(255, 200, 100, ${0.1 * sunIntensity})`)
      sunGradient.addColorStop(1, 'rgba(255, 200, 100, 0)')
      ctx.fillStyle = sunGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sun core
      const coreGradient = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius)
      coreGradient.addColorStop(0, '#FFFACD')
      coreGradient.addColorStop(1, `rgba(255, 200, 100, ${0.8 * sunIntensity})`)
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2)
      ctx.fill()

      // Lens flare effects
      for (let i = 0; i < 5; i++) {
        const flareX = sunX + (canvas.width / 2 - sunX) * (i / 5)
        const flareY = sunY + (canvas.height / 2 - sunY) * (i / 5)
        const flareSize = 30 - i * 5
        const flareOpacity = (0.2 - i * 0.03) * sunIntensity

        ctx.fillStyle = `rgba(255, 255, 255, ${flareOpacity})`
        ctx.beginPath()
        ctx.arc(flareX, flareY, flareSize, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function drawSilhouettedCity() {
      // Historical buildings silhouette
      ctx.fillStyle = 'rgba(40, 20, 10, 0.4)'

      // Multiple building shapes
      const buildings = [
        { x: 0, y: canvas.height * 0.5, w: 200, h: canvas.height * 0.2 },
        { x: 180, y: canvas.height * 0.45, w: 150, h: canvas.height * 0.25 },
        { x: 310, y: canvas.height * 0.48, w: 180, h: canvas.height * 0.22 },
        { x: 470, y: canvas.height * 0.46, w: 200, h: canvas.height * 0.24 },
        { x: 650, y: canvas.height * 0.49, w: 160, h: canvas.height * 0.21 },
        { x: 790, y: canvas.height * 0.47, w: 190, h: canvas.height * 0.23 },
        { x: 960, y: canvas.height * 0.5, w: 300, h: canvas.height * 0.2 }
      ]

      buildings.forEach(building => {
        ctx.fillRect(building.x, building.y, building.w, building.h)

        // Church spires and towers
        if (Math.random() > 0.5) {
          ctx.beginPath()
          ctx.moveTo(building.x + building.w / 2 - 20, building.y)
          ctx.lineTo(building.x + building.w / 2, building.y - 60)
          ctx.lineTo(building.x + building.w / 2 + 20, building.y)
          ctx.closePath()
          ctx.fill()
        }
      })
    }

    function drawCrowd() {
      // Crowd silhouettes
      ctx.fillStyle = 'rgba(30, 20, 15, 0.6)'
      for (let i = 0; i < 100; i++) {
        const x = (i / 100) * canvas.width
        const y = canvas.height * 0.65 + Math.random() * 50
        const width = 20 + Math.random() * 20
        const height = 60 + Math.random() * 40

        // Person silhouette
        ctx.beginPath()
        ctx.ellipse(x + width / 2, y + height * 0.15, width * 0.4, height * 0.15, 0, 0, Math.PI * 2)
        ctx.rect(x, y + height * 0.25, width, height * 0.75)
        ctx.fill()
      }
    }

    function drawHorse(frame) {
      const progress = Math.min(frame / maxFrames, 1)
      const cameraZoom = 1 + progress * 0.5
      const horseX = canvas.width * 0.5
      const horseY = canvas.height * 0.55

      ctx.save()
      ctx.translate(horseX, horseY)
      ctx.scale(cameraZoom, cameraZoom)

      // Horse body - silhouette with golden rim light
      ctx.fillStyle = 'rgba(20, 15, 10, 0.9)'
      ctx.strokeStyle = colors.golden
      ctx.lineWidth = 2

      // Horse body
      ctx.beginPath()
      ctx.ellipse(0, 0, 80, 50, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Horse head and neck
      ctx.beginPath()
      ctx.ellipse(60, -20, 30, 35, 0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      // Horse legs with animation
      const legMove = Math.sin(frame * 0.1) * 5
      for (let i = 0; i < 4; i++) {
        const legX = -40 + i * 30
        const legOffset = i % 2 === 0 ? legMove : -legMove
        ctx.fillRect(legX, 30, 15, 50 + legOffset)
      }

      // Mane with wind effect
      ctx.fillStyle = 'rgba(40, 30, 20, 0.8)'
      for (let i = 0; i < 5; i++) {
        const maneX = 40 + i * 10
        const maneY = -30 + Math.sin(frame * 0.05 + i) * 10
        ctx.beginPath()
        ctx.moveTo(maneX, -20)
        ctx.quadraticCurveTo(maneX + 15, maneY, maneX + 10, maneY - 30)
        ctx.lineWidth = 5
        ctx.strokeStyle = colors.golden
        ctx.stroke()
      }

      // Rider silhouette
      ctx.fillStyle = 'rgba(15, 10, 5, 0.95)'

      // Rider body
      ctx.fillRect(-20, -70, 40, 60)

      // Rider head
      ctx.beginPath()
      ctx.arc(0, -80, 20, 0, Math.PI * 2)
      ctx.fill()

      // Military cap
      ctx.fillRect(-15, -95, 30, 15)
      ctx.fillRect(-20, -100, 40, 5)

      // Golden rim light on rider
      ctx.strokeStyle = colors.golden
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(10, -80, 20, -Math.PI / 2, 0)
      ctx.stroke()

      ctx.restore()
    }

    function drawFilmGrain() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() > 0.97) {
          const grain = Math.random() * 50 - 25
          data[i] += grain
          data[i + 1] += grain
          data[i + 2] += grain
        }
      }

      ctx.putImageData(imageData, 0, 0)
    }

    function drawVignette() {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.height * 0.3,
        canvas.width / 2, canvas.height / 2, canvas.height * 0.8
      )
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    function drawText(frame) {
      const progress = Math.min(frame / maxFrames, 1)

      if (progress > 0.3) {
        const textOpacity = Math.min((progress - 0.3) * 2, 1)

        ctx.font = 'bold 72px serif'
        ctx.textAlign = 'center'
        ctx.fillStyle = `rgba(255, 255, 255, ${textOpacity})`
        ctx.strokeStyle = `rgba(220, 20, 60, ${textOpacity * 0.8})`
        ctx.lineWidth = 3

        const text = 'NOVEMBER 11'
        ctx.strokeText(text, canvas.width / 2, canvas.height * 0.15)
        ctx.fillText(text, canvas.width / 2, canvas.height * 0.15)

        ctx.font = 'italic 48px serif'
        const subtitle = 'Independence Day'
        ctx.strokeText(subtitle, canvas.width / 2, canvas.height * 0.2)
        ctx.fillText(subtitle, canvas.width / 2, canvas.height * 0.2)
      }

      if (progress > 0.7) {
        const quoteOpacity = Math.min((progress - 0.7) * 3, 1)
        ctx.font = 'italic 32px serif'
        ctx.fillStyle = `rgba(255, 215, 0, ${quoteOpacity})`
        const quote = '"A nation reborn in freedom"'
        ctx.fillText(quote, canvas.width / 2, canvas.height * 0.9)
      }
    }

    function animate() {
      if (animationFrame < maxFrames) {
        animationFrame++
      }

      // Draw scene layers
      drawSky(animationFrame)

      // Particles for atmospheric depth
      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      drawSilhouettedCity()

      // Draw flags waving
      flags.forEach(flag => flag.draw(animationFrame))

      drawCrowd()
      drawHorse(animationFrame)

      drawFilmGrain()
      drawVignette()
      drawText(animationFrame)

      requestAnimationFrame(animate)
    }

    // Start animation after brief delay
    setTimeout(() => {
      setLoading(false)
      animate()
    }, 500)

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#000' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#FFD700',
          fontSize: '24px',
          fontFamily: 'serif'
        }}>
          Loading...
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap');
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          font-family: 'Cinzel', serif;
        }
      `}</style>
    </div>
  )
}
