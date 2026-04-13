import React, { useMemo } from 'react'

const DumbbellIcon = ({ size, color, opacity }) => (
  <svg
    width={size * 3}
    height={size}
    viewBox="0 0 24 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    {/* left dot */}
    <circle cx="2" cy="3" r="2" fill={color} opacity={opacity} />
    {/* dash */}
    <line x1="4.5" y1="3" x2="19.5" y2="3" stroke={color} strokeWidth="1" opacity={opacity * 0.7} strokeLinecap="round" />
    {/* right dot */}
    <circle cx="22" cy="3" r="2" fill={color} opacity={opacity} />
  </svg>
)

// simple deterministic pseudo-random from a seed
function makeRand(seed) {
  let s = (seed * 1664525 + 1013904223) & 0x7fffffff
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s / 0x7fffffff
  }
}

export const SparklesCore = ({
  id,
  className,
  particleColor,
  particleDensity = 55,
  speed,
}) => {
  const color = '#ffffff'
  const count  = Math.min(particleDensity * 4, 280)
  const seed   = id ? [...id].reduce((a, c) => a + c.charCodeAt(0), 0) : 7

  const particles = useMemo(() => {
    const rand = makeRand(seed)
    return Array.from({ length: count }, (_, i) => ({
      id:       i,
      left:     rand() * 100,
      top:      rand() * 100,
      size:     4 + rand() * 4,                               // 4–8px
      opacity:  0.45 + rand() * 0.40,                        // 0.45–0.85
      duration: (speed ? 5 / speed : 1) * (0.8 + rand() * 2),// 0.8–2.8s fast spin
      delay:    -(rand() * 3),
      cw:       rand() > 0.5,
    }))
  }, [seed, count, speed])

  return (
    <div
      className={className || ''}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position:        'absolute',
            left:            `${p.left}%`,
            top:             `${p.top}%`,
            animation:       `${p.cw ? 'db-spin-cw' : 'db-spin-ccw'} ${p.duration.toFixed(2)}s ${p.delay.toFixed(2)}s linear infinite`,
            willChange:      'transform',
            transformOrigin: 'center center',
          }}
        >
          <DumbbellIcon size={p.size} color={color} opacity={p.opacity} />
        </div>
      ))}
    </div>
  )
}
