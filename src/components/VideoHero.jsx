import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = '', duration = 900 }) {
  const isNumeric = /^\d+(\.\d+)?$/.test(String(target).trim())
  const [display, setDisplay] = useState(isNumeric ? '0' : target)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isNumeric) return
    const timer = setTimeout(() => {
      if (hasRun.current) return
      hasRun.current = true
      const end = parseFloat(target)
      const t0 = performance.now()
      const tick = (now) => {
        const t = Math.min((now - t0) / duration, 1)
        setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * end) + suffix)
        if (t < 1) requestAnimationFrame(tick)
        else setDisplay(end + suffix)
      }
      requestAnimationFrame(tick)
    }, 600)
    return () => clearTimeout(timer)
  }, [target, suffix, duration, isNumeric])

  return <span>{display}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const GLOBE_SRC    = '/saudi-connected.mp4'
const SCROLL_HEIGHT = 1400

// ── JPEG frame sequences ──────────────────────────────────────────
const FRAMES2_COUNT = 289
const FRAMES3_COUNT = 169
const TOTAL_FRAMES  = FRAMES2_COUNT + FRAMES3_COUNT   // 458

const FRAME_URLS = [
  ...Array.from({ length: FRAMES2_COUNT }, (_, i) =>
    `/frames2/${String(i + 1).padStart(4, '0')}.jpg`),
  ...Array.from({ length: FRAMES3_COUNT }, (_, i) =>
    `/frames3/${String(i + 1).padStart(4, '0')}.jpg`),
]

// Headings shown during the 4-second globe lock — alternate sides
const INTRO_SLIDES = [
  { headline: ['SMART FREIGHT', 'POWERED BY AI'], eyebrow: "Saudi Arabia's No.1 Logistics Partner", align: 'center', sub: ['Award-winning freight forwarder delivering seamless end-to-end logistics solutions', 'with reliability, efficiency, and the strength of a powerful global network.'] },
]

// Fade window inside each chapter's own range — keeps chapters strictly sequential.
// Chapter N is fully gone before chapter N+1 starts (zero overlap).
const FADE = 0.045

// Sequence: centre → right → left → centre → right
const CHAPTERS = [
  {
    range:    [0.00, 0.25],
    eyebrow:  'Hydraulic Axle Transport · OOG & ODC Cargo',
    headline: ['ENGINEERED', 'FOR EXTREMES'],
    sub:      'Precision surveys and route modifications. Every path mapped and certified before moving.',
    align:    'right',
  },
  {
    range:    [0.25, 0.50],
    eyebrow:  'Route Survey & Modification · Technical Engineering',
    headline: ['EVERY ROUTE,', 'ZERO OBSTACLES'],
    sub:      'Millimetre-precision jacking and skidding backed by 25+ years of lift science.',
    align:    'left',
  },
  {
    range:    [0.50, 0.75],
    eyebrow:  'Customs Brokerage · Saudi Regulatory Compliance',
    headline: ['CLEARED BEFORE', 'IT LANDS'],
    sub:      'ZATCA-compliant and AEO-certified end-to-end customs clearance by Saudi experts.',
    align:    'center',
  },
  {
    range:    [0.75, 1.00],
    eyebrow:  'Wind Turbines · Transformers · Industrial Modules',
    headline: ['WE MOVE', 'GIANTS'],
    sub:      'Moving transformers, turbines, and mega-modules. We handle the cargo that defines your project.',
    align:    'right',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Shipment Tracker
// ─────────────────────────────────────────────────────────────────────────────
function TrackModal({ blNum, onClose }) {
  const [phase, setPhase] = useState('scanning') // scanning → ready
  const waUrl = `https://wa.me/966550000000?text=${encodeURIComponent(`Hi, I'd like to track my shipment: ${blNum.trim()}`)}`

  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 2200)
    return () => clearTimeout(t)
  }, [])

  // Close on Escape
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        display:'flex', alignItems:'center', justifyContent:'center',
        background:'rgba(3,3,6,0.88)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
        animation:'trackFadeIn 0.3s ease',
        padding:'1.5rem',
      }}
    >
      <div style={{
        width:'100%', maxWidth:'480px',
        background:'linear-gradient(135deg,rgba(10,14,26,0.98) 0%,rgba(5,5,8,0.98) 100%)',
        border:'1px solid rgba(200,210,230,0.18)',
        borderRadius:'1.2rem',
        boxShadow:'0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,168,78,0.08) inset',
        overflow:'hidden',
        animation:'trackSlideUp 0.35s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {/* Gold top bar */}
        <div style={{ height:'2px', background:'linear-gradient(90deg,transparent,rgba(200,168,78,0.9),transparent)' }} />

        <div style={{ padding:'2rem' }}>
          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', color:'#fff', letterSpacing:'0.08em', lineHeight:1 }}>
                SHIPMENT TRACKING
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', color:'rgba(200,168,78,0.7)', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:'4px' }}>
                Powered by Bejoice · WhatsApp Connect
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)', flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Reference number display */}
          <div style={{ background:'rgba(200,168,78,0.06)', border:'1px solid rgba(200,168,78,0.18)', borderRadius:'8px', padding:'0.9rem 1.2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'10px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(200,168,78,0.8)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', color:'rgba(200,168,78,0.6)', letterSpacing:'0.18em', textTransform:'uppercase' }}>Reference No.</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.95rem', color:'#fff', fontWeight:600, letterSpacing:'0.06em', marginTop:'2px' }}>{blNum.trim()}</div>
            </div>
          </div>

          {/* Scanning animation OR ready state */}
          {phase === 'scanning' ? (
            <div style={{ textAlign:'center', padding:'1.5rem 0' }}>
              {/* Animated radar ring */}
              <div style={{ position:'relative', width:'80px', height:'80px', margin:'0 auto 1.2rem' }}>
                <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'1.5px solid rgba(37,211,102,0.3)', animation:'trackPulseRing 1.4s ease-out infinite' }} />
                <div style={{ position:'absolute', inset:'10px', borderRadius:'50%', border:'1.5px solid rgba(37,211,102,0.2)', animation:'trackPulseRing 1.4s ease-out infinite 0.35s' }} />
                <div style={{ position:'absolute', inset:'20px', borderRadius:'50%', border:'1px solid rgba(37,211,102,0.15)', animation:'trackPulseRing 1.4s ease-out infinite 0.7s' }} />
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(37,211,102,0.9)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.995 1.006C6.024 1.006 1.08 5.95 1.08 11.921c0 1.93.505 3.74 1.386 5.315L1.08 22.994l5.938-1.557a10.843 10.843 0 0 0 4.977 1.194c5.971 0 10.915-4.944 10.915-10.915 0-5.97-4.944-10.71-10.915-10.71z"/></svg>
                </div>
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', color:'rgba(255,255,255,0.7)', letterSpacing:'0.12em', textTransform:'uppercase' }}>
                Connecting to agent...
              </div>
              {/* Scanning bar */}
              <div style={{ margin:'1rem auto 0', maxWidth:'200px', height:'2px', background:'rgba(255,255,255,0.06)', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ height:'100%', background:'linear-gradient(90deg,transparent,rgba(37,211,102,0.8),transparent)', animation:'trackScanBar 1.4s ease-in-out infinite', borderRadius:'2px' }} />
              </div>
            </div>
          ) : (
            <div style={{ animation:'trackFadeIn 0.4s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.2rem', padding:'0.8rem 1rem', background:'rgba(37,211,102,0.07)', border:'1px solid rgba(37,211,102,0.2)', borderRadius:'8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(37,211,102,1)" strokeWidth="2"><path d="M20 6 9 17l-5-5"/></svg>
                <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.8rem', color:'rgba(255,255,255,0.85)' }}>
                  Reference found — our agent is ready to assist you on WhatsApp.
                </span>
              </div>
              <a
                href={waUrl} target="_blank" rel="noopener noreferrer"
                style={{
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
                  width:'100%', boxSizing:'border-box', padding:'0.9rem',
                  background:'linear-gradient(135deg,#25d366 0%,#128c7e 100%)',
                  color:'#fff', textDecoration:'none',
                  fontFamily:"'DM Sans',sans-serif", fontSize:'0.85rem', fontWeight:800,
                  letterSpacing:'0.1em', textTransform:'uppercase',
                  borderRadius:'8px', border:'none',
                  boxShadow:'0 4px 24px rgba(37,211,102,0.45)',
                  transition:'all 0.2s ease',
                }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 6px 32px rgba(37,211,102,0.65)'; e.currentTarget.style.transform='translateY(-1px)' }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 24px rgba(37,211,102,0.45)'; e.currentTarget.style.transform='translateY(0)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.995 1.006C6.024 1.006 1.08 5.95 1.08 11.921c0 1.93.505 3.74 1.386 5.315L1.08 22.994l5.938-1.557a10.843 10.843 0 0 0 4.977 1.194c5.971 0 10.915-4.944 10.915-10.915 0-5.97-4.944-10.71-10.915-10.71z"/></svg>
                OPEN WHATSAPP
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TrackCard() {
  const [blNum, setBlNum]       = useState('')
  const [inputErr, setInputErr] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleTrack = () => {
    if (!blNum.trim()) { setInputErr(true); return }
    setInputErr(false)
    setShowModal(true)
  }

  return (
    <>
      {showModal && <TrackModal blNum={blNum} onClose={() => setShowModal(false)} />}
      <div style={{
        width:'100%',
        background:'linear-gradient(135deg,rgba(180,190,210,0.08) 0%,rgba(120,130,160,0.05) 100%)',
        backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
        border:'1px solid rgba(200,210,230,0.18)', borderRadius:'0.9rem',
        padding:'0.55rem 1.2rem',
        boxShadow:'0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.08)',
        textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center',
      }}>
        <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.7rem', color:'rgba(220,228,240,0.95)', letterSpacing:'0.08em', lineHeight:1, margin:'0 0 0.25rem', textTransform:'uppercase', textShadow:'0 1px 8px rgba(0,0,0,0.6)' }}>
          WHERE IS YOUR SHIPMENT?
        </p>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', color:'rgba(180,190,210,0.6)', margin:'0 0 0.65rem', lineHeight:1.4 }}>
          Enter your BL / AWB / Container No. for an instant WhatsApp update.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:'0.55rem' }}>
          <input type="text" placeholder="BL / AWB / Container No."
            value={blNum}
            onChange={e => { setBlNum(e.target.value); setInputErr(false) }}
            onKeyDown={e => e.key === 'Enter' && handleTrack()}
            style={{
              width:'100%', boxSizing:'border-box',
              background:'rgba(255,255,255,0.05)',
              border:`1px solid ${inputErr?'rgba(255,80,80,0.7)':'rgba(255,255,255,0.12)'}`,
              borderRadius:'6px', padding:'0.7rem 1rem', color:'#fff',
              fontFamily:"'DM Sans',sans-serif", fontSize:'0.88rem', outline:'none',
              transition:'border-color 0.2s',
            }}
            onFocus={e => (e.target.style.borderColor='rgba(200,168,78,0.55)')}
            onBlur={e  => (e.target.style.borderColor=inputErr?'rgba(255,80,80,0.7)':'rgba(255,255,255,0.12)')}
          />
          <button onClick={handleTrack}
            style={{
              width:'100%', boxSizing:'border-box',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
              padding:'12px 22px',
              background:'linear-gradient(135deg,#f5d97a,#e8cc7a,#c8a84e)',
              color:'#050508',
              fontFamily:"'DM Sans',sans-serif", fontSize:'13.5px', fontWeight:900,
              letterSpacing:'0.12em', textTransform:'uppercase', border:'1px solid rgba(255,255,255,0.2)',
              borderRadius:'10px', cursor:'pointer', position:'relative', overflow:'hidden',
              boxShadow:'0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              transition:'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 24px rgba(200,168,78,0.4), 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'; e.currentTarget.style.transform='translateY(-1.5px)'; e.currentTarget.style.background='linear-gradient(135deg,#fff2a8,#f5d97a,#e8cc7a)' }}
            onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='linear-gradient(135deg,#f5d97a,#e8cc7a,#c8a84e)' }}
            onMouseDown={e=>{ e.currentTarget.style.transform='translateY(0) scale(0.98)' }}
            onMouseUp={e=>{ e.currentTarget.style.transform='translateY(-1.5px)' }}
          >
            <div className="btn-shine-overlay" />
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            TRACK NOW
          </button>
        </div>
        {inputErr && <p style={{ marginTop:'0.5rem', fontSize:'0.75rem', color:'rgba(255,100,100,0.9)', fontFamily:"'DM Sans',sans-serif" }}>Please enter a BL or AWB number</p>}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main VideoHero
// ─────────────────────────────────────────────────────────────────────────────
export default function VideoHero({ onQuoteClick }) {
  const wrapperRef      = useRef(null)
  const canvasRef       = useRef(null)
  const globeVideoRef   = useRef(null)
  const chaptersRef     = useRef([])
  const heroCardsRef    = useRef(null)
  const exitOverlayRef  = useRef(null)
  const introContainerRef = useRef(null)
  const framesRef       = useRef([])       // loaded Image objects
  const lastIdxRef      = useRef(-1)       // last drawn frame index
  const [introIdx, setIntroIdx]         = useState(0)
  const [introShowing, setIntroShowing] = useState(true)  // heading visible/hidden
  const [introVisible, setIntroVisible] = useState(true)  // entire intro phase active
  const [fontsReady, setFontsReady]     = useState(false) // hide until fonts loaded

  // ── Wait for Bebas Neue + DM Sans to load before showing any heading ──
  useEffect(() => {
    document.fonts.load("1em 'Bebas Neue'").then(() =>
      document.fonts.load("1em 'DM Sans'")
    ).then(() => setFontsReady(true))
    .catch(() => setFontsReady(true)) // fallback: show anyway if fonts fail
  }, [])

  // ── Cycle intro slides on timers — no scroll lock, video responds freely ──
  useEffect(() => {
    // Only one intro slide — SMART FREIGHT shows immediately at top
    setIntroIdx(0)
    setIntroShowing(true)
  }, [])

  // ── Strictly sequential chapter opacity (zero overlap) ───────────
  const applyProgress = useCallback((p) => {
    chaptersRef.current.forEach((el, i) => {
      if (!el) return
      const [start, end] = CHAPTERS[i].range
      const isFirst = i === 0
      const isLast  = i === CHAPTERS.length - 1
      let opacity = 0

      if (isFirst) {
        if      (p >= start + FADE && p < end - FADE) opacity = 1
        else if (p >= start        && p < start + FADE) opacity = (p - start) / FADE
        else if (p >= end - FADE   && p < end)          opacity = (end - p)   / FADE
      } else if (isLast) {
        if      (p >= start + FADE) opacity = 1
        else if (p >= start)        opacity = (p - start) / FADE
      } else {
        if      (p >= start + FADE && p < end - FADE) opacity = 1
        else if (p >= start        && p < start + FADE) opacity = (p - start) / FADE
        else if (p >= end - FADE   && p < end)          opacity = (end - p)   / FADE
      }

      el.style.opacity   = String(opacity)
      el.style.transform = `translateY(${(1 - opacity) * 30}px)`
    })
  }, [])

  // ── Canvas: size to DPR viewport ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width        = Math.round(window.innerWidth  * dpr)
      canvas.height       = Math.round(window.innerHeight * dpr)
      canvas.style.width  = window.innerWidth  + 'px'
      canvas.style.height = window.innerHeight + 'px'
      // repaint after resize
      const prev = lastIdxRef.current
      lastIdxRef.current = -1
      if (prev >= 0) paintFrame(prev)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])   // paintFrame defined below — safe because effect runs after mount

  // ── Draw one JPEG frame onto canvas ──────────────────────────────
  const paintFrame = useCallback((idx) => {
    const canvas = canvasRef.current
    if (!canvas || canvas.width === 0) return
    const frames = framesRef.current

    // Use exact frame or nearest loaded one behind it
    let img = null
    for (let i = Math.min(idx, frames.length - 1); i >= 0; i--) {
      const f = frames[i]
      if (f && f.complete && f.naturalWidth > 0) { img = f; break }
    }
    if (!img) return
    if (lastIdxRef.current === idx) return
    lastIdxRef.current = idx

    const ctx   = canvas.getContext('2d')
    const cw    = canvas.width
    const ch    = canvas.height
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
    const w     = img.naturalWidth  * scale
    const h     = img.naturalHeight * scale
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
  }, [])

  // ── Preload all frames immediately in parallel ────────────────────
  useEffect(() => {
    const imgs = new Array(TOTAL_FRAMES)
    framesRef.current = imgs
    FRAME_URLS.forEach((url, i) => {
      const img = new window.Image()
      img.onload = () => {
        // As soon as frame 0 loads, reveal the canvas (scroll will control opacity)
        if (i === 0) {
          paintFrame(0)
        }
      }
      img.src = url
      imgs[i] = img
    })
  }, [paintFrame])

  // ── Globe setup — fade in on load, canvas hidden, chapters hidden ──
  useEffect(() => {
    if (canvasRef.current)     canvasRef.current.style.opacity  = '0'
    if (globeVideoRef.current) {
      const g = globeVideoRef.current
      g.style.opacity   = '0'
      g.style.transform = 'translateY(0px) scale(1.04)'
      g.style.transition = 'opacity 1.2s ease'
      // Fade in once video can play
      const onCanPlay = () => {
        requestAnimationFrame(() => {
          g.style.opacity = '1'
          g.style.transform = 'translateY(0px)'
          // Remove transition after fade-in so RAF controls transform directly
          setTimeout(() => { g.style.transition = 'none' }, 1300)
        })
      }
      g.addEventListener('canplaythrough', onCanPlay, { once: true })
      // Fallback if already ready
      if (g.readyState >= 3) onCanPlay()
    }
    chaptersRef.current.forEach(el => { if (el) el.style.opacity = '0' })
  }, [])

  // ── Scroll: globe slides up, truck fades in — RAF lerp for silky motion ──
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const GLOBE_EXIT = 0.22   // globe fully gone by 22% scroll

    let targetP  = 0          // raw scroll progress
    let currentP = 0          // lerped progress (drives visuals)
    let rafId    = null
    let lastIntroVisible = true

    const lerp = (a, b, t) => a + (b - a) * t

    const render = () => {
      // Smooth lerp — 0.09 = silky, higher = snappier
      currentP = lerp(currentP, targetP, 0.09)

      const p  = currentP
      const gp = Math.min(p / GLOBE_EXIT, 1)

      // ── Intro heading ──
      const nowIntroVisible = p < GLOBE_EXIT + 0.05
      if (nowIntroVisible !== lastIntroVisible) {
        lastIntroVisible = nowIntroVisible
        if (nowIntroVisible) setIntroVisible(true)
        else                 setIntroVisible(false)
      }
      if (introContainerRef.current) {
        introContainerRef.current.style.transform = `translateY(-${gp * 105}%)`
        introContainerRef.current.style.opacity   = String(Math.max(0, 1 - gp * 1.2))
      }

      // ── Globe: slides up cleanly, no opacity change ──
      const globe = globeVideoRef.current
      if (globe) {
        globe.style.transform = `translateY(-${gp * 100}%)`
      }

      // ── Canvas fades in gracefully in last 35% of globe zone ──
      const canvas = canvasRef.current
      if (canvas) {
        const cOpacity = Math.min(Math.max(0, (gp - 0.65) / 0.35), 1)
        canvas.style.opacity = String(cOpacity)
      }

      // ── Frame scrub after globe zone ──
      const videoP   = p <= GLOBE_EXIT ? 0 : (p - GLOBE_EXIT) / (1 - GLOBE_EXIT)
      const frameIdx = Math.min(Math.round(videoP * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
      paintFrame(frameIdx)

      applyProgress(videoP)

      // ── Exit fade ──
      if (exitOverlayRef.current) {
        exitOverlayRef.current.style.opacity = String(
          Math.max(0, Math.min(1, (videoP - 0.88) / 0.12))
        )
      }

      // Keep looping only while animating
      if (Math.abs(currentP - targetP) > 0.0001) {
        rafId = requestAnimationFrame(render)
      } else {
        rafId = null
      }
    }

    const onScroll = () => {
      const rect  = wrapper.getBoundingClientRect()
      const total = wrapper.offsetHeight - window.innerHeight
      targetP = Math.max(0, Math.min(1, -rect.top / total))
      if (!rafId) rafId = requestAnimationFrame(render)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [applyProgress])

  // ─────────────────────────────────────────────────────────────────
  return (
    <div ref={wrapperRef} id="hero" style={{ height:`${SCROLL_HEIGHT}vh`, position:'relative' }}>

      {/* ── STICKY VIEWPORT ── */}
      <div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

        {/* Dark base */}
        <div style={{ position:'absolute', inset:0, zIndex:0, background:'#050508' }} />

        {/* ── GLOBE VIDEO — plays once as cinematic intro, no loop ── */}
        <video
          ref={globeVideoRef}
          src={GLOBE_SRC}
          autoPlay
          muted
          playsInline
          style={{
            position:'absolute', inset:0, zIndex:1,
            width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center center',
            opacity:1, transformOrigin:'center center',
            willChange:'transform,opacity,filter',
          }}
        />

        {/* ── CANVAS — shows JPEG frames scrubbed by scroll ── */}
        <canvas ref={canvasRef} style={{
          position:'absolute', inset:0, zIndex:2,
          opacity:0,                            /* revealed by GSAP transition */
          willChange:'opacity',
        }} />

        {/* Exit overlay */}
        <div ref={exitOverlayRef} style={{
          position:'absolute', inset:0, zIndex:8,
          background:'linear-gradient(to bottom,rgba(5,5,8,0.96) 0%,#050508 100%)',
          pointerEvents:'none', opacity:0, willChange:'opacity',
        }} />

        {/* Cinematic vignette — over both videos */}
        <div style={{
          position:'absolute', inset:0, zIndex:3, pointerEvents:'none',
          background:`
            radial-gradient(ellipse 75% 65% at 50% 50%,rgba(5,5,8,0) 0%,rgba(5,5,8,0.45) 100%),
            linear-gradient(to bottom,rgba(5,5,8,0.50) 0%,rgba(5,5,8,0.01) 22%,rgba(5,5,8,0.01) 76%,rgba(5,5,8,0.70) 100%)
          `,
        }} />

        {/* ── INTRO SLIDES — shown during 4-second globe lock ── */}
        {fontsReady && introVisible && introShowing && introIdx < INTRO_SLIDES.length && (() => {
          const slide = INTRO_SLIDES[introIdx]
          const isCenter = slide.align === 'center'
          const isRight  = slide.align === 'right'
          return (
            <div key={introIdx}
              ref={introContainerRef}
              style={{
                position:'absolute', inset:0, zIndex:5,
                display:'flex', flexDirection:'column', justifyContent:'center',
                alignItems:  isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                textAlign:   isCenter ? 'center'  : isRight ? 'right'   : 'left',
                padding:'clamp(2rem,6vw,6rem)',
                paddingBottom:'clamp(220px,34vh,380px)',
                pointerEvents:'none',
                // animation:'introSlide 0.45s cubic-bezier(0.23,1,0.32,1)', // removed to avoid jump
              }}>
              <div style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:'clamp(11px,1.1vw,14px)', letterSpacing:'0.32em',
                textTransform:'uppercase', fontWeight:600,
                color:'#ffe680',
                textShadow:'0 0 18px rgba(200,168,78,0.9), 0 1px 14px rgba(0,0,0,1)',
                background:'rgba(0,0,0,0.45)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                padding:'7px 18px', borderRadius:'3px',
                marginBottom:'22px',
                display:'inline-block',
                border:'1px solid rgba(200,168,78,0.3)',
              }}>
                <span className="shine-ltr" data-text={slide.eyebrow}>{slide.eyebrow}</span>
              </div>
              <div style={{ cursor:'default' }}>
                {slide.headline.map((line, li) => (
                  <h1 key={li} style={{
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:'clamp(2rem,5.5vw,5.5rem)',
                    lineHeight:0.87, letterSpacing:'0.06em', margin:0,
                    color: li % 2 === 0 ? '#ffffff' : 'rgba(200,168,78,0.90)',
                    textShadow:'0 2px 48px rgba(0,0,0,0.95),0 0 120px rgba(0,0,0,0.6)',
                    userSelect:'none',
                  }}>
                    {line}
                  </h1>
                ))}
              </div>
              <div style={{
                width: isCenter ? '80px' : '60px', height:'2px', marginTop:'22px',
                background:'linear-gradient(90deg,rgba(200,168,78,0.85),rgba(200,168,78,0.08))',
                alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
              }} />
              {slide.sub && (
                <div style={{
                  fontFamily:"'DM Sans',sans-serif",
                  fontSize:'clamp(12px,1.2vw,15px)', fontWeight:500,
                  color:'rgba(255,255,255,0.95)', maxWidth:'600px',
                  margin:'22px 0 0',
                  textShadow:'0 1px 18px rgba(0,0,0,1)',
                  letterSpacing:'0.18em', textTransform:'uppercase',
                  background:'rgba(0,0,0,0.4)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
                  padding:'12px 20px', borderRadius:'4px',
                  alignSelf: isCenter ? 'center' : undefined,
                  textAlign: isCenter ? 'center' : 'left',
                  lineHeight: 2,
                }}>
                  {(Array.isArray(slide.sub) ? slide.sub : [slide.sub]).map((line, li) => (
                    <div key={li}>{line}</div>
                  ))}
                </div>
              )}
              {/* Quick Quote CTA */}
              <button
                onClick={() => { if (onQuoteClick) onQuoteClick() }}
                style={{
                  pointerEvents:'all',
                  marginTop:'32px',
                  display:'inline-flex', alignItems:'center', gap:'12px',
                  padding: '16px 36px',
                  background:'linear-gradient(135deg,#f5d97a 0%,#e8cc7a 40%,#c8a84e 100%)',
                  color:'#050508',
                  fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(12px,1.1vw,14px)',
                  fontWeight:900, letterSpacing:'0.22em', textTransform:'uppercase',
                  border:'1px solid rgba(255,255,255,0.2)', borderRadius:'12px', cursor:'pointer',
                  position:'relative', overflow:'hidden',
                  boxShadow:'0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)',
                  transition:'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                  alignSelf: isCenter ? 'center' : undefined,
                }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 12px 48px rgba(200,168,78,0.4), 0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.5)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='linear-gradient(135deg,#fff2a8 0%,#f5d97a 40%,#e8cc7a 100%)' }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.4)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='linear-gradient(135deg,#f5d97a 0%,#e8cc7a 40%,#c8a84e 100%)' }}
                onMouseDown={e=>{ e.currentTarget.style.transform='scale(0.98)' }}
                onMouseUp={e=>{ e.currentTarget.style.transform='translateY(-2px)' }}
              >
                <div className="btn-shine-overlay" />
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                GET A QUICK QUOTE
              </button>
            </div>
          )
        })()}

        {/* ── CHAPTER OVERLAYS — strictly one at a time ── */}
        {CHAPTERS.map((ch, i) => {
          const isCenter = ch.align === 'center'
          const isRight  = ch.align === 'right'
          return (
            <div key={i}
              ref={el => chaptersRef.current[i] = el}
              style={{
                position:'absolute', inset:0, zIndex:4,
                display:'flex', flexDirection:'column', justifyContent:'center',
                alignItems:    isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                textAlign:     isCenter ? 'center' : isRight ? 'right'    : 'left',
                padding:       'clamp(2rem,6vw,6rem)',
                paddingBottom: 'clamp(220px,34vh,380px)',
                opacity:0,
                transform:'translateY(0px)',
                pointerEvents:'none',
                willChange:'opacity,transform',
                transition:'none',           /* transitions driven by JS, not CSS */
              }}
            >
              {/* Eyebrow */}
              <div style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:'clamp(10px,1vw,12px)', letterSpacing:'0.34em',
                textTransform:'uppercase', color:'rgba(200,168,78,0.72)',
                marginBottom:'20px', textShadow:'0 1px 12px rgba(0,0,0,0.95)',
              }}>
                {ch.eyebrow}
              </div>

              {/* Headline */}
              <div style={{ pointerEvents:'all', cursor:'default' }}>
                {ch.headline.map((line, li) => (
                  <h1 key={li} style={{
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:'clamp(2rem,5.5vw,5.5rem)',
                    lineHeight:0.87, letterSpacing:'0.06em', margin:0,
                    color: li % 2 === 0 ? '#ffffff' : 'rgba(200,168,78,0.90)',
                    textShadow:'0 2px 48px rgba(0,0,0,0.95),0 0 120px rgba(0,0,0,0.6)',
                    userSelect:'none',
                  }}>
                    {line}
                  </h1>
                ))}
              </div>

              {/* Gold accent line */}
              <div style={{
                width: isCenter ? '80px' : '60px', height:'2px', marginTop:'26px',
                background:'linear-gradient(90deg,rgba(200,168,78,0.85),rgba(200,168,78,0.08))',
                alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
              }} />

              {/* Sub text */}
              {ch.sub && (
                <p style={{
                  fontFamily:"'DM Sans',sans-serif",
                  fontSize:'clamp(13px,1.4vw,16px)', fontWeight:600,
                  color:'rgba(255,255,255,1)', maxWidth:'520px',
                  lineHeight:1.9, margin:'20px 0 0',
                  textShadow:'0 0 20px rgba(255,255,255,0.35), 0 1px 18px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.8)',
                  background:'rgba(0,0,0,0.35)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)',
                  padding:'10px 16px', borderRadius:'4px',
                  letterSpacing:'0.22em', textTransform:'uppercase',
                  alignSelf: isCenter ? 'center' : undefined,
                }}>
                  {ch.sub}
                </p>
              )}

              {/* Chapter counter */}
              <div style={{
                marginTop:'16px', fontFamily:"'Bebas Neue',sans-serif",
                fontSize:'11px', letterSpacing:'0.38em', textTransform:'uppercase',
                color:'rgba(200,168,78,0.32)',
                alignSelf: isCenter ? 'center' : undefined,
              }}>
                {String(i+1).padStart(2,'0')} / {String(CHAPTERS.length).padStart(2,'0')}
              </div>
            </div>
          )
        })}

        {/* ── Bottom bar — track card + stats ── */}
        <div ref={heroCardsRef} style={{
          position:'absolute', bottom:'clamp(20px,3vh,44px)', left:0, right:0, zIndex:5,
          display:'flex', flexWrap:'wrap', gap:'clamp(10px,1.8vw,20px)',
          alignItems:'stretch', justifyContent:'center',
          padding:'0 clamp(1.5rem,5vw,5rem)', pointerEvents:'all',
        }}>
          <div style={{ flex:'0 1 360px', minWidth:0, maxWidth:'380px', display:'flex' }}>
            <TrackCard />
          </div>

          <div style={{
            flex:'0 0 auto', display:'flex', flexDirection:'row', flexWrap:'nowrap', alignItems:'center',
            background:'linear-gradient(135deg,rgba(180,190,210,0.08) 0%,rgba(120,130,160,0.05) 100%)',
            border:'1px solid rgba(200,210,230,0.18)', borderRadius:'0.9rem',
            backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
            boxShadow:'0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.08)',
            overflow:'hidden',
          }}>
            {[
              { v:'1500', suffix:'+', l:'Heavy Lift' },
              { v:'120',  suffix:'+', l:'Countries'  },
              { v:'25',   suffix:'+', l:'Years'      },
              { v:'24/7', suffix:'',  l:'Operations' },
              { v:'KSA',  suffix:'',  l:'Specialist' },
            ].map((s, idx, arr) => (
              <div key={s.l} style={{
                display:'flex', alignItems:'center', padding:'6px 10px',
                borderRight: idx < arr.length-1 ? '1px solid rgba(200,210,230,0.1)' : 'none',
                flexShrink:0,
              }}>
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.6rem', letterSpacing:'0.05em', lineHeight:1, color:'#ffffff', textShadow:'0 0 20px rgba(255,255,255,0.6),0 0 40px rgba(200,220,255,0.3),0 1px 6px rgba(0,0,0,0.8)' }}>
                    <CountUp target={s.v} suffix={s.suffix} duration={800} />
                  </div>
                  <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(210,220,240,0.9)', fontWeight:600, marginTop:'4px', whiteSpace:'nowrap' }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cert marquee */}
          <div style={{
            flex:'1 1 100%', padding:'1rem 0',
            background:'linear-gradient(90deg,transparent,rgba(200,168,78,0.03) 50%,transparent)',
            borderTop:'1px solid rgba(200,168,78,0.15)',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'10%', background:'linear-gradient(to right,#050508,transparent)', zIndex:2, pointerEvents:'none' }} />
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'10%', background:'linear-gradient(to left,#050508,transparent)', zIndex:2, pointerEvents:'none' }} />
            <div style={{ display:'flex', alignItems:'center', width:'max-content', animation:'scrollMarquee 45s linear infinite' }}>
              {[0,1].map(k => (
                <div key={k} style={{ display:'flex', alignItems:'center', gap:'clamp(3rem,5vw,6rem)', paddingRight:'clamp(3rem,5vw,6rem)' }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'12px', letterSpacing:'0.28em', textTransform:'uppercase', color:'rgba(255,255,255,0.5)', fontWeight:600, whiteSpace:'nowrap' }}>Certified By</span>
                  {['ZATCA','ISO 9001','FIATA','IATA','AEO','SASO'].map(cert => (
                    <span key={cert} style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(22px,3vw,36px)', letterSpacing:'0.25em', color:'rgba(200,168,78,0.82)', cursor:'default', whiteSpace:'nowrap' }}>{cert}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProgressBar wrapperRef={wrapperRef} />

      </div>

      <style>{`
        @keyframes trackSpin    { to { transform:rotate(360deg); } }
        @keyframes trackFadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scrollMarquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes introSlide   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress bar
// ─────────────────────────────────────────────────────────────────────────────
function ProgressBar({ wrapperRef }) {
  const barRef = useRef(null)
  useEffect(() => {
    const update = () => {
      if (!wrapperRef.current || !barRef.current) return
      const total   = wrapperRef.current.offsetHeight - window.innerHeight
      const scrolled = -wrapperRef.current.getBoundingClientRect().top
      barRef.current.style.width = Math.max(0, Math.min(1, scrolled / total)) * 100 + '%'
    }
    window.addEventListener('scroll', update, { passive:true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'2px', background:'rgba(255,255,255,0.06)', zIndex:10 }}>
      <div ref={barRef} style={{ height:'100%', width:'0%', background:'linear-gradient(to right,#9a7a2e,#c8a84e,#e8cc7a)', transition:'width 0.08s linear' }} />
    </div>
  )
}
