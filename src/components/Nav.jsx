import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useCalBooking } from '../hooks/useCalBooking'
import { useLang } from '../context/LangContext'

const CAL_LINK = "sudeshna-pal-ruww5f/freight-consultation"

const links = [
  { label: 'Services',        id: 'services' },
  { label: 'Heavy Cargo',     id: 'heavy-cargo' },
  { label: 'Why Us',          id: 'why-us' },
  { label: 'Markets',         id: 'markets' },
  { label: 'Certifications',  id: 'certifications' },
  { label: 'Contact',         id: 'contact' },
]

export default function Nav({ onQuoteClick }) {
  const { openCalPopup } = useCalBooking()
  const { lang, setLang } = useLang()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const drawerRef                 = useRef(null)
  const backdropRef               = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
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
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.6 })
    } else if (window.scrollY === 0) {
      window.location.reload()
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        borderRadius: '0.9rem', padding: '1.1rem 1rem',
        cursor: 'pointer', transition: 'all 0.22s', textAlign: 'left',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,168,78,0.1)'; e.currentTarget.style.borderColor = 'rgba(200,168,78,0.35)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
    >
      <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{icon}</span>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '0.1em', color: '#ffffff', lineHeight: 1.1 }}>{label}</span>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.68rem', fontWeight: 500, color: 'rgba(200,168,78,0.7)', lineHeight: 1.4, letterSpacing: '0.02em' }}>{sub}</span>
    </button>
  )

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s ease',
        padding: scrolled ? '14px 0' : '22px 0',
        background: scrolled ? 'rgba(5,5,8,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 32px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div onClick={scrollToTop} style={{ display: 'flex', alignItems: 'center', gap: '0px', cursor: 'pointer' }}>
            <img
              src="/bejoice-logo-white.png"
              alt="Bejoice"
              style={{
                height: 'clamp(36px, 5vw, 56px)', width: 'auto', objectFit: 'contain', display: 'block',
                filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.8))',
              }}
            />
            <div className="nav-brand-text" style={{ borderLeft: '2px solid rgba(200,168,78,0.45)', paddingLeft: '10px', marginLeft: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', alignSelf: 'stretch' }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px, 1.8vw, 17px)',
                letterSpacing: '0.18em', color: '#ffffff',
                textTransform: 'uppercase', lineHeight: 1, fontWeight: 700,
                textShadow: '0 0 12px rgba(255,255,255,0.4), 0 1px 8px rgba(0,0,0,1)',
              }}>
                Bejoice
              </div>
              <div className="nav-tagline" style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(9px, 1.1vw, 14px)',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                lineHeight: 1, fontWeight: 700, position: 'relative', display: 'inline-block',
              }}>
                <span className="shine-ltr" data-text="Connecting KSA to the World"
                  style={{ color: '#ffe680', textShadow: '0 0 16px rgba(255,220,80,0.7), 0 0 32px rgba(200,168,78,0.4), 0 1px 8px rgba(0,0,0,0.8)' }}>
                  Connecting KSA to the World
                </span>
              </div>
            </div>
          </div>

          {/* Right side: CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,2vw,16px)' }}>

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
                padding: '10px 18px 10px 14px',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '20px' }}>
                <span style={{ display: 'block', height: '1.5px', borderRadius: '2px', background: '#c8a84e', width: '20px', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)' }}/>
                <span className={!menuOpen ? 'bar-mid' : ''} style={{ display: 'block', height: '1.5px', borderRadius: '2px', background: 'rgba(200,168,78,0.55)', width: '13px', opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : undefined, transition: 'all 0.25s ease' }}/>
                <span style={{ display: 'block', height: '1.5px', borderRadius: '2px', background: '#c8a84e', width: '20px', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)' }}/>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ffffff', textShadow: '0 0 12px rgba(255,255,255,0.35)', transition: 'color 0.3s ease', lineHeight: 1 }}>
                {menuOpen ? 'Close' : 'Menu'}
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
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 13px', background: lang === 'en' ? 'rgba(200,168,78,0.22)' : 'transparent', border: 'none', borderRight: '1px solid rgba(200,168,78,0.3)', cursor: lang === 'en' ? 'default' : 'pointer', transition: 'background 0.25s ease', position: 'relative' }}
                onMouseEnter={e => { if (lang !== 'en') e.currentTarget.style.background = 'rgba(200,168,78,0.1)' }}
                onMouseLeave={e => { if (lang !== 'en') e.currentTarget.style.background = 'transparent' }}
              >
                <img src="https://flagcdn.com/w40/gb.png" width="20" height="14" alt="English" style={{ borderRadius: '3px', flexShrink: 0, objectFit: 'cover', display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.5)', opacity: lang === 'en' ? 1 : 0.75 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', lineHeight: 1, color: lang === 'en' ? '#e8cc7a' : 'rgba(200,168,78,0.65)', textShadow: lang === 'en' ? '0 0 12px rgba(232,204,122,0.6)' : 'none' }}>EN</span>
                {lang === 'en' && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: 'linear-gradient(90deg, transparent, #c8a84e, transparent)', borderRadius: '2px 2px 0 0' }} />}
              </button>
              <button onClick={() => { if (lang === 'ar') return; setLang('ar'); document.cookie = 'googtrans=/en/ar; path=/'; document.cookie = `googtrans=/en/ar; path=/; domain=.${window.location.hostname}`; window.location.reload() }}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 13px', background: lang === 'ar' ? 'rgba(200,168,78,0.22)' : 'transparent', border: 'none', cursor: lang === 'ar' ? 'default' : 'pointer', transition: 'background 0.25s ease', position: 'relative' }}
                onMouseEnter={e => { if (lang !== 'ar') e.currentTarget.style.background = 'rgba(200,168,78,0.1)' }}
                onMouseLeave={e => { if (lang !== 'ar') e.currentTarget.style.background = 'transparent' }}
              >
                <img src="https://flagcdn.com/w40/sa.png" width="20" height="14" alt="Arabic" style={{ borderRadius: '3px', flexShrink: 0, objectFit: 'cover', display: 'block', boxShadow: '0 1px 4px rgba(0,0,0,0.5)', opacity: lang === 'ar' ? 1 : 0.75 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', lineHeight: 1, color: lang === 'ar' ? '#e8cc7a' : 'rgba(200,168,78,0.65)', textShadow: lang === 'ar' ? '0 0 12px rgba(232,204,122,0.6)' : 'none' }}>AR</span>
                {lang === 'ar' && <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '20px', height: '2px', background: 'linear-gradient(90deg, transparent, #c8a84e, transparent)', borderRadius: '2px 2px 0 0' }} />}
              </button>
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
            <img src="/bejoice-logo-white.png" alt="Bejoice" style={{ height: '38px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.8))' }} />
            <div style={{ borderLeft: '1.5px solid rgba(200,168,78,0.35)', paddingLeft: '9px', marginLeft: '6px' }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', letterSpacing: '0.18em', color: '#ffffff', textTransform: 'uppercase', fontWeight: 700, lineHeight: 1 }}>Bejoice</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', letterSpacing: '0.18em', color: '#ffe680', textTransform: 'uppercase', fontWeight: 600, lineHeight: 1, marginTop: '3px' }}>Connecting KSA to the World</div>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          >✕</button>
        </div>

        {/* Nav links */}
        <div style={{ padding: '1rem 1.4rem 0.5rem', flexShrink: 0 }}>
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', width: '100%', textAlign: 'left',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.15rem', fontWeight: 400,
                letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.7rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
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
            {toolCard('📡', 'Track Shipment', 'BL / AWB live tracking', () => { setMenuOpen(false); setTimeout(() => { const el = document.getElementById('hero'); if (el) { if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.2 }); else window.scrollTo({ top: 0, behavior: 'smooth' }) } }, 350) })}
            {toolCard('📞', 'Book a Call', 'Talk to a freight expert', () => { setMenuOpen(false); setTimeout(() => openCalPopup(), 350) })}
            {toolCard('✉️', 'Email Us', 'quotes@bejoice.com', () => { setMenuOpen(false); window.location.href = 'mailto:quotes@bejoice.com' })}
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Bottom bar */}
        <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em' }}>
              Est. 2006 · Riyadh, KSA
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.7rem', color: 'rgba(200,168,78,0.55)', letterSpacing: '0.08em' }}>
              ZATCA · ISO 9001 · FIATA
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
