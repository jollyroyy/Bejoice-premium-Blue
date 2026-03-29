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
const SCROLL_HEIGHT = 1800

// ── JPEG frame sequences ──────────────────────────────────────────
const FRAMES2_COUNT = 289
const FRAMES3_COUNT = 169
const FRAMES4_COUNT = 32
const FRAMES5_COUNT = 121
const FRAMES6_COUNT = 121
const TOTAL_FRAMES  = FRAMES2_COUNT + FRAMES3_COUNT + FRAMES4_COUNT + FRAMES5_COUNT + FRAMES6_COUNT  // 732

const FRAME_URLS = [
  ...Array.from({ length: FRAMES2_COUNT }, (_, i) =>
    `/frames2/${String(i + 1).padStart(4, '0')}.jpg`),
  ...Array.from({ length: FRAMES3_COUNT }, (_, i) =>
    `/frames3/${String(i + 1).padStart(4, '0')}.jpg`),
  ...Array.from({ length: FRAMES4_COUNT }, (_, i) =>
    `/frames4/${String(i + 1).padStart(4, '0')}.jpg`),
  ...Array.from({ length: FRAMES5_COUNT }, (_, i) =>
    `/frames5/${String(i + 1).padStart(4, '0')}.png`),
  ...Array.from({ length: FRAMES6_COUNT }, (_, i) =>
    `/frames6/${String(i + 1).padStart(4, '0')}.jpg`),
]

// Headings shown during the 4-second globe lock — alternate sides
const INTRO_SLIDES = [
  { headline: ['SMART FREIGHT', 'POWERED BY AI'], eyebrow: "Connecting KSA with the World", align: 'left', sub: ['Award-winning freight forwarder delivering seamless end-to-end logistics solutions', 'with reliability, efficiency, and the strength of a powerful global network.'] },
]

// Fade window in frames — how many frames to crossfade between chapters
const FRAME_FADE = 18

// Chapters hardcoded to exact frame index boundaries.
// frames2: 0–288 | frames3: 289–457 | frames4: 458–489 | frames5: 490–610 | frames6: 611–731
const CHAPTERS = [
  {
    frameRange: [-20, -1],
    headline:   ['ENGINEERED FOR', 'ALL ROADS'],
    sub:        'Integrated trucking networks providing seamless last-mile excellence across the Arabian Peninsula.',
    align:      'left',
  },
  {
    frameRange: [1, 59],
    headline:   ['HEAVY LIFT / ODC', '/ OOG TRANSPORTATION'],
    sub:        'Hydraulic axle transport for oversized and heavy equipment — wind turbines, transformers, industrial machinery, and large project cargo.',
    align:      'right',
  },
  {
    frameRange: [67, 125],
    headline:   ['ROUTE MODIFICATION', 'FOR ODC TRANSPORTATION'],
    sub:        'We remove, adjust, or bypass every obstacle — signals, cables, guardrails — so your cargo moves uninterrupted.',
    align:      'right',
  },
  {
    frameRange: [133, 191],
    headline:   ['LAND', 'CORRIDORS'],
    sub:        'Seamless cross-border land transport across the GCC, powered by a state-of-the-art fleet.',
    align:      'left',
  },
  {
    frameRange: [199, 257],
    headline:   ['SAUDI ROOTS.', 'GLOBAL PRECISION.'],
    sub:        'Experience the next evolution of Saudi logistics.',
    align:      'right',
  },
  {
    frameRange: [247, 305],
    headline:   ['OCEAN', 'FREIGHT'],
    sub:        'Global maritime networks connecting the Port of Jeddah to every major international hub.',
    align:      'left',
  },
  {
    frameRange: [331, 389],
    headline:   ['ZERO DELAYS.', 'ZERO COMPLIANCE SURPRISES.'],
    sub:        'We handle the paperwork. You handle the business.',
    align:      'right',
  },
  {
    frameRange: [397, 455],
    headline:   ['CUSTOM CLEARANCE', '& BROKERAGING'],
    sub:        'Full documentation and customs handling to keep your cargo moving and your timeline intact.',
    align:      'right',
  },
  {
    frameRange: [463, 521],
    headline:   ['PACKED SAFE,', 'DELIVERED RIGHT'],
    sub:        'End-to-end cargo consolidation and handling — your freight secured from warehouse to aircraft.',
    align:      'left',
  },
  {
    frameRange: [529, 623],
    headline:   ['AEROSPACE', 'LOGISTICS'],
    sub:        "Time-critical delivery solutions via the Kingdom's primary aviation corridors.",
    align:      'right',
    vAlign:     'top',
  },
  {
    frameRange: [631, 689],
    headline:   ['ONSITE JACKING', '& SKIDDING'],
    sub:        "Precision Placement Where Cranes Can't Go. Millimeter-accurate. No room for error — and we never make one.",
    align:      'right',
  },
  {
    frameRange: [661, 719],
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

function FreightCalcCard() {
  const scroll = () => {
    const el = document.getElementById('container-calculator') || document.getElementById('logistics-tools')
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' })
  }
  return (
    <div className="track-card-inner" style={{
      width:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(145deg, rgba(200,168,78,0.07) 0%, rgba(10,8,20,0.6) 50%, rgba(255,255,255,0.015) 100%)',
      backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
      border:'1px solid rgba(200,168,78,0.28)',
      borderTop:'1px solid rgba(200,168,78,0.55)',
      borderRadius:'14px',
      padding:'1rem 1.1rem 0.9rem',
      boxShadow:'0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,215,100,0.1), 0 0 24px rgba(200,168,78,0.06)',
      display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
    }}>
      {/* Animated gold top line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(255,215,100,1),transparent)', pointerEvents:'none', animation:'calcSweep 3s ease-in-out infinite' }}/>
      {/* Bottom-left corner glow */}
      <div style={{ position:'absolute', bottom:0, left:0, width:70, height:70, background:'radial-gradient(circle at 0% 100%, rgba(200,168,78,0.14) 0%, transparent 70%)', pointerEvents:'none' }}/>

      {/* Header row: title + live dot */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.65rem' }}>
        <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.25rem', color:'#ffe680', letterSpacing:'0.1em', lineHeight:1, margin:0, textTransform:'uppercase', textShadow:'0 0 18px rgba(255,215,100,0.45)', textAlign:'center' }}>
          Freight Calculator
        </p>
      </div>

      <button onClick={scroll} className="btn-gold btn-gold--static" style={{
        width:'100%', justifyContent:'center', padding:'7px 14px', fontSize:'0.84rem',
        letterSpacing:'0.12em',
      }}>
        <div className="btn-shine-overlay" />
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span style={{ whiteSpace:'nowrap' }}>Calculate Now</span>
      </button>

      <style>{`
        @keyframes calcPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }
        @keyframes calcSweep { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>
    </div>
  )
}

function TrackCard() {
  return (
    <div className="track-card-inner" style={{
      width:'100%', position:'relative', overflow:'hidden',
      background:'linear-gradient(160deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 60%, rgba(200,168,78,0.02) 100%)',
      backdropFilter:'blur(32px)', WebkitBackdropFilter:'blur(32px)',
      border:'1px solid rgba(200,168,78,0.2)',
      borderTop:'1px solid rgba(200,168,78,0.45)',
      borderRadius:'14px',
      padding:'1rem 1.1rem 0.9rem',
      boxShadow:'0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)',
      display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
    }}>
      {/* Gold top shimmer */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(200,168,78,0.8),transparent)', pointerEvents:'none' }}/>
      {/* Corner glow */}
      <div style={{ position:'absolute', top:0, right:0, width:60, height:60, background:'radial-gradient(circle at 100% 0%, rgba(200,168,78,0.12) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <p style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.25rem', color:'#ffffff', letterSpacing:'0.1em', lineHeight:1, margin:'0 0 0.18rem', textTransform:'uppercase', textShadow:'0 0 20px rgba(255,255,255,0.2)', textAlign:'center' }}>
        Track Shipment
      </p>
      <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.6rem', color:'rgba(200,168,78,0.8)', margin:'0 0 0.75rem', letterSpacing:'0.15em', textTransform:'uppercase', fontWeight:600, textAlign:'center' }}>
        BL · AWB · Container
      </p>

      <button
        onClick={() => window.open('https://www.track-trace.com/', '_blank', 'noopener,noreferrer')}
        className="btn-gold"
        style={{ width:'auto', justifyContent:'center', padding:'7px 20px', fontSize:'0.88rem' }}
      >
        <div className="btn-shine-overlay" />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        Track Now
      </button>
    </div>
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

  // ── Chapter opacity driven by exact frame index (hardcoded to footage) ──
  const applyProgress = useCallback((frameIdx) => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      const el = chaptersRef.current[i]
      if (!el) continue

      const [start, end] = CHAPTERS[i].frameRange
      const isLast = i === CHAPTERS.length - 1
      let opacity = 0

      if (frameIdx < 0) {
        opacity = 0  // globe phase — keep all hidden
      } else if (isLast) {
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

  // Phase 1 — eager: load first 80 frames (covers globe→canvas crossfade)
  useEffect(() => {
    framesRef.current = new Array(TOTAL_FRAMES)
    loadFrameRange(0, 79)
    // Phase 2 — idle background: load all remaining frames when browser is free
    const scheduleIdle = (start) => {
      if (start >= TOTAL_FRAMES) return
      const handle = requestIdleCallback
        ? requestIdleCallback(() => { loadFrameRange(start, start + 49); scheduleIdle(start + 50) }, { timeout: 2000 })
        : setTimeout(() => { loadFrameRange(start, start + 49); scheduleIdle(start + 50) }, 200)
      return handle
    }
    scheduleIdle(80)
  }, [loadFrameRange])

  // Phase 3 — scroll-ahead: called from RAF loop to stay 80 frames ahead
  const loadAhead = useCallback((frameIdx) => {
    const target = Math.min(frameIdx + 80, TOTAL_FRAMES - 1)
    if (target > loadedUpToRef.current) {
      loadFrameRange(loadedUpToRef.current + 1, target)
    }
  }, [loadFrameRange])

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
    // Initialise all chapter overlays as hidden — RAF takes over on scroll
    for (let i = 0; i < CHAPTERS.length; i++) {
      const el = chaptersRef.current[i]
      if (el) { el.style.opacity = '0'; el.style.transform = 'translateY(28px)' }
    }
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
        introContainerRef.current.style.opacity = String(Math.max(0, 1 - gp * 1.5))
      }

      // ── Globe: pure crossfade dissolve — no movement, no slide ──
      const globe = globeVideoRef.current
      if (globe) {
        globe.style.transform = 'none'
        // Ease-in-out curve: slow start, accelerates mid, slow finish
        const eased = gp < 0.5 ? 2 * gp * gp : 1 - Math.pow(-2 * gp + 2, 2) / 2
        globe.style.opacity = String(Math.max(0, 1 - eased))
      }

      // ── Canvas: mirror dissolve — fades in as globe fades out ──
      const canvas = canvasRef.current
      if (canvas) {
        const eased = gp < 0.5 ? 2 * gp * gp : 1 - Math.pow(-2 * gp + 2, 2) / 2
        canvas.style.opacity = String(Math.min(1, eased))
      }

      // ── Frame scrub after globe zone — starts at frame 39 ──
      const BASE_FRAME = 39
      const videoP   = p <= GLOBE_EXIT ? 0 : (p - GLOBE_EXIT) / (1 - GLOBE_EXIT)
      const frameIdx = Math.min(BASE_FRAME + Math.round(videoP * (TOTAL_FRAMES - 1 - BASE_FRAME)), TOTAL_FRAMES - 1)
      loadAhead(frameIdx)
      paintFrame(frameIdx)

      // Chapter headings driven by exact frame index — perfect sync
      applyProgress(p <= GLOBE_EXIT ? -1 : frameIdx)

      // ── Show "Engineered" during globe→frames transition (same fade as canvas) ──
      if (p <= GLOBE_EXIT) {
        const el = chaptersRef.current[0]
        if (el) {
          const eOp = Math.min(Math.max(0, (gp - 0.65) / 0.35), 1)
          el.style.opacity   = String(eOp)
          el.style.transform = `translateY(${(1 - eOp) * 28}px)`
        }
      }

      // ── Cards fade in sync with intro heading (gp) + cargo fade ──
      if (heroCardsRef.current) {
        // Fade out in sync with intro text using same gp multiplier (1.5)
        const gpOp = Math.max(0, 1 - gp * 1.5)

        // Also fade during heavy cargo footage
        const CARGO_FADE_START = 470
        const CARGO_FADE_END   = 490
        const cargoOp = frameIdx < CARGO_FADE_START ? 1
          : frameIdx > CARGO_FADE_END ? 0
          : 1 - (frameIdx - CARGO_FADE_START) / (CARGO_FADE_END - CARGO_FADE_START)

        const finalOp = gpOp * cargoOp
        heroCardsRef.current.style.opacity       = String(finalOp)
        heroCardsRef.current.style.transform     = 'none'
        heroCardsRef.current.style.pointerEvents = finalOp < 0.1 ? 'none' : 'all'
      }

      // ── Exit fade — only after ALL frames shown (last 3% of scroll) ──
      if (exitOverlayRef.current) {
        exitOverlayRef.current.style.opacity = String(
          Math.max(0, Math.min(1, (videoP - 0.97) / 0.03))
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
  }, [applyProgress, loadAhead])

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
          opacity:0,
          willChange:'opacity',
        }} />

        {/* ── GLOBE VIDEO — sits on top of canvas, slides away on scroll ── */}
        <video
          ref={globeVideoRef}
          src={GLOBE_SRC}
          autoPlay
          muted
          playsInline
          className="hero-globe-video"
          style={{
            position:'absolute', inset:0, zIndex:2,
            width:'100%', height:'100%',
            objectFit:'cover', objectPosition:'center center',
            opacity:1, transformOrigin:'center center',
            willChange:'transform,opacity',
          }}
        />

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
              className="hero-content-overlay"
              style={{
                position:'absolute', inset:0, zIndex:5,
                display:'flex', flexDirection:'column', justifyContent:'center',
                alignItems:  isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                textAlign:   isCenter ? 'center'  : isRight ? 'right'   : 'left',
                padding:'clamp(1.2rem,5vw,6rem)',
                paddingBottom:'clamp(160px,28vh,320px)',
                pointerEvents:'none',
              }}>
              <div className="hero-eyebrow" style={{
                fontFamily:"'DM Sans',sans-serif",
                fontSize:'clamp(11px,1.1vw,14px)', letterSpacing:'0.32em',
                textTransform:'uppercase', fontWeight:600,
                color:'#ffffff',
                textShadow:'0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(200,168,78,0.6), 0 1px 14px rgba(0,0,0,1)',
                background:'rgba(0,0,0,0.55)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
                padding:'7px 18px', borderRadius:'3px',
                marginBottom:'22px',
                display:'inline-block',
                border:'1px solid rgba(255,255,255,0.25)',
              }}>
                <span className="shine-ltr" data-text={slide.eyebrow}>{slide.eyebrow}</span>
              </div>
              <div style={{ cursor:'default' }}>
                {slide.headline.map((line, li) => (
                  <h1 key={li} style={{
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:'clamp(2rem,5.5vw,5.5rem)',
                    lineHeight:0.87, letterSpacing:'0.06em', margin:0,
                    color: li % 2 === 0 ? '#ffffff' : 'rgba(255,215,105,1)',
                    textShadow: li % 2 === 0
                      ? '0 0 40px rgba(255,255,255,0.55), 0 2px 48px rgba(0,0,0,0.98), 0 0 120px rgba(0,0,0,0.7)'
                      : '0 0 32px rgba(255,200,80,0.5), 0 2px 48px rgba(0,0,0,0.98)',
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
              {/* Quick Quote CTA */}
              <button
                className="hero-intro-cta"
                onClick={() => { if (onQuoteClick) onQuoteClick() }}
                style={{
                  pointerEvents:'auto',
                  marginTop:'32px',
                  display:'inline-flex', alignItems:'center', gap:'10px',
                  padding: 'clamp(11px,1.2vw,14px) clamp(18px,2vw,26px)',
                  background:'linear-gradient(135deg, #ffe080 0%, #e8c85a 35%, #c8a84e 70%, #a8882e 100%)',
                  color:'#000000',
                  textShadow:'0 1px 0 rgba(255,255,255,0.3)',
                  fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1rem,1.3vw,1.25rem)',
                  letterSpacing:'0.2em', textTransform:'uppercase',
                  border:'1px solid rgba(255,230,120,0.4)',
                  borderBottom:'1px solid rgba(120,90,20,0.5)',
                  borderRadius:'10px', cursor:'pointer',
                  position:'relative', overflow:'hidden',
                  boxShadow:'0 6px 30px rgba(200,168,78,0.4), 0 2px 0 rgba(255,230,120,0.3) inset, 0 -2px 0 rgba(100,70,10,0.4) inset',
                  transition:'all 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                  alignSelf: isCenter ? 'center' : undefined,
                }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 10px 48px rgba(200,168,78,0.55), 0 2px 0 rgba(255,240,150,0.4) inset, 0 -2px 0 rgba(100,70,10,0.4) inset'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background='linear-gradient(135deg,#fff4a0 0%,#f5d970 35%,#daa83e 70%,#b88828 100%)' }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow='0 6px 30px rgba(200,168,78,0.4), 0 2px 0 rgba(255,230,120,0.3) inset, 0 -2px 0 rgba(100,70,10,0.4) inset'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='linear-gradient(135deg,#ffe080 0%,#e8c85a 35%,#c8a84e 70%,#a8882e 100%)' }}
                onMouseDown={e=>{ e.currentTarget.style.transform='translateY(1px) scale(0.98)' }}
                onMouseUp={e=>{ e.currentTarget.style.transform='translateY(-2px)' }}
              >
                <div className="btn-shine-overlay" />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                START SHIPMENT
              </button>

              {/* ── MOBILE ONLY: Track card + Stats inline below CTA ── */}
              <div className="hero-mobile-cards" style={{ pointerEvents:'auto', display:'none' }}>

                {/* ── "OR" divider — visually separates Quote CTA from Track card ── */}
                <div className="hero-mobile-divider">
                  <div className="hero-mobile-divider-line" />
                  <span className="hero-mobile-divider-text">OR</span>
                  <div className="hero-mobile-divider-line" />
                </div>

                {/* ── Track card with section label ── */}
                <div className="hero-mobile-track-section">
                  <p className="hero-mobile-section-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    Track Your Shipment
                  </p>
                  <div className="hero-mobile-track" style={{ display:'flex', gap:10 }}>
                    <div style={{ flex:1 }}><TrackCard /></div>
                    <div style={{ flex:1 }}><FreightCalcCard /></div>
                  </div>
                </div>
                {/* Stats row with label */}
                <p className="hero-mobile-section-label" style={{ marginTop:'4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20V10M18 20V4M6 20v-4"/></svg>
                  By the Numbers
                </p>
                <div className="hero-mobile-stats">
                  {[
                    { v:'120',  suffix:'+', l:'Countries'  },
                    { v:'25',   suffix:'+', l:'Years'      },
                    { v:'24/7', suffix:'',  l:'Operations' },
                    { v:'KSA',  suffix:'',  l:'Specialist' },
                  ].map((s, idx, arr) => (
                    <div key={s.l} style={{
                      display:'flex', flexDirection:'column', alignItems:'center',
                      flex:'1 1 0', padding:'6px 4px',
                      borderRight: idx < arr.length-1 ? '1px solid rgba(200,210,230,0.1)' : 'none',
                    }}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.5rem', letterSpacing:'0.04em', lineHeight:1, color:'#ffffff', textShadow:'0 0 16px rgba(255,255,255,0.5)' }}>
                        <CountUp target={s.v} suffix={s.suffix} duration={800} />
                      </div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'8px', letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(210,220,240,0.85)', fontWeight:600, marginTop:'3px', whiteSpace:'nowrap' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}

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

              {/* Headline */}
              <div style={{ pointerEvents:'all', cursor:'default' }}>
                {ch.headline.map((line, li) => (
                  <h1 key={li} style={{
                    fontFamily:"'Bebas Neue',sans-serif",
                    fontSize:'clamp(2rem,5.5vw,5.5rem)',
                    lineHeight:0.87, letterSpacing:'0.06em', margin:0,
                    color: li % 2 === 0 ? '#ffffff' : 'rgba(255,215,105,1)',
                    textShadow: li % 2 === 0
                      ? '0 0 40px rgba(255,255,255,0.55), 0 2px 48px rgba(0,0,0,0.98), 0 0 120px rgba(0,0,0,0.7)'
                      : '0 0 32px rgba(255,200,80,0.5), 0 2px 48px rgba(0,0,0,0.98)',
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
        <div ref={heroCardsRef} className="hero-bottom-bar" style={{
          position:'absolute', bottom:'clamp(80px,12vh,160px)', left:0, right:0, zIndex:5,
          display:'flex', flexWrap:'wrap', gap:'clamp(40px,6vw,80px)',
          alignItems:'stretch', justifyContent:'flex-end',
          padding:'0 clamp(8rem,20vw,32rem) 0 clamp(0.8rem,4vw,5rem)', pointerEvents:'all',
        }}>
          <div style={{ display:'flex', gap:'clamp(8px,1.5vw,14px)', flex:'0 1 auto', minWidth:0 }}>
            <div className="hero-track-wrap" style={{ flex:'0 1 230px', minWidth:0, maxWidth:'240px', display:'flex' }}>
              <TrackCard />
            </div>
            <div className="hero-track-wrap" style={{ flex:'0 1 230px', minWidth:0, maxWidth:'240px', display:'flex' }}>
              <FreightCalcCard />
            </div>
          </div>

          <div className="hero-stats-bar" style={{
            flex:'0 0 auto', display:'flex', flexDirection:'row', flexWrap:'nowrap', alignItems:'center',
            background:'linear-gradient(135deg,rgba(180,190,210,0.08) 0%,rgba(120,130,160,0.05) 100%)',
            border:'1px solid rgba(200,210,230,0.18)', borderRadius:'0.9rem',
            backdropFilter:'blur(24px)', WebkitBackdropFilter:'blur(24px)',
            boxShadow:'0 4px 24px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.08)',
            overflow:'hidden', overflowX:'auto',
            maxWidth:'100%',
          }}>
            {[
              { v:'120',  suffix:'+', l:'Countries'  },
              { v:'25',   suffix:'+', l:'Years'      },
              { v:'24/7', suffix:'',  l:'Operations' },
              { v:'KSA',  suffix:'',  l:'Specialist' },
            ].map((s, idx, arr) => (
              <div key={s.l} className="hero-stat-cell" style={{
                display:'flex', alignItems:'center', padding:'6px 10px',
                borderRight: idx < arr.length-1 ? '1px solid rgba(200,210,230,0.1)' : 'none',
                flexShrink:0,
              }}>
                <div style={{ textAlign:'center' }}>
                  <div className="hero-stat-number" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'2.6rem', letterSpacing:'0.05em', lineHeight:1, color:'#ffffff', textShadow:'0 0 20px rgba(255,255,255,0.6),0 0 40px rgba(200,220,255,0.3),0 1px 6px rgba(0,0,0,0.8)' }}>
                    <CountUp target={s.v} suffix={s.suffix} duration={800} />
                  </div>
                  <div className="hero-stat-label" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'13px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(210,220,240,0.9)', fontWeight:600, marginTop:'4px', whiteSpace:'nowrap' }}>{s.l}</div>
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
          .track-card-inner {
            flex-direction: column !important;
            padding: 0.75rem 0.8rem !important;
            text-align: left !important;
            border-radius: 0.75rem !important;
            background: rgba(10,14,28,0.82) !important;
            border: 1px solid rgba(200,168,78,0.35) !important;
            box-shadow: 0 2px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,168,78,0.08) !important;
          }
          /* "WHERE IS YOUR SHIPMENT?" heading — smaller on mobile */
          .track-card-inner > p:first-child {
            font-size: clamp(0.95rem, 4vw, 1.2rem) !important;
            margin-bottom: 0.2rem !important;
          }
          .track-card-inner > p:nth-child(2) { display: none !important; } /* hide sub-label */
          .track-card-inner > div { gap: 8px !important; }
          /* Input: high-contrast, clearly visible */
          .track-card-inner input {
            font-size: 16px !important;
            padding: 0.65rem 0.9rem !important;
            background: rgba(255,255,255,0.10) !important;
            border: 1.5px solid rgba(200,168,78,0.5) !important;
            border-radius: 7px !important;
            color: #ffffff !important;
          }
          .track-card-inner input::placeholder {
            color: rgba(200,210,230,0.55) !important;
          }
          /* Track button — tighter on mobile */
          .track-card-inner button {
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
