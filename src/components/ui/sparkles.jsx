import React, { useId } from 'react'
import { useEffect, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { motion, useAnimation } from 'framer-motion'

// Module-level singleton — initParticlesEngine must only be called once per page load
let engineReady = null

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
}) => {
  const [init, setInit] = useState(false)
  useEffect(() => {
    if (!engineReady) {
      engineReady = initParticlesEngine(async (engine) => {
        await loadSlim(engine)
      })
    }
    engineReady.then(() => setInit(true))
  }, [])

  const controls = useAnimation()
  const generatedId = useId()

  const particlesLoaded = async (container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } })
    }
  }

  return (
    <motion.div animate={controls} className={`opacity-0 ${className || ''}`} style={{ pointerEvents: 'none' }}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || 'transparent' } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: false },
                onHover: { enable: false },
                resize: true,
              },
            },
            particles: {
              color: { value: particleColor || '#c8a84e' },
              move: {
                direction: 'none',
                enable: true,
                outModes: { default: 'out' },
                random: true,
                speed: { min: 0.1, max: speed || 0.6 },
                straight: false,
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity || 80,
              },
              opacity: {
                value: { min: 0.1, max: 0.7 },
                animation: {
                  enable: true,
                  speed: speed || 1.5,
                  sync: false,
                  mode: 'auto',
                  startValue: 'random',
                  destroy: 'none',
                },
              },
              shape: { type: 'circle' },
              size: {
                value: { min: minSize || 0.8, max: maxSize || 2.5 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
    </motion.div>
  )
}
