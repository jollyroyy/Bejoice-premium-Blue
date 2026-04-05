import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useCalBooking } from '../hooks/useCalBooking'
import { useLang } from '../context/LangContext'

const CAL_LINK = "sudeshna-pal-ruww5f/freight-consultation"

const links = [
  { label: 'Why Bejoice',                  id: 'certifications', num: '01', sub: 'Our story & edge' },
  { label: 'Services',                     id: 'services',   num: '02', sub: 'Full logistics suite' },
  { label: 'Heavy Lift & Project Logistics', id: 'heavy-cargo', num: '03', sub: '1500+ operations' },
  { label: 'Bejoice Wings',                id: 'globe',      num: '04', sub: 'Our global network', isGlobe: true },
]

export default function Nav({ onQuoteClick }) {
  const { openCalPopup } = useCalBooking()
  const { lang, setLang } = useLang()
  const [scrolled, setScrolled]   = useState(false)
  const [pastHero, setPastHero]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [heavyOpen, setHeavyOpen] = useState(false)
  const drawerRef                 = useRef(null)
  const backdropRef               = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Detect when scrollytelling hero ends (1800vh)
  useEffect(() => {
    const update = (scrollY) => {
      const heroEnd = (1800 / 100) * window.innerHeight
      setPastHero(scrollY > heroEnd)
    }
    const attach = () => {
      if (window.__lenis) {
        window.__lenis.on('scroll', ({ scroll }) => update(scroll))
      } else {
        setTimeout(attach, 200)
      }
    }
    attach()
    const onScroll = () => update(window.scrollY || document.documentElement.scrollTop)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // GSAP drawer animation
  useEffect(() => {
    const drawer   = drawerRef.current
    const backdrop = backdropRef.current
    if (!drawer || !backdrop) return
    if (menuOpen) {
      backdrop.style.display = 'block'
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.28, ease: 'power2.out' })
      gsap.fromTo(drawer,   { x: '100%' }, { x: '0%', duration: 0.42, ease: 'power3.out' })
    } else {
      gsap.to(drawer,   { x: '100%', duration: 0.32, ease: 'power3.in' })
      gsap.to(backdrop, { opacity: 0, duration: 0.28, ease: 'power2.in', onComplete: () => { if (backdrop) backdrop.style.display = 'none' } })
    }
  }, [menuOpen])

  const scrollTo = (id) => {
    setMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 })
        else el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 400)
  }

  const scrollToTop = () => {
    setMenuOpen(false)
    const el = document.getElementById('globe')
    if (el) {
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleQuote = () => {
    setMenuOpen(false)
    setTimeout(() => onQuoteClick?.(), 350)
  }

  const toolCard = (icon, label, sub, onClick) => (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', gap: '0.5rem',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '0.9rem', padding: 'clamp(0.85rem,2vw,1.1rem) clamp(0.75rem,1.8vw,1rem)',
        cursor: 'pointer', transition: 'all 0.22s', textAlign: 'left',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,78,0.1)'; e.currentTarget.style.borderColor = 'rgba(200,168,78,0.35)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      <span style={{ fontSize: 'clamp(1.3rem,2.5vw,1.6rem)', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(0.88rem,2vw,1rem)', letterSpacing: '0.1em', color: '#ffffff', lineHeight: 1.1 }}>{label}</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.63rem,1.4vw,0.68rem)', fontWeight: 500, color: 'rgba(200,168,78,0.7)', lineHeight: 1.4, letterSpacing: '0.02em' }}>{sub}</span>
    </button>
  )

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s ease',
        padding: '12px 0',
        background: pastHero ? 'rgba(5,5,8,0.92)' : 'transparent',
        backdropFilter: pastHero ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: pastHero ? 'blur(18px)' : 'none',
        borderBottom: 'none',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 'clamp(82px, 11.2vw, 128px)' }}>

          {/* Logo */}
          <div onClick={scrollToTop} style={{ position: 'relative', cursor: 'pointer', display: 'inline-block', marginLeft: '-405px' }}>
            <img
              src="/bejoice-logo-white.png"
              alt="Bejoice"
              style={{
                height: 'clamp(82px, 11.2vw, 128px)',
                width: 'clamp(315px, 42vw, 630px)',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(1.45) contrast(1.1) drop-shadow(0 2px 14px rgba(0,0,0,0.6)) drop-shadow(0 0 28px rgba(255,255,255,0.12))',
              }}
            />
          </div>

          {/* Right side: CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,16px)', marginRight: '-200px' }}>

            {/* CTA — Book a Call */}
            <button
              onClick={openCalPopup}
              className="btn-gold nav-book-call"
              style={{ padding: 'clamp(9px,1.5vw,12px) clamp(12px,2.5vw,22px)', whiteSpace: 'nowrap', fontSize: 'clamp(0.75rem,1.1vw,0.95rem)' }}
            >
              <div className="btn-shine-overlay" />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="hidden sm:inline">Book a Call with Freight Expert</span>
              <span className="sm:hidden">Book a Call</span>
            </button>

            {/* Hamburger — premium pill button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className={!menuOpen ? 'hamburger-btn' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: 'clamp(8px,1.5vw,10px) clamp(14px,2.5vw,18px) clamp(8px,1.5vw,10px) clamp(10px,2vw,14px)',
                background: menuOpen ? 'rgba(200,168,78,0.14)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${menuOpen ? 'rgba(200,168,78,0.7)' : 'rgba(200,168,78,0.45)'}`,
                borderRadius: '100px', cursor: 'pointer', zIndex: 60,
                transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                boxShadow: menuOpen ? '0 0 24px rgba(200,168,78,0.25), inset 0 1px 0 rgba(200,168,78,0.15)' : undefined,
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => { if (!menuOpen) { e.currentTarget.style.background = 'rgba(200,168,78,0.1)'; e.currentTarget.style.borderColor = 'rgba(200,168,78,0.7)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(200,168,78,0.2)' } }}
              onMouseLeave={e => { if (!menuOpen) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(200,168,78,0.45)'; e.currentTarget.style.boxShadow = '0 0 0 rgba(200,168,78,0)' } }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: 'clamp(18px,3vw,20px)' }}>
                <span style={{ display: 'block', height: '1.5px', borderRadius: '2px', background: '#c8a84e', width: 'clamp(18px,3vw,20px)', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)' }}/>
                <span className={!menuOpen ? 'bar-mid' : ''} style={{ display: 'block', height: '1.5px', borderRadius: '2px', background: 'rgba(200,168,78,0.55)', width: 'clamp(11px,2vw,13px)', opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : undefined, transition: 'all 0.25s ease' }}/>
                <span style={{ display: 'block', height: '1.5px', borderRadius: '2px', background: '#c8a84e', width: 'clamp(18px,3vw,20px)', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)' }}/>
              </div>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '15px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#ffffff',
                transition: 'color 0.3s ease',
                lineHeight: 1,
              }}>
                {menuOpen ? 'Close' : 'Explore'}
              </span>
            </button>

            {/* Language Toggle */}
            <div className="lang-toggle-wrap" style={{
              display: 'flex', alignItems: 'stretch', flexShrink: 0,
              background: 'rgba(10,10,18,0.6)', border: '1.5px solid rgba(200,168,78,0.45)',
              borderRadius: '10px', overflow: 'hidden', backdropFilter: 'blur(12px)',
              boxShadow: '0 2px 16px rgba(200,168,78,0.12), inset 0 1px 0 rgba(200,168,78,0.08)',
              transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,78,0.75)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(200,168,78,0.28), inset 0 1px 0 rgba(200,168,78,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,168,78,0.45)'; e.currentTarget.style.boxShadow = '0 2px 16px rgba(200,168,78,0.12), inset 0 1px 0 rgba(200,168,78,0.08)' }}
            >
              <button onClick={() => { if (lang === 'en') return; setLang('en'); document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'; document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`; window.location.reload() }}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: 'clamp(6px,1.2vw,8px) clamp(9px,1.5vw,13px)', background: lang === 'en' ? 'rgba(200,168,78,0.22)' : 'transparent', border: 'none', borderRight: '1px solid rgba(200,168,78,0.3)', cursor: lang === 'en' ? 'default' : 'pointer', transition: 'background 0.25s ease', position: 'relative' }}
                onMouseEnter={e => { if (lang !== 'en') e.currentTarget.style.background = 'rgba(200,168,78,0.1)' }}
                onMouseLeave={e => { if (lang !== 'en') e.currentTarget.style.background = 'transparent' }}
              >
                <img src="https://flagcdn.com/w40/gb.png" width="20" height="14" alt="English" style={{ borderRadius: '3px', flexShrink: 0, objectFit: 'cover', display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.5)', opacity: lang === 'en' ? 1 : 0.75 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', lineHeight: 1, color: lang === 'en' ? '#e8cc7a' : 'rgba(200,168,78,0.65)', textShadow: lang === 'en' ? '0 0 12px rgba(232,204,122,0.6)' : 'none' }}>EN</span>
                {lang === 'en' && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: 'linear-gradient(90deg, transparent, #c8a84e, transparent)', borderRadius: '2px 2px 0 0' }} />}
              </button>
              <button onClick={() => { if (lang === 'ar') return; setLang('ar'); document.cookie = 'googtrans=/en/ar; path=/'; document.cookie = `googtrans=/en/ar; path=/; domain=.${window.location.hostname}`; window.location.reload() }}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: 'clamp(6px,1.2vw,8px) clamp(9px,1.5vw,13px)', background: lang === 'ar' ? 'rgba(200,168,78,0.22)' : 'transparent', border: 'none', cursor: lang === 'ar' ? 'default' : 'pointer', transition: 'background 0.25s ease', position: 'relative' }}
                onMouseEnter={e => { if (lang !== 'ar') e.currentTarget.style.background = 'rgba(200,168,78,0.1)' }}
                onMouseLeave={e => { if (lang !== 'ar') e.currentTarget.style.background = 'transparent' }}
              >
                <img src="https://flagcdn.com/w40/sa.png" width="20" height="14" alt="Arabic" style={{ borderRadius: '3px', flexShrink: 0, objectFit: 'cover', display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.5)', opacity: lang === 'ar' ? 1 : 0.75 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', lineHeight: 1, color: lang === 'ar' ? '#e8cc7a' : 'rgba(200,168,78,0.65)', textShadow: lang === 'ar' ? '0 0 12px rgba(232,204,122,0.6)' : 'none' }}>AR</span>
                {lang === 'ar' && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: 'linear-gradient(90deg, transparent, #c8a84e, transparent)', borderRadius: '2px 2px 0 0' }} />}
              </button>
            </div>

            {/* Social icons — app-icon style squares */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <a
                href="https://www.linkedin.com/company/bejoice-shipping-llc/"
                target="_blank" rel="noopener noreferrer"
                aria-label="Bejoice on LinkedIn"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: '7px',
                  background: 'linear-gradient(145deg, #0d7ad6 0%, #0A66C2 60%, #084ea1 100%)',
                  border: 'none', color: '#ffffff', textDecoration: 'none',
                  transition: 'all 0.22s',
                  boxShadow: '0 2px 8px rgba(10,102,194,0.55), 0 0 0 1px rgba(255,255,255,0.12) inset, inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.06)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(10,102,194,0.75), 0 0 0 1px rgba(255,255,255,0.15) inset' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(10,102,194,0.55), 0 0 0 1px rgba(255,255,255,0.12) inset, inset 0 1px 0 rgba(255,255,255,0.25)' }}
              >
                {/* Official LinkedIn "in" lettermark */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/bejoice_shipping"
                target="_blank" rel="noopener noreferrer"
                aria-label="Bejoice on Instagram"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 30, height: 30, borderRadius: '7px',
                  background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)',
                  border: 'none', color: '#ffffff', textDecoration: 'none',
                  transition: 'all 0.22s',
                  boxShadow: '0 2px 8px rgba(220,39,100,0.55), 0 0 0 1px rgba(255,255,255,0.12) inset, inset 0 1px 0 rgba(255,255,255,0.25)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.06)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(220,39,100,0.7), 0 0 0 1px rgba(255,255,255,0.15) inset' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(220,39,100,0.55), 0 0 0 1px rgba(255,255,255,0.12) inset, inset 0 1px 0 rgba(255,255,255,0.25)' }}
              >
                {/* Official Instagram camera icon */}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── BACKDROP ── */}
      <div
        ref={backdropRef}
        onClick={() => setMenuOpen(false)}
        style={{ display: 'none', position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 998, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />

      {/* ── SIDE DRAWER ── */}
      <div
        ref={drawerRef}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(400px, 92vw)',
          background: '#080810',
          borderLeft: '1px solid rgba(200,168,78,0.12)',
          zIndex: 999,
          display: 'flex', flexDirection: 'column',
          transform: 'translateX(100%)',
          overflowY: 'auto',
        }}
      >
        {/* Gold top accent */}
        <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, rgba(200,168,78,0.8), transparent)', flexShrink: 0 }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 1.4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
            <img src="/bejoice-logo-white.png" alt="Bejoice" style={{ height: '52px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.8))' }} />
            <div style={{ borderLeft: '1.5px solid rgba(200,168,78,0.35)', paddingLeft: '9px', marginLeft: '6px' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', letterSpacing: '0.18em', color: '#ffffff', textTransform: 'uppercase', fontWeight: 700, lineHeight: 1 }}>Bejoice</div>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >✕</button>
        </div>

        {/* Nav links */}
        <div style={{ padding: '1rem 1.4rem 0.5rem', flexShrink: 0 }}>
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => link.id === 'heavy-cargo' ? (setMenuOpen(false), setHeavyOpen(true)) : scrollTo(link.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1rem,2.5vw,1.15rem)', fontWeight: 400,
                letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 'clamp(0.65rem,2vw,0.7rem) 0', minHeight: '44px', borderBottom: '1px solid rgba(255,255,255,0.06)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#c8a84e'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
            >
              <span style={{ display: 'inline-block', width: 3, height: 14, background: 'rgba(200,168,78,0.4)', borderRadius: 2, flexShrink: 0 }}/>
              {link.label}
            </button>
          ))}
        </div>

        {/* Tools section */}
        <div style={{ padding: '1rem 1.4rem', flexShrink: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.85rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(200,168,78,0.7)', marginBottom: '0.8rem', borderBottom: '1px solid rgba(200,168,78,0.12)', paddingBottom: '0.5rem' }}>
            Logistics Tools
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {toolCard('🚢', 'Quick Quote', 'Instant freight rates', handleQuote)}
            {toolCard('📡', 'Track Shipment', 'BL / AWB live tracking', () => { setMenuOpen(false); window.open('https://www.track-trace.com/', '_blank', 'noopener,noreferrer') })}
            {toolCard('📞', 'Book a Call', 'Talk to a freight expert', () => { setMenuOpen(false); setTimeout(() => openCalPopup(), 350) })}
            {toolCard('✉️', 'Email Us', 'quotes@bejoice.com', () => { setMenuOpen(false); window.location.href = 'mailto:quotes@bejoice.com' })}
          </div>

          {/* Social links — app-icon squares */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.6rem', justifyContent: 'center' }}>
            <a
              href="https://www.linkedin.com/company/bejoice-shipping-llc/"
              target="_blank" rel="noopener noreferrer"
              aria-label="Bejoice on LinkedIn"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '11px', flexShrink: 0,
                background: 'linear-gradient(145deg, #0d7ad6 0%, #0A66C2 60%, #084ea1 100%)',
                color: '#ffffff', textDecoration: 'none', transition: 'all 0.22s',
                boxShadow: '0 2px 10px rgba(10,102,194,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(10,102,194,0.75), inset 0 1px 0 rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(10,102,194,0.6), inset 0 1px 0 rgba(255,255,255,0.25)' }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/bejoice_shipping"
              target="_blank" rel="noopener noreferrer"
              aria-label="Bejoice on Instagram"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '11px', flexShrink: 0,
                background: 'linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)',
                color: '#ffffff', textDecoration: 'none', transition: 'all 0.22s',
                boxShadow: '0 2px 10px rgba(220,39,100,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.06)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,39,100,0.75), inset 0 1px 0 rgba(255,255,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(220,39,100,0.6), inset 0 1px 0 rgba(255,255,255,0.25)' }}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom bar */}
        <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.62rem,1.2vw,0.7rem)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
              Est. 2006 · Riyadh, KSA
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.62rem,1.2vw,0.7rem)', color: 'rgba(200,168,78,0.55)', letterSpacing: '0.08em' }}>
              ZATCA · ISO 9001 · FIATA
            </span>
          </div>
        </div>
      </div>

      {/* ── Heavy Lift Popup ── */}
      {heavyOpen && (
        <div
          onClick={() => setHeavyOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(5,5,8,0.82)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'clamp(16px,4vw,32px)',
            overflowY: 'auto',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%', maxWidth: 680,
              background: 'linear-gradient(160deg, rgba(20,18,12,0.97) 0%, rgba(12,10,6,0.99) 100%)',
              border: '1px solid rgba(200,168,78,0.28)',
              borderTop: '2px solid rgba(255,215,105,0.7)',
              borderRadius: 20,
              boxShadow: '0 60px 120px rgba(0,0,0,0.85), 0 0 80px rgba(200,168,78,0.08), inset 0 1px 0 rgba(255,215,105,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Gold gradient header */}
            <div style={{
              padding: 'clamp(1.4rem,4vw,2rem) clamp(1.4rem,4vw,2rem) 1.2rem',
              background: 'linear-gradient(135deg, rgba(200,168,78,0.12) 0%, rgba(200,168,78,0.04) 100%)',
              borderBottom: '1px solid rgba(200,168,78,0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.65rem,1.4vw,0.72rem)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(200,168,78,0.8)', marginBottom: '0.4rem' }}>
                    Bejoice Specialized Services
                  </div>
                  <h2 style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400,
                    fontSize: 'clamp(1.6rem,4vw,2.2rem)', letterSpacing: '0.06em',
                    color: '#ffffff', lineHeight: 1.1, margin: 0,
                  }}>
                    Heavy Lift &amp; Project<br/>
                    <span style={{ color: '#c8a84e' }}>Logistics</span>
                  </h2>
                  <div style={{ marginTop: '0.5rem', fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.75rem,1.5vw,0.82rem)', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>
                    1,500+ heavy lift operations · ODC &amp; OOG specialists
                  </div>
                </div>
                <button
                  onClick={() => setHeavyOpen(false)}
                  style={{
                    flexShrink: 0, width: 40, height: 40,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '50%', color: 'rgba(255,255,255,0.5)', fontSize: '1rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                >✕</button>
              </div>
            </div>

            {/* Services list */}
            <div style={{ padding: 'clamp(1.2rem,3vw,1.6rem) clamp(1.4rem,4vw,2rem)', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {[
                {
                  icon: '🏗️',
                  title: 'Heavy Lift / ODC / OOG Transportation',
                  desc: 'Conventional hydraulic axles for transporting heavy equipment such as wind turbines, transformers, generators, industrial machinery, construction components, and large project cargo.',
                },
                {
                  icon: '🗺️',
                  title: 'Route Survey Feasibility Study',
                  desc: 'Detailed physical inspection and analysis of the entire transportation route from the pickup location to the final delivery site.',
                },
                {
                  icon: '🚧',
                  title: 'Route Modification for ODC Transportation',
                  desc: 'Removal or adjustment of obstacles such as traffic signals, road signs, guardrails, overhead cables, streetlights, and bypass construction for transportation.',
                },
                {
                  icon: '⚙️',
                  title: 'Onsite Jacking & Skidding',
                  desc: 'To lift heavy equipment such as transformers, reactors, or large industrial modules, while skidding systems allow the cargo to be horizontally moved along specially designed tracks or skid beams.',
                },
                {
                  icon: '📐',
                  title: 'Technical Engineering Solutions',
                  desc: 'Technical analysis and planning for lifting, loading, securing, and transporting heavy cargo safely. Includes lift plans, load distribution calculations, and structural analysis.',
                },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 'clamp(0.8rem,2vw,1.1rem)', alignItems: 'flex-start',
                  padding: 'clamp(0.9rem,2vw,1.1rem) clamp(0.9rem,2vw,1.2rem)',
                  background: i % 2 === 0 ? 'rgba(200,168,78,0.04)' : 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(200,168,78,0.1)',
                  borderLeft: '3px solid rgba(200,168,78,0.55)',
                  borderRadius: 10,
                }}>
                  <span style={{ fontSize: 'clamp(1.2rem,2.5vw,1.4rem)', flexShrink: 0, marginTop: '0.05rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400, fontSize: 'clamp(0.9rem,2vw,1.02rem)', letterSpacing: '0.08em', color: '#e8d898', marginBottom: '0.3rem' }}>
                      {item.title}
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(0.75rem,1.4vw,0.83rem)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.55 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA footer */}
            <div style={{ padding: '0 clamp(1.4rem,4vw,2rem) clamp(1.2rem,3vw,1.6rem)', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setHeavyOpen(false); setTimeout(() => openCalPopup(), 300) }}
                style={{
                  flex: '1 1 160px', padding: '0.75rem 1.2rem', minHeight: 44,
                  background: 'linear-gradient(135deg, #c8a84e, #ffe680)',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400,
                  fontSize: 'clamp(0.85rem,1.8vw,0.95rem)', letterSpacing: '0.1em',
                  color: '#0a0800', transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Book a Consultation
              </button>
              <button
                onClick={() => { setHeavyOpen(false); const el = document.getElementById('heavy-cargo'); if (el) { if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 }); else el.scrollIntoView({ behavior: 'smooth' }) } }}
                style={{
                  flex: '1 1 140px', padding: '0.75rem 1.2rem', minHeight: 44,
                  background: 'transparent', border: '1px solid rgba(200,168,78,0.4)',
                  borderRadius: 10, cursor: 'pointer',
                  fontFamily: "'Bebas Neue', sans-serif", fontWeight: 400,
                  fontSize: 'clamp(0.85rem,1.8vw,0.95rem)', letterSpacing: '0.1em',
                  color: 'rgba(200,168,78,0.85)', transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,78,0.7)'; e.currentTarget.style.color = '#c8a84e' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(200,168,78,0.4)'; e.currentTarget.style.color = 'rgba(200,168,78,0.85)' }}
              >
                View Full Section ↓
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
