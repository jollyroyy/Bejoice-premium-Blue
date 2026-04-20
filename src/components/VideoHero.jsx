import { useEffect, useRef, useCallback, useState, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../context/LangContext'
import ar from '../i18n/ar'
const BejoiceGlobe = lazy(() => import('./BejoiceGlobe'))

// Convert Western digits to Arabic-Indic numerals
function toArabicNum(str) {
  return String(str).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d])
}

// ─────────────────────────────────────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────────────────────────────────────
function CountUp({ target, suffix = '', duration = 900, arabic = false }) {
  const isNumeric = /^\d+(\.\d+)?$/.test(String(target).trim())
  const [display, setDisplay] = useState(isNumeric ? '0' : target)

  useEffect(() => {
    if (!isNumeric) {
      setDisplay(target)
      return
    }
    const end = parseFloat(target)
    setDisplay(arabic ? toArabicNum(0) : '0')
    const t0 = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min((now - t0) / duration, 1)
      const val = Math.round((1 - Math.pow(1 - t, 3)) * end)
      setDisplay((arabic ? toArabicNum(val) : val) + suffix)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setDisplay((arabic ? toArabicNum(end) : end) + suffix)
    }
    const timer = setTimeout(() => { raf = requestAnimationFrame(tick) }, 600)
    return () => { clearTimeout(timer); cancelAnimationFrame(raf) }
  }, [target, suffix, duration, isNumeric, arabic])

  return <span>{display}</span>
}

// ─────────────────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────────────────
const SCROLL_HEIGHT = 2000

// ── Frame sequences ───────────────────────────────────────────────────
// bic:           0–144   (145) BIC zoomout WebPs — hero (local /bic/, 0001.webp–0145.webp)
// globe-bridge:  145–210 (66)  last bic frame repeated — canvas fully dimmed during globe widget
// bejoice_truck: 211–355 (145) Truck/road footage WebPs
// port:          356–524 (169) Port/sea footage WebPs
// frames8:       525–645 (121) additional footage WebPs
// tech_enng:     646–790 (145) tech/engineering footage WebPs
// saudi:         791–983 (193) Saudi Arabia footage WebPs — end
// TOTAL: 984
const FRAMES_BIC_COUNT   = 145  // frames 0001–0145 (145 images, WebP)
const GLOBE_BRIDGE_COUNT = 66   // frames 145–210 — hidden behind globe widget
const FRAMES_TRUCK_COUNT = 145
const FRAMES_PORT_COUNT  = 169
const FRAMES8_COUNT      = 121
const FRAMES_TECH_COUNT  = 145
const FRAMES_SAUDI_COUNT = 193
const TOTAL_FRAMES       = FRAMES_BIC_COUNT + GLOBE_BRIDGE_COUNT + FRAMES_TRUCK_COUNT + FRAMES_PORT_COUNT + FRAMES8_COUNT + FRAMES_TECH_COUNT + FRAMES_SAUDI_COUNT  // 984

// ─── CDN BASE ────────────────────────────────────────────────────────────────
// Primary: CloudFront edge (~5–20ms RTT for KSA/UAE users).
// Fallback: S3 direct — used automatically if any CloudFront request fails.
const CDN = 'https://d22ga4j7bn728b.cloudfront.net'
const S3  = 'https://bejoice-premium.s3.me-central-1.amazonaws.com'
const FRAME_URLS = [
  // bic zoomout sequence (idx 0–144) — CDN, 0001.webp–0145.webp
  ...Array.from({ length: FRAMES_BIC_COUNT }, (_, i) =>
    `${CDN}/bic/${String(i + 1).padStart(4, '0')}.webp`),
  // globe bridge (idx 145–210) — repeats last bic frame; invisible behind globe dim
  ...Array.from({ length: GLOBE_BRIDGE_COUNT }, () => `${CDN}/bic/0145.webp`),
  // bejoice_truck seg (idx 486–630)
  ...Array.from({ length: FRAMES_TRUCK_COUNT }, (_, i) =>
    `${CDN}/bejoice_truck/${String(i + 1).padStart(4, '0')}.webp`),
  // port seg (idx 631–799)
  ...Array.from({ length: FRAMES_PORT_COUNT }, (_, i) =>
    `${CDN}/port/${String(i + 1).padStart(4, '0')}.webp`),
  // frames8 seg (idx 800–920)
  ...Array.from({ length: FRAMES8_COUNT }, (_, i) =>
    `${CDN}/frames8/${String(i + 1).padStart(4, '0')}.webp`),
  // tech_enng seg (idx 921–1065)
  ...Array.from({ length: FRAMES_TECH_COUNT }, (_, i) =>
    `${CDN}/tech_enng/${String(i + 1).padStart(4, '0')}.webp`),
  // saudi seg (idx 1066–1258) — end
  ...Array.from({ length: FRAMES_SAUDI_COUNT }, (_, i) =>
    `${CDN}/saudi/${String(i + 1).padStart(4, '0')}.webp`),
]
// S3 fallback URLs — bic frames are local, keep as-is; CDN frames get S3 fallback
const FRAME_URLS_S3 = FRAME_URLS.map(u => u.startsWith('/bic/') ? u : u.replace(CDN, S3))

// Fade window in frames — how many frames to crossfade between chapters
const FRAME_FADE = 18

// Chapters mapped to segments.
// bic:0–144 | globe-bridge:145–210 | bejoice_truck:211–355 | port:356–524 | frames8:525–645 | tech_enng:646–790 | saudi:791–983
const GLOBE_CHAPTER_START = 145
const GLOBE_CHAPTER_END   = 210

const CHAPTERS = [
  // ── bic: 0–144 — hero ──
  {
    frameRange: [0, 144],
    eyebrow:    'CONNECTING KSA TO THE WORLD',
    headline:   ['SMART FREIGHT', 'POWERED BY AI'],
    sub:        'Award-winning freight forwarder delivering seamless end-to-end logistics with reliability and global reach.',
    align:      'left',
    showCTA:    true,
  },
  // ── GLOBE CHAPTER: 228–293 ── (full-screen 3D globe, canvas hidden, no text overlay)
  {
    frameRange:   [GLOBE_CHAPTER_START, GLOBE_CHAPTER_END],
    headline:     [],
    align:        'center',
    globeChapter: true,
  },
  // ── bejoice_truck: 294–438 ──
  {
    frameRange: [303, 353],
    eyebrow:    '',
    headline:   ['FROM BLUE PRINT TO DELIVERY,', 'WE MOVE IT ALL'],
    sub:        'Seamless cross-border land transport across the GCC — powered by a modern fleet connecting Saudi Arabia to every regional hub.',
    align:      'right',
  },
  {
    frameRange: [361, 431],
    eyebrow:    'OCEAN FREIGHT',
    headline:   ['NAVIGATING OCEANS.', 'DELIVERING CONFIDENCE'],
    sub:        'Global maritime networks connecting the Port of Jeddah to every major international hub with precision and reliability.',
    align:      'left',
  },
  // ── port: 439–607 ──
  {
    frameRange: [446, 502],
    eyebrow:    'CUSTOMS CLEARANCE · PORT OPERATIONS',
    headline:   ['DRIVEN BY TRANSPARENCY.', 'DELIVERED WITH TRUST'],
    sub:        'ZATCA-certified experts navigating complex regulatory landscapes to ensure rapid, compliant clearance for every shipment.',
    align:      'right',
  },
  {
    frameRange: [510, 596],
    eyebrow:    'FCL & LCL',
    headline:   ['FROM PORT TO PORT.', 'WORLD-CLASS LOGISTICS'],
    sub:        'Comprehensive ocean freight solutions — full container loads, consolidated shipments, and breakbulk cargo managed with Saudi expertise.',
    align:      'left',
  },
  // ── frames8: 608–728 ──
  {
    frameRange: [615, 669],
    eyebrow:    'AIR FREIGHT · IATA CERTIFIED',
    headline:   ['SPEED ABOVE ALL.', 'DELIVERED ON TIME'],
    sub:        'Express air cargo solutions connecting Saudi Arabia to global hubs — critical shipments, time-sensitive freight, temperature-controlled cargo.',
    align:      'right',
  },
  {
    frameRange: [670, 721],
    eyebrow:    'AIR FREIGHT · IATA CERTIFIED',
    headline:   ['WORLD CLASS AIR FREIGHT'],
    sub:        '',
    align:      'right',
  },
  // ── tech_enng: 729–873 ──
  {
    frameRange: [736, 800],
    eyebrow:    'HEAVY LIFT · PROJECT CARGO',
    headline:   ['PRECISION IN HANDLING.', 'EXCELLENCE IN DELIVERY'],
    sub:        'End-to-end technical cargo solutions engineered for complexity — heavy machinery, industrial equipment, and high-value freight delivered with zero compromise.',
    align:      'right',
  },
  {
    frameRange: [808, 867],
    eyebrow:    '',
    headline:   ['TECHNICAL', 'ENGINEERING'],
    sub:        'Specialised handling of oversized, overweight and high-value cargo — engineered solutions for every challenge.',
    align:      'center',
    vAlign:     'bottom',
  },
  // ── saudi: 874–1066 — end ──
  {
    frameRange: [880, 1052],
    eyebrow:    'KINGDOM OF SAUDI ARABIA · VISION 2030',
    headline:   ['CONNECTED GLOBALLY'],
    sub:        'Born in Saudi Arabia. Trusted across 180+ countries. Bejoice Group — the Kingdom\'s premier freight forwarder powering Vision 2030 trade ambitions.',
    align:      'center',
    vAlign:     'bottom',
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
        background:'rgba(5,12,24,0.88)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
        animation:'trackFadeIn 0.3s ease',
        padding:'1.5rem',
      }}
    >
      <div style={{
        width:'100%', maxWidth:'480px',
        background:'linear-gradient(135deg,rgba(10,14,26,0.98) 0%,rgba(7,16,28,0.98) 100%)',
        border:'1px solid rgba(200,210,230,0.18)',
        borderRadius:'1.2rem',
        boxShadow:'0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(91,194,231,0.08) inset',
        overflow:'hidden',
        animation:'trackSlideUp 0.35s cubic-bezier(0.23,1,0.32,1)',
      }}>
        {/* Gold top bar */}
        <div style={{ height:'2px', background:'linear-gradient(90deg,transparent,rgba(91,194,231,0.9),transparent)' }} />

        <div style={{ padding:'2rem' }}>
          {/* Header row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.6rem', color:'#fff', letterSpacing:'0.08em', lineHeight:1 }}>
                SHIPMENT TRACKING
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.7rem', color:'rgba(91,194,231,0.7)', letterSpacing:'0.2em', textTransform:'uppercase', marginTop:'4px' }}>
                Powered by Bejoice · WhatsApp Connect
              </div>
            </div>
            <button onClick={onClose} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'50%', width:'32px', height:'32px', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'rgba(255,255,255,0.6)', flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Reference number display */}
          <div style={{ background:'rgba(91,194,231,0.06)', border:'1px solid rgba(91,194,231,0.18)', borderRadius:'8px', padding:'0.9rem 1.2rem', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'10px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.8)" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            <div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.65rem', color:'rgba(91,194,231,0.6)', letterSpacing:'0.18em', textTransform:'uppercase' }}>Reference No.</div>
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
        border:'1px solid rgba(91, 194, 231, 0.12)', 
        borderRadius:'14px',
        padding:'1rem 1.25rem',
        boxShadow:'0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px rgba(91,194,231,0.04)',
        display:'flex', flexDirection:'column',
        transition:'transform 0.15s ease-out, box-shadow 0.4s ease, border-color 0.4s ease',
        ...style
      }}
    >
      <div className="card-glow-overlay" style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, -20%), rgba(91,194,231,0.08), transparent 75%)',
        opacity:0.6
      }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:1.5, background:'linear-gradient(90deg,transparent,rgba(91,194,231,0.35),transparent)', pointerEvents:'none', zIndex:1 }}/>
      <div className="card-shine-anim" />
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

function FreightCalcCard() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const handleOpen = () => {
    const el = document.getElementById('tools')
    if (el) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 })
      else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <SleekCard style={{ justifyContent:'center', padding:'1.25rem 1.75rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'24px' }}>
        <div>
          <p style={{ fontFamily: isAr ? "'Cairo','Noto Sans Arabic',sans-serif" : "'Bebas Neue',sans-serif", fontSize:'1.8rem', color:'#ffffff', letterSpacing: isAr ? '0' : '0.08em', margin:0, lineHeight:1.1, textShadow:'0 0 24px rgba(255,255,255,0.25)' }}>
            {isAr ? ar.hero.calcTitle : 'LOAD CALCULATOR'}
          </p>
        </div>
        <button onClick={handleOpen} className="btn-gold"
          style={{ padding:'12px 28px', fontSize:'1rem', borderRadius:'10px', whiteSpace:'nowrap', flexShrink:0, fontWeight:400 }}>
          {isAr ? ar.hero.calcBtn : 'Open Calculator'}
        </button>
      </div>
    </SleekCard>
  )
}

function TrackCard() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  return (
    <SleekCard style={{ justifyContent:'center', padding:'1.25rem 1.75rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'24px' }}>
        <div>
          <p style={{ fontFamily: isAr ? "'Cairo','Noto Sans Arabic',sans-serif" : "'Bebas Neue',sans-serif", fontSize:'1.8rem', color:'#fff', letterSpacing: isAr ? '0' : '0.08em', margin:0, lineHeight:1.1, textShadow:'0 0 24px rgba(255,255,255,0.25)' }}>
            {isAr ? ar.hero.trackTitle : 'SHIPMENT TRACKING'}
          </p>
          <p style={{ fontFamily:"'Inter',sans-serif", fontSize: isAr ? '15px' : '11px', color:'rgba(255,255,255,0.75)', margin:'6px 0 0', letterSpacing: isAr ? '0' : '0.14em', textTransform: isAr ? 'none' : 'uppercase', fontWeight:600 }}>
            {isAr ? ar.hero.trackSub : 'Real-Time Global Visibility'}
          </p>
        </div>
        <button
          onClick={() => window.open('https://www.track-trace.com/', '_blank', 'noopener,noreferrer')}
          className="btn-gold"
          style={{ padding:'12px 28px', fontSize:'1rem', borderRadius:'10px', whiteSpace:'nowrap', flexShrink:0, fontWeight:400 }}
        >
          {isAr ? ar.hero.trackBtn : 'Track Now'}
        </button>
      </div>
    </SleekCard>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main VideoHero
// ─────────────────────────────────────────────────────────────────────────────
export default function VideoHero({ onQuoteClick }) {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const wrapperRef      = useRef(null)
  const canvasRef       = useRef(null)
  const chaptersRef     = useRef([])
  const heroCardsRef    = useRef(null)
  const exitOverlayRef  = useRef(null)
  const globeChapterRef = useRef(null)   // full-screen globe chapter overlay
  const canvasDimRef    = useRef(null)   // canvas dimmer during globe chapter
  const framesRef       = useRef([])     // decoded Image objects
  const lastIdxRef      = useRef(-1)     // last drawn frame index
  const kickRenderRef   = useRef(null)   // fn to restart RAF when a frame loads late

  // ── Chapter opacity driven by exact frame index (hardcoded to footage) ──
  const applyProgress = useCallback((frameIdx) => {
    for (let i = 0; i < CHAPTERS.length; i++) {
      const el = chaptersRef.current[i]
      if (!el) continue

      const [start, end] = CHAPTERS[i].frameRange
      const isLast  = i === CHAPTERS.length - 1
      const isFirst = i === 0
      let opacity = 0

      if (isLast) {
        // Last chapter fades in and stays; exit overlay covers the end
        if      (frameIdx >= start + FRAME_FADE) opacity = 1
        else if (frameIdx >= start)              opacity = (frameIdx - start) / FRAME_FADE
      } else if (isFirst) {
        // First chapter: no fade-in — fully visible from frame 0
        if      (frameIdx <= end - FRAME_FADE) opacity = 1
        else if (frameIdx <= end)              opacity = (end - frameIdx) / FRAME_FADE
        else opacity = 0
      } else {
        if      (frameIdx >= start + FRAME_FADE && frameIdx <= end - FRAME_FADE) opacity = 1
        else if (frameIdx >= start              && frameIdx <  start + FRAME_FADE) opacity = (frameIdx - start) / FRAME_FADE
        else if (frameIdx >  end - FRAME_FADE   && frameIdx <= end)                opacity = (end - frameIdx)   / FRAME_FADE
        else opacity = 0
      }

      opacity = Math.max(0, Math.min(1, opacity))
      el.style.opacity       = String(opacity)
      el.style.transform     = `translateY(${(1 - opacity) * 28}px)`
      el.style.pointerEvents = opacity < 0.1 ? 'none' : 'all'
    }
  }, [])

  // ── Canvas: size to DPR viewport ─────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = Math.min(window.devicePixelRatio || 1, 3)
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

    ctx.fillStyle = '#183650'
    ctx.fillRect(0, 0, cw, ch)

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'medium'

    ctx.drawImage(img, x, y, w, h)
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
      img.onload = () => {
        // If we painted a fallback while this frame was loading, invalidate
        // the cache and kick the RAF loop so it redraws with the real frame
        if (lastIdxRef.current === i) {
          lastIdxRef.current = -1
          if (kickRenderRef.current) kickRenderRef.current()
        }
      }
      img.onerror = () => {
        // CloudFront failed — silently retry from S3
        const fallback = new window.Image()
        fallback.src = FRAME_URLS_S3[i]
        imgs[i] = fallback
      }
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
        // Fade out the static LCP placeholder image now that canvas has the frame
        const lcpImg = document.getElementById('hero-lcp-img')
        if (lcpImg) { lcpImg.style.opacity = '0'; setTimeout(() => { if (lcpImg) lcpImg.style.display = 'none' }, 350) }
        // Ensure first chapter is visible before showing the app
        applyProgress(FRAME_FADE)
        // Signal root to fade in (prevents FOUT/flash)
        if (typeof window.__markHeroReady === 'function') window.__markHeroReady()
      }
    }
    
    // Phase 1b — Adaptive eager batch: scale with connection speed
    // fast (4g/wifi): 60 frames | slow (3g): 20 frames | very slow: 8 frames
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const effectiveType = conn?.effectiveType || '4g'
    const eagerCount = effectiveType === '4g' ? 60 : effectiveType === '3g' ? 20 : 8
    loadFrameRange(1, eagerCount)

    // Phase 2 — idle background: load all remaining frames when browser is free
    const scheduleIdle = (start) => {
      if (start >= TOTAL_FRAMES) return
      const handle = requestIdleCallback
        ? requestIdleCallback(() => { loadFrameRange(start, start + 39); scheduleIdle(start + 40) }, { timeout: 3000 })
        : setTimeout(() => { loadFrameRange(start, start + 39); scheduleIdle(start + 40) }, 300)
      return handle
    }
    scheduleIdle(eagerCount + 1)
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
      smoothP = lerp(smoothP, targetP, 0.15) 

      const frameIdx = Math.min(Math.round(smoothP * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1)
      loadAhead(frameIdx)
      paintFrame(frameIdx)

      // Chapter headings driven by smooth frame index
      applyProgress(frameIdx)

      // ── Hero cards fade ──
      if (heroCardsRef.current) {
        const CARD_FADE_START  = 100
        const CARD_FADE_END    = 145
        const CARGO_FADE_START = 683
        const CARGO_FADE_END   = 703
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

      // ── Globe chapter — full-screen, replaces canvas ──
      // Canvas pre-dims BEFORE globe chapter so bic footage fades out gracefully.
      // Globe begins fading in WHILE canvas is still dimming → seamless cross-dissolve.
      const GLOBE_FADE      = 30   // globe fade-in/out window in frames
      const PRE_DIM_FRAMES  = 50   // how many frames to dim canvas before globe start
      const PRE_DIM_START   = GLOBE_CHAPTER_START - PRE_DIM_FRAMES
      const GLOBE_EARLY     = 20   // globe starts fading in this many frames before GLOBE_CHAPTER_START
      const POST_DIM_END    = GLOBE_CHAPTER_END + 28

      if (globeChapterRef.current && canvasDimRef.current) {
        // ── Canvas dimmer: slow fade to black over 50 frames ──
        let dimOp = 0
        if (frameIdx >= PRE_DIM_START && frameIdx < GLOBE_CHAPTER_START) {
          dimOp = (frameIdx - PRE_DIM_START) / PRE_DIM_FRAMES
        } else if (frameIdx >= GLOBE_CHAPTER_START && frameIdx <= GLOBE_CHAPTER_END) {
          dimOp = 1
        } else if (frameIdx > GLOBE_CHAPTER_END && frameIdx <= POST_DIM_END) {
          dimOp = 1 - (frameIdx - GLOBE_CHAPTER_END) / (POST_DIM_END - GLOBE_CHAPTER_END)
        }
        canvasDimRef.current.style.opacity = String(Math.max(0, Math.min(1, dimOp)))

        // ── Globe: starts fading in GLOBE_EARLY frames before chapter start ──
        // This overlaps with the canvas dim → direct dissolve, no black gap
        const GLOBE_FADE_IN_START = GLOBE_CHAPTER_START - GLOBE_EARLY
        let globeOp = 0
        if (frameIdx >= GLOBE_FADE_IN_START && frameIdx < GLOBE_FADE_IN_START + GLOBE_FADE) {
          globeOp = (frameIdx - GLOBE_FADE_IN_START) / GLOBE_FADE
        } else if (frameIdx >= GLOBE_FADE_IN_START + GLOBE_FADE && frameIdx <= GLOBE_CHAPTER_END - GLOBE_FADE) {
          globeOp = 1
        } else if (frameIdx > GLOBE_CHAPTER_END - GLOBE_FADE && frameIdx <= GLOBE_CHAPTER_END) {
          globeOp = (GLOBE_CHAPTER_END - frameIdx) / GLOBE_FADE
        }
        globeOp = Math.max(0, Math.min(1, globeOp))
        globeChapterRef.current.style.opacity       = String(globeOp)
        globeChapterRef.current.style.pointerEvents = globeOp > 0.05 ? 'all' : 'none'
      }

      if (Math.abs(smoothP - targetP) > 0.0001) {
        rafId = requestAnimationFrame(render)
      } else {
        rafId = null
      }
    }

    // Expose a kick function so late-loading frames can restart the RAF
    kickRenderRef.current = () => { if (!rafId) rafId = requestAnimationFrame(render) }

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
      {/* Scroll anchor for Nav/Footer redirection to the 3D Globe section */}
      <div id="globe" style={{ position: 'absolute', top: '16.5%', width: 1, height: 1, pointerEvents: 'none' }} />

      {/* ── STICKY VIEWPORT ── */}
      <div className="hero-sticky-viewport" style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

        {/* Dark base */}
        <div style={{ position:'absolute', inset:0, zIndex:0, background:'#183650' }} />

        {/* ── CANVAS — sits beneath globe, always ready ── */}
        <canvas ref={canvasRef} style={{
          position:'absolute', inset:0, zIndex:1,
          width:'100%', height:'100%',
          opacity:1,
          willChange:'transform',
          filter: 'contrast(1.12) saturate(1.2) brightness(1.02)',
          background:'#183650',
        }} />

        {/* ── LCP IMAGE — static img so browser preloads before JS runs.
             Sits on top of canvas at z:1, fades out once canvas paints frame 0. ── */}
        <img
          src="/hero-frame0.webp"
          alt=""
          fetchPriority="high"
          decoding="sync"
          aria-hidden="true"
          id="hero-lcp-img"
          style={{
            position:'absolute', inset:0, zIndex:2,
            width:'100%', height:'100%',
            objectFit:'cover',
            filter: 'contrast(1.12) saturate(1.2) brightness(1.02)',
            transition:'opacity 0.4s ease',
            willChange:'opacity',
          }}
        />

        {/* Exit overlay */}
        <div ref={exitOverlayRef} style={{
          position:'absolute', inset:0, zIndex:8,
          background:'linear-gradient(to bottom,rgba(24,54,80,0.96) 0%,#183650 100%)',
          pointerEvents:'none', opacity:0, willChange:'opacity',
        }} />

        {/* Cinematic vignette — over both videos */}
        <div style={{
          position:'absolute', inset:0, zIndex:3, pointerEvents:'none',
          background:`
            radial-gradient(ellipse 75% 65% at 50% 50%,rgba(24,54,80,0) 0%,rgba(24,54,80,0.45) 100%),
            linear-gradient(to bottom,rgba(24,54,80,0.50) 0%,rgba(24,54,80,0.01) 22%,rgba(24,54,80,0.01) 76%,rgba(24,54,80,0.70) 100%)
          `,
        }} />


        {/* ── Canvas dimmer — darkens frame scrubbing during globe chapter ── */}
        <div ref={canvasDimRef} style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: '#183650', opacity: 0, pointerEvents: 'none', transition: 'none',
        }} />

        {/* ── GLOBE CHAPTER — full-screen, sits above canvas ── */}
        <div ref={globeChapterRef} style={{
          position: 'absolute', inset: 0, zIndex: 6,
          opacity: 0, pointerEvents: 'none', transition: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(24,54,80,0.85) 0%, rgba(18,40,64,0.98) 100%)',
        }}>
          <Suspense fallback={null}>
            <BejoiceGlobe embedded fullscreen />
          </Suspense>
        </div>

        {/* ── CHAPTER OVERLAYS — strictly one at a time ── */}
        {CHAPTERS.map((ch, i) => {
          const arCh = ar.hero.chapters[i]
          const displayEyebrow  = isAr && arCh?.eyebrow  != null ? arCh.eyebrow  : ch.eyebrow
          const displayHeadline = isAr && arCh?.headline != null ? arCh.headline : ch.headline
          const isCenter = ch.align === 'center'
          const isRight  = ch.align === 'right'
          const isTop    = ch.vAlign === 'top'
          const isBottom = ch.vAlign === 'bottom'
          return (
            <div key={i}
              ref={el => chaptersRef.current[i] = el}
              className="hero-content-overlay"
              style={{
                position:'absolute', inset:0, zIndex:4,
                display:'flex', flexDirection:'column',
                justifyContent: isTop ? 'flex-start' : isBottom ? 'flex-end' : 'center',
                alignItems:    isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                textAlign:     isCenter ? 'center' : isRight ? 'right'    : 'left',
                padding:       'clamp(1.2rem,5vw,6rem)',
                paddingTop:    isTop ? 'clamp(5rem,10vh,8rem)' : undefined,
                paddingBottom: isBottom ? 'clamp(60px,8vh,100px)' : 'clamp(160px,28vh,320px)',
                /* NO opacity here — React re-renders would reset it.
                   Initial opacity:0 is applied by the useEffect below.
                   The RAF owns opacity from then on. */
                pointerEvents:'none',
                willChange:'opacity,transform',
                transition:'none',
              }}
            >

              {/* ── Text block with subtle dark backdrop ── */}
              <div className="hero-chapter-textblock" style={{
                display:'flex', flexDirection:'column',
                alignItems: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                background:'rgba(0,0,0,0.42)',
                backdropFilter:'blur(6px)',
                WebkitBackdropFilter:'blur(6px)',
                borderRadius:'10px',
                padding:'clamp(14px,2vw,24px) clamp(16px,2.5vw,28px)',
                border:'1px solid rgba(255,255,255,0.06)',
                maxWidth: 'max-content',
                alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
              }}>

                {/* Eyebrow */}
                {displayEyebrow && (
                  <div className="hero-eyebrow" style={{
                    display:'inline-flex', alignItems:'center', gap:'8px',
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize: isAr ? 'clamp(19px,1.6vw,20px)' : 'clamp(13px,1.4vw,16px)', letterSpacing: isAr ? '0' : '0.22em',
                    textTransform: isAr ? 'none' : 'uppercase', fontWeight:700,
                    color:'rgba(255,255,255,1)',
                    background:'rgba(255,255,255,0.12)',
                    border:'1.5px solid rgba(255,255,255,0.55)',
                    borderRadius:'3px', padding:'6px 16px',
                    boxShadow:'0 0 12px rgba(255,255,255,0.1)',
                    marginBottom:'14px',
                    alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                    backdropFilter:'blur(8px)',
                    userSelect:'none', pointerEvents:'none',
                  }}>
                    {displayEyebrow}
                  </div>
                )}

                {/* Headline */}
                <div style={{ pointerEvents:'all', cursor:'default' }}>
                  {(() => {
                    const HeadlineTag = i === 0 ? 'h1' : 'h2'
                    return (
                      <HeadlineTag style={{ margin: 0 }}>
                        {displayHeadline.map((line, li) => (
                          <div key={li} style={{
                            fontFamily: isAr ? "'Cairo','Noto Sans Arabic',sans-serif" : "'Bebas Neue',sans-serif",
                            fontSize: isAr ? 'clamp(1.8rem,5vw,5rem)' : 'clamp(2rem,5.5vw,5.5rem)',
                            lineHeight: isAr ? 1.1 : 0.87, letterSpacing: isAr ? '0' : '0.06em', margin:0,
                            color: li % 2 === 0 ? '#ffffff' : 'rgba(91,194,231,1)',
                            textShadow: li % 2 === 0
                              ? '0 1px 12px rgba(0,0,0,0.9)'
                              : '0 1px 12px rgba(0,0,0,0.9), 0 0 20px rgba(91,194,231,0.3)',
                            userSelect:'none',
                          }}>
                            {line}
                          </div>
                        ))}
                      </HeadlineTag>
                    )
                  })()}
                </div>

                {/* Accent line */}
                <div style={{
                  width: isCenter ? '80px' : '60px', height:'2px', marginTop:'26px',
                  background:'linear-gradient(90deg,rgba(91,194,231,0.85),rgba(91,194,231,0.08))',
                  alignSelf: isCenter ? 'center' : isRight ? 'flex-end' : 'flex-start',
                }} />


{/* Start Shipment CTA — first chapter only */}
                {ch.showCTA && (
                  <button
                    className="hero-intro-cta btn-gold"
                    onClick={onQuoteClick}
                    aria-label={isAr ? 'ابدأ الشحن - احصل على عرض سعر' : 'Start Shipment - Get a Quote'}
                    style={{
                      marginTop:'28px',
                      alignSelf: isRight ? 'flex-end' : isCenter ? 'center' : 'flex-start',
                      display:'inline-flex', alignItems:'center', gap:'10px',
                      fontFamily:"'Bebas Neue',sans-serif",
                      fontSize:'1rem', letterSpacing:'0.18em',
                      padding:'12px 32px', borderRadius:'10px', cursor:'pointer',
                      pointerEvents:'auto',
                      zIndex: 10,
                    }}
                  >
                    <span style={{ position:'relative', zIndex:2 }}>{isAr ? ar.hero.ctaQuote : 'START SHIPMENT'}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0, position:'relative', zIndex:2 }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <div className="btn-shine-overlay" />
                  </button>
                )}

                {/* ── Mobile inline cards (hidden on desktop via CSS) ── */}
                {ch.showCTA && (
                  <div className="hero-mobile-cards">
                    {/* OR divider */}
                    <div className="hero-mobile-divider">
                      <div className="hero-mobile-divider-line" />
                      <span className="hero-mobile-divider-text">OR</span>
                      <div className="hero-mobile-divider-line" />
                    </div>

                    {/* Track shipment */}
                    <div className="hero-mobile-track-section">
                      <div className="hero-mobile-section-label">
                        <svg viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="3.5" stroke="rgba(91,194,231,0.8)" strokeWidth="1.5"/><circle cx="5" cy="5" r="1" fill="rgba(91,194,231,0.8)"/></svg>
                        TRACK SHIPMENT
                      </div>
                      <div className="hero-mobile-track">
                        <TrackCard />
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <div className="hero-mobile-section-label" style={{ marginTop:'14px' }}>
                        <svg viewBox="0 0 10 10" fill="none"><rect x="1" y="5" width="2" height="4" rx="0.5" fill="rgba(91,194,231,0.8)"/><rect x="4" y="3" width="2" height="6" rx="0.5" fill="rgba(91,194,231,0.8)"/><rect x="7" y="1" width="2" height="8" rx="0.5" fill="rgba(91,194,231,0.8)"/></svg>
                        BY THE NUMBERS
                      </div>
                      <div className="hero-mobile-stats">
                        {[
                          { v:'120', suffix:'+', l:'Countries' },
                          { v:'25',  suffix:'+', l:'Years' },
                          { v:'24/7',suffix:'',  l:'Operations' },
                          { v:'KSA', suffix:'',  l:'Specialist' },
                        ].map((s, idx, arr) => (
                          <div key={s.l} style={{
                            flex:'1', display:'flex', alignItems:'center', justifyContent:'center',
                            padding:'0.75rem 0.25rem',
                            borderRight: idx < arr.length-1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                          }}>
                            <div style={{ textAlign:'center' }}>
                              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.35rem', letterSpacing:'0.06em', color:'#ffffff', textShadow:'0 0 16px rgba(255,255,255,0.25)', lineHeight:1.1 }}>
                                <CountUp target={s.v} suffix={s.suffix} duration={1000} />
                              </div>
                              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(91,194,231,0.85)', fontWeight:600, marginTop:'4px' }}>
                                {s.l}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>{/* end text backdrop */}
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
            flex:'0 0 auto', display:'flex', flexDirection:'row', flexWrap:'nowrap', alignItems:'stretch',
            background:'rgba(10, 10, 14, 0.55)',
            border:'1px solid rgba(91, 194, 231, 0.12)', borderRadius:'14px',
            backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)',
            boxShadow:'0 24px 64px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 20px rgba(91,194,231,0.04)',
            overflow:'hidden',
          }}>
            {/* Gold top line — matches SleekCard */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1.5, background:'linear-gradient(90deg,transparent,rgba(91,194,231,0.35),transparent)', pointerEvents:'none', zIndex:1 }}/>
            {[
              { v:'120',  arV:null, suffix:'+', l:'Countries',  ar: 'دولة'      },
              { v:'25',   arV:null, suffix:'+', l:'Years',      ar: 'عامًا'     },
              { v:'24/7', arV:'٢٤/٧', suffix:'',  l:'Operations', ar: 'عمليات'    },
              { v:'KSA',  arV:'م.ع.س',  suffix:'',  l:'Specialist', ar: 'متخصص'     },
            ].map((s, idx, arr) => (
              <div key={s.l} className="hero-stat-cell" style={{
                display:'flex', alignItems:'center', padding:'1.25rem clamp(8px,1.2vw,16px)',
                borderRight: idx < arr.length-1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                flexShrink:0,
              }}>
                <div style={{ textAlign:'center' }}>
                  <div className="hero-stat-number" style={{
                    fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.8rem', letterSpacing:'0.08em', lineHeight:1.1,
                    color:'#ffffff',
                    textShadow:'0 0 20px rgba(255,255,255,0.3)',
                  }}>
                    <CountUp target={isAr && s.arV ? s.arV : s.v} suffix={isAr && s.suffix ? toArabicNum(s.suffix) : s.suffix} duration={1000} arabic={isAr && !s.arV} />
                  </div>
                  <div className="hero-stat-label" style={{ fontFamily:"'Inter',sans-serif", fontSize: isAr ? '15px' : '11px', letterSpacing:'0.14em', textTransform:'uppercase', color:'rgba(91,194,231,0.85)', fontWeight:600, marginTop:'6px', whiteSpace:'nowrap' }}>
                    {isAr ? s.ar : s.l}
                  </div>
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

        /* Mobile inline cards — hidden on desktop */
        .hero-mobile-cards { display: none; }

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
          border-color: rgba(91, 194, 231, 0.25) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 20px rgba(91,194,231,0.08) !important;
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
          .hero-globe-video { object-fit: contain !important; background: #183650; }
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
            padding-top: 114px !important;
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
            background: rgba(91,194,231,0.25);
          }
          .hero-mobile-divider-text {
            font-family: 'DM Sans', sans-serif;
            font-size: clamp(7px, 1.8vw, 9px);
            font-weight: 700;
            letter-spacing: 0.24em;
            color: rgba(91,194,231,0.65);
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
            color: rgba(91,194,231,0.8) !important;
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
          .hero-eyebrow { font-size: 12px !important; letter-spacing: 0.16em !important; padding: 5px 11px !important; margin-bottom: 8px !important; }
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
          .hero-content-overlay { padding-top: 114px !important; }
        }

        /* ── Mobile: force chapter text blocks to center ── */
        @media (max-width: 767px) {
          .hero-chapter-textblock {
            align-items: center !important;
            align-self: center !important;
            text-align: center !important;
            max-width: calc(100vw - 2rem) !important;
          }
          .hero-chapter-textblock h1 { text-align: center !important; }
          .hero-eyebrow { align-self: center !important; }
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
