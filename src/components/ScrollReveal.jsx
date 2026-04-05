import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal() {
  useEffect(() => {
    // Wait for DOM to settle
    const timer = setTimeout(() => {
      // Refresh ScrollTrigger after lazy sections have mounted + measured
      ScrollTrigger.refresh()

      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {

        // ── 1. SECTION WIPE-IN — each <section> outside hero ──
        const sections = gsap.utils.toArray('main > *:not(#hero-wrapper):not([id="hero"])')
        sections.forEach((sec) => {
          // If already in/above viewport, show immediately — don't hide it
          const rect = sec.getBoundingClientRect()
          const alreadyVisible = rect.top < window.innerHeight * 0.95
          if (alreadyVisible) return

          gsap.fromTo(sec,
            { opacity: 0, y: 60 },
            {
              opacity: 1, y: 0,
              duration: 1.0,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: sec,
                start: 'top 92%',
                end: 'top 40%',
                scrub: false,
                once: true,
              }
            }
          )
        })

        // ── 2. HEADINGS — h2 clip-path reveal ──
        const headings = gsap.utils.toArray('main h2:not(.no-reveal)')
        headings.forEach((el) => {
          gsap.fromTo(el,
            { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
            {
              clipPath: 'inset(0 0% 0 0)', opacity: 1,
              duration: 1.1,
              ease: 'power4.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              }
            }
          )
        })

        // ── 3. GOLD DIVIDER LINES — scale from left ──
        const goldLines = gsap.utils.toArray('.gold-line, [class*="gold-line"]')
        goldLines.forEach((el) => {
          gsap.fromTo(el,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 1.2,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
              }
            }
          )
        })

        // ── 4. GLASS CARDS — staggered float up ──
        const cardGroups = gsap.utils.toArray('.glass-card, .contact-glass-card, .contact-info-card')
        cardGroups.forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 50, scale: 0.96, filter: 'blur(6px)' },
            {
              opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
              duration: 0.9,
              ease: 'power3.out',
              delay: (i % 4) * 0.08,
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              }
            }
          )
        })

        // ── 5. UNIFIED BIG CARDS (Services, Contact outer) — scale-up reveal ──
        const bigCards = gsap.utils.toArray('#services .max-w-5xl > div, #contact .max-w-\\[780px\\] > div')
        bigCards.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, y: 80, scale: 0.94, filter: 'blur(10px)' },
            {
              opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
              duration: 1.2,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true,
              }
            }
          )
        })

        // ── 6. STAT NUMBERS — count-up feel with stagger ──
        const statCells = gsap.utils.toArray('.hero-stat-cell, .why-stat')
        statCells.forEach((el, i) => {
          gsap.fromTo(el,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1, y: 0, scale: 1,
              duration: 0.6,
              ease: 'back.out(1.4)',
              delay: i * 0.07,
              scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                once: true,
              }
            }
          )
        })

        // ── 7. EYEBROWS / LABELS — fade + letter-spacing collapse ──
        const eyebrows = gsap.utils.toArray('.section-num, [style*="letterSpacing"][style*="uppercase"]')
        eyebrows.forEach((el) => {
          gsap.fromTo(el,
            { opacity: 0, letterSpacing: '0.6em' },
            {
              opacity: 1, letterSpacing: '',
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                once: true,
              }
            }
          )
        })

        return () => { ScrollTrigger.getAll().forEach(t => t.kill()) }
      })

      return () => mm.revert()
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  return null
}
