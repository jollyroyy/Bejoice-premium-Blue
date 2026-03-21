import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Animated counter component
function CountUp({ target, suffix = '', duration = 900 }) {
  const isNumeric = /^\d+(\.\d+)?$/.test(String(target).trim())
  const [display, setDisplay] = useState(isNumeric ? '0' : target)
  const hasRun = useRef(false)
  const elRef = useRef(null)

  const runAnim = () => {
    if (!isNumeric || hasRun.current) return
    hasRun.current = true
    const end = parseFloat(target)
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(ease * end) + suffix)
      if (t < 1) requestAnimationFrame(tick)
      else setDisplay(end + suffix)
    }
    requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (!isNumeric) return
    // Try after short delay to catch initial render
    const timer = setTimeout(runAnim, 800)
    return () => clearTimeout(timer)
  }, [target, suffix, duration])

  return <span ref={elRef}>{display}</span>
}

const VIDEO_SRC     = '/hero-combined.mp4'
// 1200 vh total — each of 6 chapters gets ~200 vh (~2000px) of comfortable scroll room
const SCROLL_HEIGHT = 1200

// Chapters span 0→1 with NO gaps. Each boundary uses a centered crossfade:
// outgoing fades 1→0 while incoming fades 0→1 over the same window,
// so combined opacity = 1.0 at every scroll position.
//
// hero-combined.mp4 = 12.42s | truck 0–7s (prog 0–0.56) | ship 7–12.42s (prog 0.56–1.0)
const HALF_FADE = 0.025   // half the crossfade window (= 30 vh either side of boundary)

const CHAPTERS = [
  {
    range: [0.00, 0.20],
    eyebrow: 'Hydraulic Axle Transport · OOG & ODC Cargo',
    headline: ['ENGINEERED', 'FOR EXTREMES'],
    sub: 'Navigating KSA\'s toughest corridors with hydraulic convoys for out-of-gauge cargo.',
    align: 'right',
  },
  {
    range: [0.20, 0.40],
    eyebrow: 'Route Survey & Modification · Technical Engineering',
    headline: ['EVERY ROUTE,', 'ZERO OBSTACLES'],
    sub: 'Precision surveys and route modifications. Every path mapped and certified before moving.',
    align: 'left',
  },
  {
    range: [0.40, 0.60],
    eyebrow: 'Onsite Jacking & Skidding · Lift Plans & Load Calc',
    headline: ['PRECISION', 'LIFT SCIENCE'],
    sub: 'Millimetre-precision jacking and skidding backed by 25+ years of lift science.',
    align: 'right',
  },
  {
    range: [0.60, 0.80],
    eyebrow: 'Customs Brokerage · Saudi Regulatory Compliance',
    headline: ['CLEARED BEFORE', 'IT LANDS'],
    sub: 'ZATCA-compliant and AEO-certified end-to-end customs clearance by Saudi experts.',
    align: 'left',
  },
  {
    range: [0.80, 1.00],
    eyebrow: 'Wind Turbines · Transformers · Industrial Modules',
    headline: ['WE MOVE', 'GIANTS'],
    sub: 'Moving transformers, turbines, and mega-modules. We handle the cargo that defines your project.',
    align: 'right',
  },
]

function TrackCard() {
  const [blNum, setBlNum]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [inputErr, setInputErr] = useState(false)

  const handleTrack = () => {
    if (!blNum.trim()) { setInputErr(true); return }
    setInputErr(false); setLoading(true); setResult(null)
    setTimeout(() => {
      setLoading(false); setResult('ok')
      const msg = `Hi, I'd like to track my shipment: ${blNum.trim()}`
      window.open(`https://wa.me/966550000000?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    }, 1200)
  }

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(135deg, rgba(180,190,210,0.08) 0%, rgba(120,130,160,0.05) 100%)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(200,210,230,0.18)',
      borderRadius: '0.9rem',
      padding: '0.9rem 1.4rem',
      boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
      textAlign: 'center',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      {/* Heading */}
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '1.7rem',
        color: 'rgba(220,228,240,0.95)',
        letterSpacing: '0.08em',
        lineHeight: 1.0,
        margin: '0 0 0.25rem',
        textTransform: 'uppercase',
        textShadow: '0 1px 8px rgba(0,0,0,0.6)',
      }}>
        WHERE IS YOUR SHIPMENT?
      </p>

      {/* Sub-label */}
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.65rem',
        color: 'rgba(180,190,210,0.6)',
        margin: '0 0 0.65rem',
        lineHeight: 1.4,
      }}>
        Enter your BL / AWB / Container No. for an instant WhatsApp update.
      </p>

      {/* Input + button row */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
        <input
          type="text"
          placeholder="e.g. MSKU1234567 or 157-12345678"
          value={blNum}
          onChange={e => { setBlNum(e.target.value); setInputErr(false); setResult(null) }}
          onKeyDown={e => e.key === 'Enter' && handleTrack()}
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${inputErr ? 'rgba(255,80,80,0.7)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '2rem',
            padding: '0.75rem 1.2rem',
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(200,168,78,0.55)')}
          onBlur={e => (e.target.style.borderColor = inputErr ? 'rgba(255,80,80,0.7)' : 'rgba(255,255,255,0.12)')}
        />
        <button
          onClick={handleTrack}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.4rem',
            padding: '0.75rem 1.6rem',
            background: '#c8a84e',
            color: '#0a0a0f',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.85rem', fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 18px rgba(200,168,78,0.35)',
            transition: 'background 0.2s, transform 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e8d48a'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#c8a84e'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'trackSpin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            : 'TRACK NOW'
          }
        </button>
      </div>

      {inputErr && (
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,100,100,0.9)', fontFamily: "'DM Sans', sans-serif" }}>
          Please enter a BL or AWB number
        </p>
      )}

      {result === 'ok' && (
        <div style={{ marginTop: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', animation: 'trackFadeIn 0.35s ease' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(37,211,102,1)" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
            Opening WhatsApp —{' '}
            <a href={`https://wa.me/966550000000?text=${encodeURIComponent(`Hi, I'd like to track my shipment: ${blNum.trim()}`)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(37,211,102,0.9)', textDecoration: 'underline' }}>Open WhatsApp</a>
          </span>
        </div>
      )}
    </div>
  )
}

export default function VideoHero({ onQuoteClick }) {
  const wrapperRef     = useRef(null)
  const canvasRef      = useRef(null)
  const videoRef       = useRef(null)
  const globeVideoRef  = useRef(null)
  const chaptersRef    = useRef([])
  const scrollLockedRef = useRef(true)
  const heroCardsRef   = useRef(null)
  const transHeadRef   = useRef(null)

  // Virtual scroll — drives chapter text during globe lock
  const virtualScrollRef  = useRef(0)   // accumulated wheel delta
  const virtualTargetRef  = useRef(0)   // target progress 0-1
  const virtualCurrentRef = useRef(-1)  // current lerped progress (-1 = not started)
  const virtualRafRef     = useRef(null)
  const VIRTUAL_TOTAL = 2800            // px of delta to traverse all 6 chapters

  // ── Shared: update every chapter's opacity for a given progress 0-1 ─
  // Uses centered crossfade: at boundary B, outgoing fades 1→0 while
  // incoming fades 0→1 over [B-HALF_FADE, B+HALF_FADE] → combined always 1.0
  const applyChapterProgress = useCallback((p) => {
    if (scrollLockedRef.current && transHeadRef.current) {
      transHeadRef.current.style.opacity = Math.max(0, 1 - p * 8);
    }
    chaptersRef.current.forEach((el, i) => {
      if (!el) return
      const [start, end] = CHAPTERS[i].range
      const isFirst = i === 0
      const isLast  = i === CHAPTERS.length - 1
      // First chapter: no fade-in (starts full), Last chapter: no fade-out (stays full at end)
      const visStart = isFirst ? 0        : start - HALF_FADE
      const visEnd   = isLast  ? 1        : end   + HALF_FADE
      let opacity = 0
      if (p >= visStart && p <= visEnd) {
        const fadeIn  = isFirst ? 1 : Math.min(1, (p - visStart) / (2 * HALF_FADE))
        const fadeOut = isLast  ? 1 : Math.min(1, (visEnd - p)   / (2 * HALF_FADE))
        opacity = Math.min(fadeIn, fadeOut)
      }
      el.style.opacity   = opacity
      el.style.transform = `translateY(${(1 - opacity) * 20}px)`
    })
  }, [])

  // ── PAINT frame to canvas ────────────────────────────────────────
  const paintVideo = useCallback((canvas, video) => {
    if (!canvas || !video || !video.videoWidth) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cw = canvas.clientWidth, ch = canvas.clientHeight
    const scale = Math.max(cw / video.videoWidth, ch / video.videoHeight)
    const w = video.videoWidth * scale, h = video.videoHeight * scale
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, cw * dpr, ch * dpr)
    ctx.drawImage(video, (cw - w) / 2, (ch - h) / 2, w, h)
  }, [])

  // ── CANVAS SIZE ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width  = window.innerWidth  * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width  = window.innerWidth  + 'px'
      canvas.style.height = window.innerHeight + 'px'
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      paintVideo(canvas, videoRef.current)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [paintVideo])

  // ── VIDEO SETUP ──────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Paint every decoded frame to canvas
    const doPaint = () => paintVideo(canvas, video)

    if ('requestVideoFrameCallback' in video) {
      const loop = () => { doPaint(); video.requestVideoFrameCallback(loop) }
      video.requestVideoFrameCallback(loop)
    } else {
      video.addEventListener('seeked', doPaint)
    }

    // Paint as soon as first frame is decoded
    video.addEventListener('loadeddata', doPaint)

    return () => {
      video.removeEventListener('loadeddata', doPaint)
      video.removeEventListener('seeked', doPaint)
    }
  }, [paintVideo])

  // ── PHASE 1: Globe plays — virtual scroll cycles chapters ─────────
  useEffect(() => {
    const globe  = globeVideoRef.current
    const canvas = canvasRef.current
    if (!globe) return

    // Always re-lock here (React Strict Mode runs effects twice; cleanup
    // sets scrollLockedRef=false, so we must re-set it on each effect run)
    scrollLockedRef.current = true

    // Initial visual states — globe video full-screen, no text, no canvas
    gsap.set(canvas, { opacity: 0, scale: 0.96, transformOrigin: 'center center' })
    gsap.set(globe,  { scale: 1.0, opacity: 1, filter: 'blur(0px)', transformOrigin: 'center center' })
    // Show hero cards during globe phase; transition heading stays hidden
    if (heroCardsRef.current) gsap.set(heroCardsRef.current, { opacity: 1, y: 0 })
    if (transHeadRef.current) gsap.set(transHeadRef.current, { opacity: 1, y: 0 })
    // Show chapter 0 (SMART FREIGHT) immediately on load; hide all others
    chaptersRef.current.forEach((el, i) => {
      if (!el) return
      el.style.opacity   = '0'
      el.style.transform = 'translateY(0px)'
    })

    // ── Smooth lerp loop for virtual scroll ─────────────────────────
    const lerpLoop = () => {
      const cur = virtualCurrentRef.current
      const tgt = virtualTargetRef.current
      const next = cur + (tgt - cur) * 0.07   // eased approach
      virtualCurrentRef.current = next
      applyChapterProgress(next)
      if (Math.abs(tgt - next) > 0.0005) {
        virtualRafRef.current = requestAnimationFrame(lerpLoop)
      } else {
        virtualCurrentRef.current = tgt
        applyChapterProgress(tgt)
        virtualRafRef.current = null
      }
    }

    // ── Wheel during lock → cycle chapter headings visually ─────────
    const onWheel = (e) => {
      e.preventDefault()
      virtualScrollRef.current = Math.max(
        0, Math.min(VIRTUAL_TOTAL, virtualScrollRef.current + e.deltaY * 0.85)
      )
      const newTarget = virtualScrollRef.current / VIRTUAL_TOTAL
      virtualTargetRef.current = newTarget
      // Kick off lerp if user hasn't scrolled yet — start from 0
      if (virtualCurrentRef.current < 0) virtualCurrentRef.current = 0
      if (!virtualRafRef.current) virtualRafRef.current = requestAnimationFrame(lerpLoop)
    }
    const onTouch = (e) => e.preventDefault()
    const onKey   = (e) => {
      if ([' ','ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(e.key))
        e.preventDefault()
    }
    window.addEventListener('wheel',     onWheel, { passive: false })
    window.addEventListener('touchmove', onTouch, { passive: false })
    window.addEventListener('keydown',   onKey)
    if (window.__lenis) window.__lenis.stop()

    // ── After globe ends → PHASE 2: cinematic transition ───────────
    const runTransition = () => {
      // Stop the virtual scroll lerp immediately
      if (virtualRafRef.current) { cancelAnimationFrame(virtualRafRef.current); virtualRafRef.current = null }

      // 1. Fade hero cards + all chapter text out cleanly first
      if (heroCardsRef.current) gsap.to(heroCardsRef.current, { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' })
      if (transHeadRef.current) gsap.to(transHeadRef.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' })
      chaptersRef.current.forEach(el => {
        if (el) gsap.to(el, { opacity: 0, y: -16, duration: 0.35, ease: 'power2.in' })
      })

      setTimeout(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            window.removeEventListener('wheel',     onWheel)
            window.removeEventListener('touchmove', onTouch)
            window.removeEventListener('keydown',   onKey)
            window.scrollTo(0, 0)
            if (window.__lenis) {
              window.__lenis.scrollTo(0, { immediate: true })
              window.__lenis.start()
            }
            scrollLockedRef.current = false
            ScrollTrigger.refresh()
            gsap.to(canvas, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' })
            applyChapterProgress(0)
          },
        })

        // Globe zooms and blurs out
        tl.to(globe, {
          scale: 1.14, opacity: 0, filter: 'blur(18px)',
          duration: 1.0, ease: 'power2.in',
        }, 0)
      }, 300)
    }

    globe.addEventListener('ended', runTransition, { once: true })

    return () => {
      globe.removeEventListener('ended', runTransition)
      window.removeEventListener('wheel',     onWheel)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('keydown',   onKey)
      if (virtualRafRef.current) cancelAnimationFrame(virtualRafRef.current)
      if (window.__lenis) window.__lenis.start()
      scrollLockedRef.current = false
    }
  }, [applyChapterProgress])

  // ── PHASE 3: Scroll-driven scrub + chapter sequencing ─────────────
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    // ── Raw scroll → chapter text (no scrub lag, always consistent) ──
    const onScroll = () => {
      if (scrollLockedRef.current) return
      const rect  = wrapper.getBoundingClientRect()
      const total = wrapper.offsetHeight - window.innerHeight
      const p     = Math.max(0, Math.min(1, -rect.top / total))
      applyChapterProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── GSAP scrub → video only (smooth frame scrubbing) ─────────────
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end:   'bottom bottom',
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (scrollLockedRef.current) return
          const video = videoRef.current
          if (video && video.readyState >= 2 && video.duration) {
            video.currentTime = self.progress * video.duration
          }
        },
      })
    }, wrapperRef)

    return () => {
      window.removeEventListener('scroll', onScroll)
      ctx.revert()
    }
  }, [applyChapterProgress])

  return (
    <div ref={wrapperRef} id="hero" style={{ height: `${SCROLL_HEIGHT}vh`, position: 'relative' }}>
      {/* ── STICKY VIEWPORT ── */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Dark base */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#050508' }} />


        {/* Globe video — plays fully as cinematic intro, then GSAP transitions out */}
        <video
          ref={globeVideoRef}
          src="/saudi-connected.mp4"
          autoPlay
          muted
          playsInline
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            opacity: 1,
            transformOrigin: 'center center',
            willChange: 'transform, opacity, filter',
          }}
        />

        {/* Hidden video — scrubbed via scroll, painted to canvas */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          preload="auto"
          muted
          playsInline
          style={{ display: 'none' }}
        />

        {/* Canvas — fades in via GSAP transition after globe ends */}
        <canvas ref={canvasRef} style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0,
          transformOrigin: 'center center',
          willChange: 'transform, opacity',
        }} />

        {/* Cinematic overlay — sits over globe video, stays for whole hero */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse 75% 65% at 50% 50%, rgba(5,5,8,0) 0%, rgba(5,5,8,0.48) 100%),
            linear-gradient(to bottom, rgba(5,5,8,0.55) 0%, rgba(5,5,8,0.02) 22%, rgba(5,5,8,0.02) 76%, rgba(5,5,8,0.70) 100%)
          `,
        }} />

        {/* Subtle bottom fade — keeps text readable over video */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(3,3,6,0.45) 0%, transparent 22%)',
        }} />

        {/* ── CHAPTER OVERLAYS ── */}
        {CHAPTERS.map((ch, i) => (
          <div key={i}
            ref={el => chaptersRef.current[i] = el}
            style={{
              position: 'absolute', inset: 0, zIndex: 4,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: ch.align === 'right' ? 'flex-end' : 'flex-start',
              textAlign: ch.align === 'right' ? 'right' : 'left',
              padding: 'clamp(2rem, 6vw, 6rem)',
              opacity: 0,
              transform: 'translateY(0px)',
              pointerEvents: 'none',
            }}
          >
            {/* Headline */}
            <div
              style={{ cursor: 'default', position: 'relative', pointerEvents: 'all' }}
            >
              {ch.headline.map((line, li) => (
                <h1 key={li}
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
                    lineHeight: 0.9, letterSpacing: '0.06em', margin: 0,
                    color: li % 2 === 0 ? '#ffffff' : '#ffe680',
                    textShadow: li % 2 === 0
                      ? '0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.2), 0 2px 32px rgba(0,0,0,0.8)'
                      : '0 0 24px rgba(255,214,0,0.7), 0 0 60px rgba(255,200,0,0.35), 0 2px 16px rgba(0,0,0,0.8)',
                    userSelect: 'none',
                    position: 'relative',
                    pointerEvents: 'all',
                    cursor: 'default',
                  }}>
                  <span
                    className={li % 2 !== 0 ? 'shine-ltr' : 'shine-text'}
                    data-text={line}>
                    {line}
                  </span>
                </h1>
              ))}
            </div>

            {/* Sub */}
            <div style={{ marginTop: '28px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '3px', minHeight: '100%', alignSelf: 'stretch', background: 'linear-gradient(180deg, #c8a84e, transparent)', borderRadius: '2px', flexShrink: 0, marginTop: '3px' }} />
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(17px, 2vw, 20px)', fontWeight: 500,
                color: '#ffffff', maxWidth: '420px',
                lineHeight: 1.75, margin: 0,
                textShadow: '0 1px 16px rgba(0,0,0,1), 0 2px 32px rgba(0,0,0,0.9)',
                letterSpacing: '0.01em',
              }}>
                {ch.sub}
              </p>
            </div>

            {/* CTA buttons — below subheading */}
            {ch.showCta && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px', pointerEvents: 'all' }}>
                <button className="btn-gold" style={{ fontSize: '13px', padding: '14px 32px' }}
                  onClick={onQuoteClick}
                >
                  <span className="shine-ltr" data-text="Get a Quote">Get a Quote</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button className="btn-ghost" style={{ fontSize: '13px', padding: '14px 32px' }}
                  onClick={() => { const el = document.getElementById('services'); if (el && window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 }) }}
                >
                  <span className="shine-ltr" data-text="Our Services">Our Services</span>
                </button>
              </div>
            )}

            {/* Track + Stats row */}
            {ch.showStats && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 2vw, 24px)', marginTop: '120px', alignItems: 'stretch', justifyContent: 'center', pointerEvents: 'all', width: '100%' }}>

                {/* LEFT — track card */}
                <div style={{ flex: '0 1 380px', minWidth: 0, maxWidth: '380px', display: 'flex' }}>
                  <TrackCard />
                </div>

                {/* RIGHT — stats row */}
                <div style={{
                  flex: '0 0 auto',
                  display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center',
                  background: 'linear-gradient(135deg, rgba(180,190,210,0.08) 0%, rgba(120,130,160,0.05) 100%)',
                  border: '1px solid rgba(200,210,230,0.18)',
                  borderRadius: '0.9rem',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                }}>
                  {[
                    { v: '1500', suffix: '+', l: 'Heavy Lift' },
                    { v: '120',  suffix: '+', l: 'Countries' },
                    { v: '25',   suffix: '+', l: 'Years' },
                    { v: '24/7', suffix: '',  l: 'Operations' },
                    { v: 'KSA',  suffix: '',  l: 'Specialist' },
                  ].map((s, i, arr) => (
                    <div key={s.l} style={{
                      display: 'flex', alignItems: 'center',
                      padding: '10px 12px',
                      borderRight: i < arr.length - 1 ? '1px solid rgba(200,210,230,0.1)' : 'none',
                      flexShrink: 0,
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: '3.2rem',
                          letterSpacing: '0.05em', lineHeight: 1,
                          color: '#ffffff',
                          textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(200,220,255,0.3), 0 1px 6px rgba(0,0,0,0.8)',
                        }}>
                          <CountUp target={s.v} suffix={s.suffix} duration={800} />
                        </div>
                        <div style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '13px', letterSpacing: '0.12em',
                          textTransform: 'uppercase', color: 'rgba(210,220,240,0.9)',
                          fontWeight: 600, marginTop: '4px',
                          whiteSpace: 'nowrap',
                        }}>{s.l}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        ))}

        {/* Transition heading — shown only during globe→scrollytelling crossfade */}
        <div ref={transHeadRef} style={{
          position: 'absolute', inset: 0, zIndex: 6,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          opacity: 0,
        }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(11px, 1.1vw, 14px)',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#c8a84e',
            margin: '0 0 16px',
            textShadow: '0 0 20px rgba(200,168,78,0.6)',
          }}>
            Bejoice · Est. 2006 · Saudi Arabia
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(2.6rem, 6.5vw, 6rem)',
            lineHeight: 0.92,
            letterSpacing: '0.06em',
            margin: 0,
            color: '#ffffff',
            textShadow: '0 0 40px rgba(255,255,255,0.35), 0 2px 32px rgba(0,0,0,0.9)',
          }}>
            SMART FREIGHT<br />
            <span style={{ color: '#ffe680', textShadow: '0 0 30px rgba(255,214,0,0.55), 0 2px 16px rgba(0,0,0,0.9)' }}>
              POWERED BY AI
            </span>
          </h2>
          <div style={{
            width: '60px', height: '2px',
            background: 'linear-gradient(90deg, transparent, #c8a84e, transparent)',
            margin: '24px auto 0',
            borderRadius: '2px',
          }} />
        </div>

        {/* Hero cards — visible during globe video, hidden before scrollytelling */}
        <div ref={heroCardsRef} style={{
          position: 'absolute', bottom: 'clamp(80px, 10vh, 120px)', left: 0, right: 0, zIndex: 5,
          display: 'flex', flexWrap: 'wrap', gap: 'clamp(12px, 2vw, 24px)',
          alignItems: 'stretch', justifyContent: 'center',
          padding: '0 clamp(2rem, 6vw, 6rem)',
          pointerEvents: 'all',
          opacity: 1,
        }}>
          {/* Tracking card */}
          <div style={{ flex: '0 1 380px', minWidth: 0, maxWidth: '380px', display: 'flex' }}>
            <TrackCard />
          </div>
          {/* Stats row */}
          <div style={{
            flex: '0 0 auto',
            display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center',
            background: 'linear-gradient(135deg, rgba(180,190,210,0.08) 0%, rgba(120,130,160,0.05) 100%)',
            border: '1px solid rgba(200,210,230,0.18)',
            borderRadius: '0.9rem',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            {[
              { v: '1500', suffix: '+', l: 'Heavy Lift' },
              { v: '120',  suffix: '+', l: 'Countries' },
              { v: '25',   suffix: '+', l: 'Years' },
              { v: '24/7', suffix: '',  l: 'Operations' },
              { v: 'KSA',  suffix: '',  l: 'Specialist' },
            ].map((s, i, arr) => (
              <div key={s.l} style={{
                display: 'flex', alignItems: 'center',
                padding: '10px 12px',
                borderRight: i < arr.length - 1 ? '1px solid rgba(200,210,230,0.1)' : 'none',
                flexShrink: 0,
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '3.2rem', letterSpacing: '0.05em', lineHeight: 1,
                    color: '#ffffff',
                    textShadow: '0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(200,220,255,0.3), 0 1px 6px rgba(0,0,0,0.8)',
                  }}>
                    <CountUp target={s.v} suffix={s.suffix} duration={800} />
                  </div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px', letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: 'rgba(210,220,240,0.9)',
                    fontWeight: 600, marginTop: '4px', whiteSpace: 'nowrap',
                  }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Animated Certification Strip */}
          <div style={{
            flex: '1 1 100%',
            marginTop: '2rem',
            padding: '1.2rem 0',
            background: 'linear-gradient(90deg, transparent, rgba(200,168,78,0.03) 50%, transparent)',
            borderTop: '1px solid rgba(200, 168, 78, 0.15)',
            borderBottom: '1px solid rgba(200, 168, 78, 0.05)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Fade edges to smooth the marquee entry/exit */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '12%', background: 'linear-gradient(to right, #050508 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '12%', background: 'linear-gradient(to left, #050508 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              width: 'max-content',
              animation: 'scrollMarquee 45s linear infinite',
            }}>
              {[0, 1].map((arrayIndex) => (
                <div key={arrayIndex} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(3.5rem, 6vw, 7rem)', paddingRight: 'clamp(3.5rem, 6vw, 7rem)' }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                    Certified By
                  </span>
                  {['ZATCA', 'ISO 9001', 'FIATA', 'IATA', 'AEO', 'SASO'].map((cert) => (
                    <span key={cert} style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(30px, 4vw, 46px)',
                      letterSpacing: '0.25em',
                      color: 'rgba(225, 195, 110, 0.95)',
                      textShadow: '0 0 16px rgba(225, 195, 110, 0.4), 0 2px 16px rgba(0,0,0,0.9)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#ffe680';
                      e.currentTarget.style.textShadow = '0 0 24px rgba(255,214,0,0.8), 0 2px 14px rgba(0,0,0,0.9)';
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(225, 195, 110, 0.95)';
                      e.currentTarget.style.textShadow = '0 0 16px rgba(225, 195, 110, 0.4), 0 2px 16px rgba(0,0,0,0.9)';
                      e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                    }}
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gold progress bar */}
        <ProgressBar wrapperRef={wrapperRef} />

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 5,
        }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '10px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>Scroll</span>
          <div style={{ width: '1px', height: '56px', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #c8a84e, transparent)', animation: 'scrollDown 2s ease-in-out infinite' }} />
          </div>
        </div>

        {/* Side label */}
        <div className="hidden lg:flex" style={{ position: 'absolute', right: '28px', top: '50%', transform: 'translateY(-50%)', flexDirection: 'column', alignItems: 'center', gap: '14px', zIndex: 5 }}>
          <div style={{ width: '1px', height: '72px', background: 'linear-gradient(to bottom, transparent, rgba(200,168,78,0.55), transparent)' }} />
          <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(200,168,78,0.5)', writingMode: 'vertical-rl', textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}>Est. 2006 · Saudi Arabia</span>
          <div style={{ width: '1px', height: '72px', background: 'linear-gradient(to bottom, transparent, rgba(200,168,78,0.55), transparent)' }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollDown {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @keyframes scrollMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

function ProgressBar({ wrapperRef }) {
  const barRef = useRef(null)
  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !barRef.current) return
      const total   = wrapperRef.current.offsetHeight - window.innerHeight
      const scrolled = -wrapperRef.current.getBoundingClientRect().top
      barRef.current.style.width = Math.max(0, Math.min(1, scrolled / total)) * 100 + '%'
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.06)', zIndex: 10 }}>
      <div ref={barRef} style={{ height: '100%', width: '0%', background: 'linear-gradient(to right,#9a7a2e,#c8a84e,#e8cc7a)', transition: 'width 0.08s linear' }} />
    </div>
  )
}
