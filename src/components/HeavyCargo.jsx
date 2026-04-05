import { useRef, useCallback } from 'react'
import { SparklesCore } from './ui/sparkles'

export default function HeavyCargo() {
  const gigaCardRef = useRef(null)
  const gigaGlowRef = useRef(null)

  const handleGigaMouseMove = useCallback((e) => {
    const card = gigaCardRef.current
    const glow = gigaGlowRef.current
    if (!card || !glow) return
    const rect = card.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    glow.style.background = `radial-gradient(600px circle at ${px}% ${py}%, rgba(200,168,78,0.10) 0%, rgba(200,168,78,0.04) 30%, transparent 65%)`
    const rx = ((e.clientY - rect.top) / rect.height - 0.5) * 4
    const ry = ((e.clientX - rect.left) / rect.width - 0.5) * -4
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }, [])

  const handleGigaMouseLeave = useCallback(() => {
    if (gigaCardRef.current) gigaCardRef.current.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
    if (gigaGlowRef.current) gigaGlowRef.current.style.background = 'transparent'
  }, [])

  return (
    <section id="heavy-cargo" className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(200,168,78,0.05) 0%, transparent 55%)' }} />

      <div className="max-w-7xl mx-auto">
        <div
          ref={gigaCardRef}
          onMouseMove={handleGigaMouseMove}
          onMouseLeave={handleGigaMouseLeave}
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(200,168,78,0.018) 100%)',
            backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
            border: '1px solid rgba(200,168,78,0.28)',
            borderTop: '1px solid rgba(200,168,78,0.55)',
            borderRadius: 28,
            boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,168,78,0.06) inset, inset 0 1px 0 rgba(255,215,105,0.22), 0 0 50px rgba(200,168,78,0.06)',
            overflow: 'hidden', position: 'relative',
            padding: 'clamp(24px,3.5vw,48px)',
            transition: 'transform 0.15s ease',
            willChange: 'transform',
          }}>

          {/* Sparkles background */}
          <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={2}
            particleDensity={60}
            particleColor="rgba(200,168,78,0.9)"
            speed={0.8}
            className="absolute inset-0 w-full h-full"
          />

          {/* Mouse-follow glow */}
          <div ref={gigaGlowRef} style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            borderRadius: 28, transition: 'background 0.1s ease', zIndex: 1,
          }} />

        </div>{/* end outer glass-card */}
      </div>
    </section>
  )
}
