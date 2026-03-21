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

const VIDEO_SRC     = '/hero-combined.mp4'   // truck (8s) + dissolve + ship (5.5s)
const SCROLL_HEIGHT = 700                     // vh — covers full combined video

// Story chapters
// Phase 1 (0 → PHASE_BREAK): static truck image with ch.0 text
// Phase 2 (PHASE_BREAK → 1): video scrub with ch.1–4 text
const CHAPTERS = [
  {
    range: [0, 0.15],          // visible during static image phase
    eyebrow: 'Bejoice Shipping Company · Saudi Arabia · Connecting KSA to the World',
    headline: ['SMART FREIGHT', 'POWERED BY AI'],
    sub: 'Award-winning freight forwarder delivering seamless end-to-end logistics solutions with reliability, efficiency, and the strength of a powerful global network.',
    showCta: true,
    showStats: true,
  },
  {
    range: [0.22, 0.38],       // video phase chapters
    eyebrow: 'Air Freight',
    headline: ['FAST AS', 'THE SKY'],
    sub: 'Priority air cargo handled with precision — express, charter, and consolidated shipments to 40+ countries.',
  },
  {
    range: [0.42, 0.57],
    eyebrow: 'Ocean Freight · FCL · LCL · Hazardous · Reefer',
    headline: ['OCEAN', 'FREIGHT'],
    sub: "Connecting Continents, Delivering Worldwide. We've Got you Covered — FCL, LCL, hazardous, reefer & oversized cargo across 180 countries, powered by Bejoice logistics experts.",
  },
  {
    range: [0.61, 0.74],
    eyebrow: 'Heavy Lift · ODC · OOG · Project Cargo',
    headline: ['WHEN THE LOAD', 'DEFIES LIMITS'],
    sub: "From hydraulic axle convoys to precision onsite jacking & skidding — we move wind turbines, transformers, and industrial modules that others won't touch.",
  },
  // Ship video chapters (progress ~0.67+ = ship footage)
  {
    range: [0.72, 0.84],
    eyebrow: 'Ocean Freight · Global Shipping Lanes',
    headline: ['THE WORLD\'S', 'OCEANS MOVE FOR YOU'],
    sub: 'Full container loads, bulk cargo, and project shipments across 180+ countries — on-time, every time.',
    align: 'right',
  },
  {
    range: [0.87, 0.97],
    eyebrow: 'Trust & Compliance',
    headline: ['CERTIFIED', 'TO DELIVER'],
    sub: 'ZATCA · ISO 9001 · FIATA · IATA · AEO · SASO — built on the strongest compliance foundation in the industry.',
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
  const wrapperRef      = useRef(null)
  const canvasRef       = useRef(null)
  const videoRef        = useRef(null)
  const globeVideoRef   = useRef(null)
  const rafRef          = useRef(null)
  const chaptersRef     = useRef([])

  // ── GLITTER ─────────────────────────────────────────────────────
  const glitterColors = ['#c8a84e','#ffe680','#ffffff','#f5d98b','#ffd700','#e8cc7a']
  const spawnGlitter = useCallback((e) => {
    const count = 6
    for (let i = 0; i < count; i++) {
      const el = document.createElement('span')
      const size = Math.random() * 8 + 4
      const color = glitterColors[Math.floor(Math.random() * glitterColors.length)]
      const angle = Math.random() * 360
      const dist = Math.random() * 55 + 20
      const dx = Math.cos((angle * Math.PI) / 180) * dist
      const dy = Math.sin((angle * Math.PI) / 180) * dist
      Object.assign(el.style, {
        position: 'fixed',
        left: e.clientX + 'px',
        top: e.clientY + 'px',
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
        background: color,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%) scale(1)',
        boxShadow: `0 0 ${size * 2}px ${color}`,
        transition: 'none',
      })
      document.body.appendChild(el)
      const start = performance.now()
      const duration = Math.random() * 500 + 400
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1)
        const ease = 1 - t * t
        el.style.transform = `translate(calc(-50% + ${dx * t}px), calc(-50% + ${dy * t}px)) scale(${ease})`
        el.style.opacity = ease
        if (t < 1) requestAnimationFrame(tick)
        else el.remove()
      }
      requestAnimationFrame(tick)
    }
  }, [])

  // ── PAINT ───────────────────────────────────────────────────────
  const paintVideo = useCallback((canvas, video) => {
    if (!canvas || !video || !video.videoWidth) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cw = canvas.clientWidth
    const ch = canvas.clientHeight
    // cover: fill viewport, no distortion
    const scale = Math.max(cw / video.videoWidth, ch / video.videoHeight)
    const w = video.videoWidth  * scale
    const h = video.videoHeight * scale
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

  // ── GSAP SCROLL SCRUB ────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress

          // ── Globe → canvas crossfade (0 → 10% scroll) ─────────
          const fadeEnd = 0.10
          const canvasOpacity = Math.min(1, p / fadeEnd)
          if (canvasRef.current)     canvasRef.current.style.opacity    = canvasOpacity
          if (globeVideoRef.current) globeVideoRef.current.style.opacity = 1 - canvasOpacity

          // ── Video scrub ────────────────────────────────────────
          const video = videoRef.current
          if (video && video.readyState >= 2 && video.duration) {
            video.currentTime = p * video.duration
          }

          // Chapter text
          chaptersRef.current.forEach((el, i) => {
            if (!el) return
            const [start, end] = CHAPTERS[i].range
            const fadeLen = 0.04
            let opacity = 0
            if (p >= start && p <= end) {
              if      (p < start + fadeLen) opacity = (p - start) / fadeLen
              else if (p > end   - fadeLen) opacity = (end - p)   / fadeLen
              else                          opacity = 1
            }
            el.style.opacity = opacity
            el.style.transform = `translateY(${(1 - Math.min(opacity, 1)) * 28}px)`
          })
        },
      })
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapperRef} id="hero" style={{ height: `${SCROLL_HEIGHT}vh`, position: 'relative' }}>
      {/* ── STICKY VIEWPORT ── */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Dark base */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: '#050508' }} />


        {/* Globe trade video — initial hero background, fades out on scroll */}
        <video
          ref={globeVideoRef}
          src="/globe-trade.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            opacity: 1,
          }}
        />

        {/* Hidden video — scrubbed via currentTime, painted to canvas */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          preload="auto"
          muted
          playsInline
          style={{ display: 'none' }}
        />

        {/* Canvas — video frames painted here, fades in on scroll */}
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0 }} />

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
              opacity: i === 0 ? 1 : 0,
              transform: 'translateY(0px)',
              transition: 'opacity 0.08s linear, transform 0.08s linear',
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
