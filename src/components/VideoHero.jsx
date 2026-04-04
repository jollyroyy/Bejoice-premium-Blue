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
const SCROLL_HEIGHT = 1800

// ── Frame sequences (3 clean segments, no duplication) ───────────────
// frames1: 0–184   (185) globe/intro JPEGs
// frames2: 185–430 (246) enhanced Bejoice PNGs — files 0044–0289
// frames6: 431–551 (121) road / project cargo JPEGs
// TOTAL: 552
const FRAMES1_COUNT = 185
const FRAMES2_COUNT = 246
const FRAMES2_START = 44   // start from file 0044
const FRAMES6_COUNT = 121
const TOTAL_FRAMES  = FRAMES1_COUNT + FRAMES2_COUNT + FRAMES6_COUNT  // 576

const FRAME_URLS = [
  // frames1 intro sequence (idx 0–184)
  ...Array.from({ length: FRAMES1_COUNT }, (_, i) => 
    `/frames1/${String(i + 1).padStart(4, '0')}.jpg`
  ),
  // frames2 seg: 185–454
  ...Array.from({ length: FRAMES2_COUNT }, (_, i) =>
    `/frames2/${String(FRAMES2_START + i).padStart(4, '0')}.png`),
  // frames6 seg: 455–575
  ...Array.from({ length: FRAMES6_COUNT }, (_, i) =>
    `/frames6/${String(i + 1).padStart(4, '0')}.jpg`),
]

// Headings shown during the 4-second globe lock — alternate sides
// Fade window in frames — how many frames to crossfade between chapters
const FRAME_FADE = 18

// Chapters mapped to 3-segment sequence.
// frames1:0–184 | frames2:185–430 | frames6:431–551
// Each chapter window ≥ 45 frames; non-overlapping; FRAME_FADE=18 on each edge.
const CHAPTERS = [
  // ── frames1: 0–184 ──
  {
    frameRange: [0, 184],
    eyebrow:    'CONNECTING KSA TO THE WORLD',
    headline:   ['SMART FREIGHT', 'POWERED BY AI'],
    sub:        'Award-winning freight forwarder delivering seamless end-to-end logistics with reliability and global reach.',
    align:      'left',
    showCTA:    true,
  },
  // ── frames2: 185–430 — 5 evenly-spaced chapters (~45 frames each) ──
  {
    frameRange: [185, 229],
    eyebrow:    '180+ COUNTRIES · 25+ YEARS EXPERIENCE',
    headline:   ['FROM BLUE PRINT TO', 'DELIVERY, WE MOVE IT ALL'],
    sub:        "Saudi Arabia's premier freight forwarder — delivering seamless logistics across 180+ countries.",
    align:      'right',
  },
  {
    frameRange: [237, 281],
    eyebrow:    'HEAVY CARGO & PROJECT LOGISTICS',
    headline:   ['HEAVY LIFT / ODC', '/ OOG TRANSPORTATION'],
    sub:        'Hydraulic axle transport for oversized and heavy equipment — wind turbines, transformers, industrial machinery, and large project cargo.',
    align:      'right',
  },
  {
    frameRange: [289, 333],
    eyebrow:    'GCC ROAD NETWORK',
    headline:   ['CONNECTED', 'GLOBALLY'],
    sub:        'Seamless cross-border land transport across the GCC, powered by a state-of-the-art fleet.',
    align:      'left',
  },
  {
    frameRange: [341, 385],
    eyebrow:    'CUSTOMS CLEARANCE · ZATCA CERTIFIED',
    headline:   ['DRIVEN BY TRANSPARENCY.', 'DELIVERED WITH TRUST'],
    sub:        'We handle the paperwork. You handle the business.',
    align:      'right',
  },
  {
    frameRange: [393, 430],
    eyebrow:    'SEA FREIGHT · FCL & LCL',
    headline:   ['NAVIGATING OCEANS.', 'DELIVERING CONFIDENCE'],
    sub:        'Global maritime networks connecting the Port of Jeddah to every major international hub.',
    align:      'left',
  },
  // ── frames6: 431–551 — 2 chapters ──
  {
    frameRange: [439, 489],
    eyebrow:    'PRECISION HEAVY LIFT · 1500+ OPERATIONS',
    headline:   ['PRECISION IN HANDLING.', 'EXCELLENCE IN DELIVERY'],
    sub:        "Precision Placement Where Cranes Can't Go. Millimeter-accurate. No room for error — and we never make one.",
    align:      'right',
  },
  {
    frameRange: [497, 551],
    eyebrow:    'ENGINEERING · ISO 9001 CERTIFIED',
    headline:   ['TECHNICAL ENGINEERING', 'SOLUTIONS'],
    sub:        'Lift plans, load calculations, and structural analysis to ensure every heavy move is safe and compliant.',
    align:      'left',
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

function SleekCard({ children, className = '', style = {} }) {
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -5 // Increased tilt for more interactivity
    const rotateY = ((x - centerX) / centerX) * 5
    
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
  }

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`sleek-card ${className} premium-card-shine`} 
      style={{
        width:'100%', height:'100%', flex:'1 1 auto', position:'relative', overflow:'hidden',
        background:'rgba(10, 10, 14, 0.55)', 
        backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
        border:'1px solid rgba(255, 215, 120, 0.12)', 
        borderRadius:'14px',
        padding:'1rem 1.25rem',
        boxShadow:'0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px rgba(200,168,78,0.04)',
        display:'flex', flexDirection:'column',
        transition:'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease',
        willChange:'transform',
        ...style
      }}
    >
      <div className="card-glow-overlay" style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, -20%), rgba(255,215,120,0.08), transparent 75%)',
        opacity:0.6
      }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1.5, background:'linear-gradient(90deg,transparent,rgba(255,215,120,0.35),transparent)', pointerEvents:'none', zIndex:1 }}/>
      <div className="card-shine-anim" />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function FreightCalcCard() {
  const [cbm, setCbm]           = useState('')
  const [ctype, setCtype]       = useState('20ft')
  const [result, setResult]     = useState(null)

  const calculate = () => {
    const vol = parseFloat(cbm)
    if (!vol || vol <= 0) { setResult({ error: true }); return }
    const cap = CONTAINER_CAPS[ctype]
    const needed = Math.ceil(vol / cap)
    const utilPct = Math.round((vol / (needed * cap)) * 100)
    setResult({ vol, cap, needed, utilPct, ctype })
  }

  const labelStyle = {
    fontFamily:"'Inter',sans-serif", fontSize:'13px', letterSpacing:'0.08em', fontWeight:600,
    textTransform:'uppercase', color:'rgba(255,255,255,0.5)', marginBottom:'6px',
    display:'block',
  }

  return (
    <SleekCard style={{ gap: '1rem' }}>
      <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', color:'var(--gold-light)', letterSpacing:'0.1em', margin:0, textTransform:'uppercase', textAlign:'center' }}>
        Container Advisor
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' }}>
        <div>
          <span style={labelStyle}>Type</span>
          <select value={ctype} onChange={e => { setCtype(e.target.value); setResult(null) }}
            className="sleek-select" style={{ fontSize:'15px', padding:'10px 14px', borderRadius:'10px' }}>
            <option value="20ft">20′ Std</option>
            <option value="40ft">40′ Std</option>
            <option value="40HC">40′ HC</option>
          </select>
        </div>
        <div>
          <span style={labelStyle}>Volume</span>
          <input
            type="number" min="0" step="0.1"
            placeholder="CBM"
            value={cbm}
            onChange={e => { setCbm(e.target.value); setResult(null) }}
            onKeyDown={e => e.key === 'Enter' && calculate()}
            className="sleek-input" style={{ fontSize:'15px', padding:'10px 14px', borderRadius:'10px' }}
          />
        </div>
      </div>

      <button onClick={calculate} className="btn-gold" style={{
        width:'auto', alignSelf:'center', padding:'12px 36px', fontSize:'1rem', borderRadius:'10px', fontWeight:700
      }}>
        Calculate
      </button>

      {result && (
        <div style={{
          marginTop:'8px', padding:'10px 16px', borderRadius:'8px',
          background: result.needed > 1 ? 'rgba(200,168,78,0.15)' : 'rgba(34,197,94,0.15)',
          border: `1px solid ${result.needed > 1 ? 'rgba(200,168,78,0.4)' : 'rgba(34,197,94,0.4)'}`,
        }}>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'14px', color:'#fff', margin:0, textAlign:'center', fontWeight:600 }}>
            {result.needed > 1 ? `⚠ ${result.needed} Units Needed` : `✓ Fits 1 × ${result.ctype}`}
          </p>
        </div>
      )}
    </SleekCard>
  )
}

function TrackCard() {
  return (
    <SleekCard style={{ justifyContent:'center', padding:'1.25rem 1.75rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'24px' }}>
        <div>
          <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', color:'#fff', letterSpacing:'0.08em', margin:0, lineHeight:1.1 }}>
            SHIPMENT TRACKING
          </p>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'11px', color:'rgba(255,255,255,0.5)', margin:'6px 0 0', letterSpacing:'0.14em', textTransform:'uppercase', fontWeight:600 }}>
            Real-Time Global Visibility
          </p>
        </div>
        <button
          onClick={() => window.open('https://www.track-trace.com/', '_blank', 'noopener,noreferrer')}
          className="btn-gold"
          style={{ padding:'12px 28px', fontSize:'1rem', borderRadius:'10px', whiteSpace:'nowrap', flexShrink:0, fontWeight:700 }}
        >
          Track Now
        </button>
      </div>
    </SleekCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main VideoHero
// ─────────────────────────────────────────────────────────────────────────────
export default function VideoHero({ onQuoteClick }) {
  const wrapperRef     = useRef(null)
  const canvasRef      = useRef(null)
  const chaptersRef    = useRef([])
  const heroCardsRef   = useRef(null)
  const exitOverlayRef = useRef(null)
  const framesRef      = useRef([])   // decoded ImageBitmap / Image objects
  const lastIdxRef     = useRef(-1)   // last drawn frame index

  // ── Chapter opacity driven by exact frame index (hardcoded to footage) ──
  const applyProgress = useCallback((frameIdx) => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      const el = chaptersRef.current[i]
      if (!el) continue

      const [start, end] = CHAPTERS[i].frameRange
      const isLast = i === CHAPTERS.length - 1
      let opacity = 0

      if (isLast) {
        // Last chapter fades in and stays; exit overlay covers the end
        if      (frameIdx >= start + FRAME_FADE) opacity = 1
        else if (frameIdx >= start)              opacity = (frameIdx - start) / FRAME_FADE
      } else {
        if      (frameIdx >= start + FRAME_FADE && frameIdx <= end - FRAME_FADE) opacity = 1
        else if (frameIdx >= start              && frameIdx <  start + FRAME_FADE) opacity = (frameIdx - start) / FRAME_FADE
        else if (frameIdx >  end - FRAME_FADE   && frameIdx <= end)                opacity = (end - frameIdx)   / FRAME_FADE
        else opacity = 0
      }

      opacity = Math.max(0, Math.min(1, opacity))
      el.style.opacity   = String(opacity)
      el.style.transform = `translateY(${(1 - opacity) * 28}px)`
    }
  }, [])

  // ── Canvas: size to DPR viewport ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      // Use parent's rendered size so canvas matches exactly — handles 100svh correctly
      const parent = canvas.parentElement
      const w = parent ? parent.offsetWidth  : window.innerWidth
      const h = parent ? parent.offsetHeight : window.innerHeight
      canvas.width  = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
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

    // Always cover — fill entire canvas, no black bars
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)

    const w = img.naturalWidth  * scale
    const h = img.naturalHeight * scale
    const x = (cw - w) / 2
    const y = (ch - h) / 2

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // HDR-like enhancement: boost contrast, saturation & brightness
    ctx.filter = 'contrast(1.15) saturate(1.25) brightness(1.05)'
    ctx.drawImage(img, x, y, w, h)
    ctx.filter = 'none'
  }, [])

  // ── Progressive frame loader ──────────────────────────────────────
  // loadedUpToRef tracks the highest index we've kicked off loading for
  const loadedUpToRef = useRef(-1)

  const loadFrameRange = useCallback((from, to) => {
    const imgs = framesRef.current
    const end  = Math.min(to, TOTAL_FRAMES - 1)
    for (let i = Math.max(0, from); i <= end; i++) {
      if (imgs[i]) continue          // already loading/loaded
      const img = new window.Image()
      img.src = FRAME_URLS[i]
      imgs[i] = img
      if (i > loadedUpToRef.current) loadedUpToRef.current = i
    }
  }, [])

  // Phase 1 — Immediate: Load frame 0 urgently
  useEffect(() => {
    framesRef.current = new Array(TOTAL_FRAMES)
    const firstImg = new window.Image()
    firstImg.src = FRAME_URLS[0]
    firstImg.onload = () => {
      framesRef.current[0] = firstImg
      // If we haven't scrolled yet, paint it instantly
      if (lastIdxRef.current === -1) {
        paintFrame(0)
        // Ensure first chapter is visible before showing the app
        applyProgress(FRAME_FADE)
        // Signal root to fade in (prevents FOUT/flash)
        if (typeof window.__markHeroReady === 'function') window.__markHeroReady()
      }
    }
    
    // Phase 1b — Eager batch: load first 30 frames (smaller chunk for less lag)
    loadFrameRange(1, 30)

    // Phase 2 — idle background: load all remaining frames when browser is free
    const scheduleIdle = (start) => {
      if (start >= TOTAL_FRAMES) return
      const handle = requestIdleCallback
        ? requestIdleCallback(() => { loadFrameRange(start, start + 39); scheduleIdle(start + 40) }, { timeout: 3000 })
        : setTimeout(() => { loadFrameRange(start, start + 39); scheduleIdle(start + 40) }, 300)
      return handle
    }
    scheduleIdle(31)
  }, [loadFrameRange, paintFrame])

  // Phase 3 — scroll-ahead: called from RAF loop to stay 80 frames ahead
  const loadAhead = useCallback((frameIdx) => {
    const target = Math.min(frameIdx + 150, TOTAL_FRAMES - 1)
    if (target > loadedUpToRef.current) {
      loadFrameRange(loadedUpToRef.current + 1, target)
    }
  }, [loadFrameRange])

  // ── Init: canvas visible, show first chapter heading immediately ──
  useEffect(() => {
    if (canvasRef.current) canvasRef.current.style.opacity = '1'
    // Hide all chapters first
    for (let i = 0; i < CHAPTERS.length; i++) {
      const el = chaptersRef.current[i]
      if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(28px)' }
    }
    // Show first chapter fully visible on load (past the fade-in window)
    applyProgress(FRAME_FADE)
    
    // Safety check: if frame 0 took too long or errored, show it anyway after a timeout
    const timer = setTimeout(() => {
      if (typeof window.__markHeroReady === 'function') window.__markHeroReady()
    }, 1200)
    return () => clearTimeout(timer)
  }, [applyProgress])

  // ── Scroll: pure frame scrub — canvas drives everything from frame 0 ──
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let targetP  = 0
    let smoothP  = 0   // lerped — for text/overlay animations only
    let rafId    = null

    const lerp = (a, b, t) => a + (b - a) * t

    const render = () => {
      // Overlays and Frames use smoothP — gentle lerp for cinematic coherence
      smoothP = lerp(smoothP, targetP, 0.1) 

      const frameIdx = Math.min(Math.round(smoothP * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
      loadAhead(frameIdx)
      paintFrame(frameIdx)

      // Chapter headings driven by smooth frame index
      applyProgress(frameIdx)

      // ── Hero cards fade ──
      if (heroCardsRef.current) {
        const CARD_FADE_START  = 140
        const CARD_FADE_END    = 185
        const CARGO_FADE_START = 793
        const CARGO_FADE_END   = 813
        const introOp = frameIdx < CARD_FADE_START ? 1
          : frameIdx > CARD_FADE_END ? 0
          : 1 - (frameIdx - CARD_FADE_START) / (CARD_FADE_END - CARD_FADE_START)
        const cargoOp = frameIdx < CARGO_FADE_START ? 1
          : frameIdx > CARGO_FADE_END ? 0
          : 1 - (frameIdx - CARGO_FADE_START) / (CARGO_FADE_END - CARGO_FADE_START)
        const finalOp = Math.min(introOp, cargoOp)
        heroCardsRef.current.style.opacity       = String(finalOp)
        heroCardsRef.current.style.transform     = 'none'
        heroCardsRef.current.style.pointerEvents = finalOp < 0.1 ? 'none' : 'all'
      }

      // ── Exit fade — last 3% of scroll ──
      if (exitOverlayRef.current) {
        exitOverlayRef.current.style.opacity = String(
          Math.max(0, Math.min(1, (smoothP - 0.97) / 0.03))
        )
      }

      if (Math.abs(smoothP - targetP) > 0.0001) {
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

    // High-DPI Canvas Resizing
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        paintFrame(Math.min(Math.round(targetP * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1))
      }
    };

    window.addEventListener('resize', handleResize)
    handleResize()
    window.addEventListener('scroll', onScroll, { passive: true })
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [applyProgress, loadAhead, paintFrame])

  // ─────────────────────────────────────────────────────────────────
  return (
    <div ref={wrapperRef} id="hero" style={{ height:`${SCROLL_HEIGHT}vh`, position:'relative' }}>

      {/* ── STICKY VIEWPORT ── */}
      <div className="hero-sticky-viewport" style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

        {/* Dark base */}
        <div style={{ position:'absolute', inset:0, zIndex:0, background:'#050508' }} />

        {/* ── CANVAS — sits beneath globe, always ready ── */}
        <canvas ref={canvasRef} style={{
          position:'absolute', inset:0, zIndex:1,
          width:'100%', height:'100%',
          opacity:1,
          willChange:'transform',
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


        {/* ── CHAPTER OVERLAYS — strictly one at a time ── */}
        {CHAPTERS.map((ch, i) => {
          const isCenter = ch.align === 'center'
          const isRight  = ch.align === 'right'
          const isTop    = ch.vAlign === 'top'
          return (
            <div key={i}
              ref={el => chaptersRef.current[i] = el}
              className="hero-content-overlay"
              style={{
                position:'absolute', inset:0, zIndex:4,
                display:'flex', flexDirection:'column',
                justifyContent: isTop ? 'flex-start' : 'center',
                alignItems:    isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                textAlign:     isCenter ? 'center' : isRight ? 'right'    : 'left',
                padding:       'clamp(1.2rem,5vw,6rem)',
                paddingTop:    isTop ? 'clamp(5rem,10vh,8rem)' : undefined,
                paddingBottom: 'clamp(160px,28vh,320px)',
                /* NO opacity here — React re-renders would reset it.
                   Initial opacity:0 is applied by the useEffect below.
                   The RAF owns opacity from then on. */
                pointerEvents:'none',
                willChange:'opacity,transform',
                transition:'none',
              }}
            >

              {/* Glass card behind heading content */}
              <div style={{
                display:'flex', flexDirection:'column',
                alignItems: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                background:'rgba(5,5,8,0.45)',
                backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
                border:'1px solid rgba(200,168,78,0.14)',
                borderRadius:'12px',
                padding:'clamp(16px,2.5vw,28px) clamp(20px,3vw,36px)',
                boxShadow:'0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)',
                maxWidth:'clamp(280px,55vw,680px)',
                alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
              }}>

                {/* Eyebrow */}
                {ch.eyebrow && (
                  <div className="hero-eyebrow" style={{
                    display:'inline-flex', alignItems:'center', gap:'8px',
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:'clamp(10px,1.1vw,13px)', letterSpacing:'0.22em',
                    textTransform:'uppercase', fontWeight:600,
                    color:'rgba(255,224,120,1)',
                    background:'rgba(200,168,78,0.14)',
                    border:'1px solid rgba(255,215,100,0.35)',
                    borderRadius:'2px', padding:'5px 14px',
                    marginBottom:'14px',
                    alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                    userSelect:'none', pointerEvents:'none',
                  }}>
                    {ch.eyebrow}
                  </div>
                )}

                {/* Headline */}
                <div style={{ pointerEvents:'all', cursor:'default' }}>
                  {ch.headline.map((line, li) => (
                    <h1 key={li} style={{
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:'clamp(2rem,5.5vw,5.5rem)',
                      lineHeight:0.87, letterSpacing:'0.06em', margin:0,
                      color: li % 2 === 0 ? '#ffffff' : 'rgba(255,215,105,1)',
                      textShadow: li % 2 === 0
                        ? '0 0 30px rgba(255,255,255,0.2), 0 2px 12px rgba(0,0,0,0.6)'
                        : '0 0 24px rgba(255,200,80,0.3), 0 2px 12px rgba(0,0,0,0.6)',
                      userSelect:'none',
                    }}>
                      {line}
                    </h1>
                  ))}
                </div>

                {/* Gold accent line */}
                <div style={{
                  width: isCenter ? '80px' : '60px', height:'2px', marginTop:'20px',
                  background:'linear-gradient(90deg,rgba(200,168,78,0.85),rgba(200,168,78,0.08))',
                  alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                }} />

                {/* Start Shipment CTA — first chapter only */}
                {ch.showCTA && (
                  <button
                    className="hero-intro-cta btn-gold"
                    onClick={onQuoteClick}
                    style={{
                      marginTop:'24px',
                      alignSelf:'center',
                      display:'flex', alignItems:'center', gap:'10px',
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:'clamp(13px,1.4vw,16px)', letterSpacing:'0.18em',
                      padding:'14px 32px', borderRadius:'3px', cursor:'pointer',
                      pointerEvents:'all',
                    }}
                  >
                    START SHIPMENT
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="btn-shine-overlay" />
                  </button>
                )}

              </div>
            </div>
          )
        })}

        {/* ── Bottom bar — track card + stats ── */}
        <div ref={heroCardsRef} className="hero-bottom-bar" style={{
          position:'absolute', bottom:'clamp(24px,5vh,60px)', left:0, right:0, zIndex:5,
          display:'flex', flexWrap:'wrap', gap:'clamp(60px,8vw,120px)',
          alignItems:'stretch', justifyContent:'flex-start',
          padding:'0 clamp(2rem,5vw,6rem)', pointerEvents:'all',
        }}>
          <div style={{ display:'flex', gap:'clamp(16px,2vw,24px)', flex:'0 1 auto', minWidth:0, alignItems:'stretch' }}>
            <div className="hero-track-wrap" style={{ flex:'0 1 auto', minWidth:0, display:'flex', alignItems:'stretch' }}>
              <TrackCard />
            </div>
            <div className="hero-track-wrap" style={{ flex:'0 1 auto', minWidth:0, display:'flex', alignItems:'stretch' }}>
              <FreightCalcCard />
            </div>
          </div>

          <div className="hero-stats-bar" style={{
            flex:'0 0 auto', display:'flex', flexDirection:'row', flexWrap:'nowrap', alignItems:'center',
            background:'rgba(15, 15, 20, 0.4)',
            border:'1px solid rgba(255, 255, 255, 0.08)', borderRadius:'8px',
            backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
            boxShadow:'0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            overflow:'hidden',
            height: '100%', minHeight: '80px', // Matches SleekCard height naturally
          }}>
            {[
              { v:'120',  suffix:'+', l:'Countries'  },
              { v:'25',   suffix:'+', l:'Years'      },
              { v:'24/7', suffix:'',  l:'Operations' },
              { v:'KSA',  suffix:'',  l:'Specialist' },
            ].map((s, idx, arr) => (
              <div key={s.l} className="hero-stat-cell" style={{
                display:'flex', alignItems:'center', padding:'5px 12px',
                borderRight: idx < arr.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                flexShrink:0,
              }}>
                <div style={{ textAlign:'center' }}>
                  <div className="hero-stat-number" style={{ 
                    fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.5rem', letterSpacing:'0.04em', lineHeight:1, 
                    background:'linear-gradient(135deg, #fff 0%, #FFD700 30%, #FFA500 60%, #FFD700 100%)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                    filter:'drop-shadow(0 0 15px rgba(255,215,100,0.4)) brightness(1.2)',
                    fontWeight: 900
                  }}>
                    <CountUp target={s.v} suffix={s.suffix} duration={1000} />
                  </div>
                  <div className="hero-stat-label" style={{ fontFamily:"'Inter',sans-serif", fontSize:'14px', letterSpacing:'0.12em', textTransform:'uppercase', color:'#FFD700', fontWeight:700, marginTop:'4px', whiteSpace:'nowrap', textShadow:'0 0 10px rgba(255,215,0,0.4)', opacity: 0.9 }}>{s.l}</div>
                </div>
              </div>
            ))}
          </div>

        </div>


      </div>

      <style>{`
        @keyframes trackSpin    { to { transform:rotate(360deg); } }
        @keyframes trackFadeIn  { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scrollMarquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes introSlide   { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
        @keyframes trackScanBar { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }
        @keyframes trackPulseRing { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(1.6);opacity:0} }

        .sleek-input, .sleek-select {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 4px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          padding: 4px 8px;
          outline: none;
          transition: all 0.2s ease;
        }
        .sleek-input:focus, .sleek-select:focus {
          background: rgba(255,255,255,0.08);
          border-color: var(--gold-muted);
        }
        .sleek-select option { background: #0a0a0e; color: #fff; }

        .premium-card-shine:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 215, 120, 0.25) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 20px rgba(200,168,78,0.08) !important;
        }
        .card-shine-anim {
          position: absolute;
          top: 0; left: -150%;
          width: 100%; height: 100%;
          background: linear-gradient(
            120deg,
            transparent,
            rgba(255, 255, 255, 0.03) 30%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.03) 70%,
            transparent
          );
          transform: skewX(-25deg);
          animation: card-shine 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          pointer-events: none;
        }
        @keyframes card-shine {
          0% { left: -150%; }
          20% { left: 150%; }
          100% { left: 150%; }
        }

        /* ── Globe video: contain (full frame) on portrait/mobile ── */
        @media (max-width: 767px) and (orientation: portrait) {
          .hero-globe-video { object-fit: contain !important; background: #050508; }
        }

        /* ════════════════════════════════════════════════════
           MOBILE HERO — complete responsive layout
        ════════════════════════════════════════════════════ */
        @media (max-width: 767px) {

          /* Overlay: stack from top, clear nav */
          .hero-content-overlay {
            justify-content: flex-start !important;
            align-items: center !important;
            text-align: center !important;
            padding-top: 72px !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-bottom: 1rem !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
          }

          /* Hide desktop bottom-bar — cards now inline below CTA */
          .hero-bottom-bar { display: none !important; }

          /* Show inline mobile card container */
          .hero-mobile-cards {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            gap: 0 !important;
            margin-top: 10px !important;
          }

          /* "OR" divider between Quote CTA and Track card */
          .hero-mobile-divider {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
            width: 100% !important;
            margin: 14px 0 !important;
          }
          .hero-mobile-divider-line {
            flex: 1;
            height: 1px;
            background: rgba(200,168,78,0.25);
          }
          .hero-mobile-divider-text {
            font-family: 'DM Sans', sans-serif;
            font-size: clamp(7px, 1.8vw, 9px);
            font-weight: 700;
            letter-spacing: 0.24em;
            color: rgba(200,168,78,0.65);
            text-transform: uppercase;
            flex-shrink: 0;
          }

          /* Section labels (Track / By the Numbers) */
          .hero-mobile-section-label {
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
            font-family: 'DM Sans', sans-serif !important;
            font-size: clamp(7px, 2vw, 9px) !important;
            font-weight: 700 !important;
            letter-spacing: 0.18em !important;
            text-transform: uppercase !important;
            color: rgba(200,168,78,0.8) !important;
            margin-bottom: 6px !important;
          }
          .hero-mobile-section-label svg {
            width: 9px !important;
            height: 9px !important;
          }

          /* Track section wrapper */
          .hero-mobile-track-section { width: 100%; }
          .hero-mobile-track { width: 100%; }
          .sleek-card {
            flex-direction: column !important;
            padding: 0.65rem 0.8rem !important;
            text-align: left !important;
            border-radius: 0.6rem !important;
            background: rgba(10,14,28,0.82) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05) !important;
          }
          /* "WHERE IS YOUR SHIPMENT?" heading — smaller on mobile */
          .sleek-card p {
            font-size: 1rem !important;
          }
          .hero-mobile-section-label svg {
            width: 9px !important;
            height: 9px !important;
          }
          .sleek-card > div { gap: 8px !important; }
          /* Input: high-contrast, clearly visible */
          .sleek-card input {
            font-size: 16px !important;
            padding: 0.65rem 0.9rem !important;
            background: rgba(255,255,255,0.10) !important;
            border: 1.5px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 7px !important;
            color: #ffffff !important;
          }
          .sleek-card input::placeholder {
            color: rgba(200,210,230,0.55) !important;
          }
          /* Track button — tighter on mobile */
          .sleek-card button {
            padding: 10px 16px !important;
            font-size: clamp(10px, 2.8vw, 12px) !important;
          }

          /* Stats row — spacious, below a label */
          .hero-mobile-stats {
            display: flex !important;
            flex-direction: row !important;
            width: 100% !important;
            background: linear-gradient(135deg,rgba(180,190,210,0.08) 0%,rgba(120,130,160,0.05) 100%) !important;
            border: 1px solid rgba(200,210,230,0.18) !important;
            border-radius: 0.75rem !important;
            backdrop-filter: blur(20px) !important;
            -webkit-backdrop-filter: blur(20px) !important;
            overflow: hidden !important;
            margin-top: 14px !important;
          }

          /* Hero text */
          .hero-eyebrow { font-size: 9px !important; letter-spacing: 0.16em !important; padding: 4px 10px !important; margin-bottom: 8px !important; }
          .hero-intro-sub { display: none !important; }
          .hero-chapter-sub { display: none !important; }
          .hero-intro-cta {
            width: auto !important;
            max-width: 100% !important;
            justify-content: center !important;
            padding: clamp(10px,2.5vw,14px) clamp(18px,5vw,26px) !important;
            font-size: clamp(10px,2.8vw,13px) !important;
            margin-top: 10px !important;
            align-self: center !important;
            box-sizing: border-box !important;
          }
        }

        @media (max-width: 479px) {
          .hero-content-overlay { padding-top: 64px !important; }
        }
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
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'3px', background:'transparent', zIndex:10 }}>
      <div ref={barRef} style={{
        height:'100%', width:'0%',
        background:'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%)',
        transition:'width 0.08s linear',
        boxShadow:'0 0 8px rgba(255,255,255,0.08)',
      }} />
    </div>
  )
}
