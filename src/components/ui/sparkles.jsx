import { useEffect, useRef } from 'react'

export const SparklesCore = ({
  className,
  particleDensity = 60,
  particleColor = 'rgba(91,194,231,0.9)',
  speed = 0.8,
}) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Base color stripped of alpha — we control alpha ourselves
    const baseColor = '91,194,231'

    // Particle count scaled to density prop
    const COUNT = Math.round(particleDensity * 0.65)
    const CONNECT_DIST = 160
    const BASE_SPEED   = speed * 0.35

    let W, H, particles, raf

    function resize() {
      W = canvas.width  = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }

    function makeParticle() {
      const angle = Math.random() * Math.PI * 2
      const spd   = BASE_SPEED * (0.3 + Math.random() * 0.7)
      return {
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    1.8 + Math.random() * 2.8,      // 1.8 – 4.6 px radius
        vx:   Math.cos(angle) * spd,
        vy:   Math.sin(angle) * spd,
        // subtle drift wobble
        wobbleFreq:  0.003 + Math.random() * 0.004,
        wobbleAmp:   0.15  + Math.random() * 0.15,
        phase:       Math.random() * Math.PI * 2,
        opacity: 0.55 + Math.random() * 0.35,
      }
    }

    function init() {
      resize()
      particles = Array.from({ length: COUNT }, makeParticle)
    }

    let tick = 0
    function draw() {
      ctx.clearRect(0, 0, W, H)
      tick++

      // update positions
      for (const p of particles) {
        // add gentle wobble to velocity
        const wobble = Math.sin(tick * p.wobbleFreq + p.phase) * p.wobbleAmp
        p.x += p.vx + wobble
        p.y += p.vy + wobble

        // wrap around edges
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10
      }

      // draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECT_DIST) {
            const lineOpacity = (1 - dist / CONNECT_DIST) * 0.35
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${baseColor},${lineOpacity.toFixed(3)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // draw dots on top of lines
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${baseColor},${p.opacity.toFixed(3)})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    init()
    draw()

    const ro = new ResizeObserver(() => {
      resize()
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [particleDensity, speed])

  return (
    <canvas
      ref={canvasRef}
      className={className || ''}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  )
}
