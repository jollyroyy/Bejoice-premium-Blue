import { useEffect, useRef, useState } from 'react'
import { useCalBooking } from '../hooks/useCalBooking'


const CAL_LINK = "sudeshna-pal-ruww5f/freight-consultation"

const links = [
  { label: 'Services',        id: 'services' },
  { label: 'Heavy Cargo',     id: 'heavy-cargo' },
  { label: 'Why Us',          id: 'why-us' },
  { label: 'Markets',         id: 'markets' },
  { label: 'Certifications',  id: 'certifications' },
  { label: 'Contact',         id: 'contact' },
]

export default function Nav() {
  const { openCalPopup } = useCalBooking()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const overlayRef                = useRef(null)

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
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            <div style={{ borderLeft: '2px solid rgba(200,168,78,0.45)', paddingLeft: '10px', marginLeft: '6px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', alignSelf: 'stretch' }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '15px',
                letterSpacing: '0.18em', color: '#ffffff',
                textTransform: 'uppercase', lineHeight: 1,
                fontWeight: 700,
                textShadow: '0 0 12px rgba(255,255,255,0.4), 0 1px 8px rgba(0,0,0,1)',
              }}>
                Bejoice
              </div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                lineHeight: 1, fontWeight: 700, position: 'relative', display: 'inline-block',
              }}>
                <span
                  className="shine-ltr"
                  data-text="Connecting KSA to the World"
                  style={{ color: '#ffe680', textShadow: '0 0 16px rgba(255,220,80,0.7), 0 0 32px rgba(200,168,78,0.4), 0 1px 8px rgba(0,0,0,0.8)' }}
                >
                  Connecting KSA to the World
                </span>
              </div>
            </div>
          </div>

          {/* Right side: CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

            {/* CTA — Book a Call */}
            <button
              onClick={openCalPopup}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '13px',
                letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700,
                color: '#050508', background: 'linear-gradient(135deg, #e8cc7a, #c8a84e)',
                border: 'none', cursor: 'pointer', padding: '11px 22px',
                display: 'flex', alignItems: 'center', gap: '7px',
                borderRadius: '6px',
                boxShadow: '0 0 20px rgba(200,168,78,0.4), 0 4px 16px rgba(0,0,0,0.4)',
                transition: 'all 0.22s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(200,168,78,0.7), 0 4px 20px rgba(0,0,0,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(200,168,78,0.4), 0 4px 16px rgba(0,0,0,0.4)'; e.currentTarget.style.transform = 'translateY(0)' }}
              onMouseDown={e => { e.currentTarget.style.transform = 'translateY(0) scale(0.97)' }}
              onMouseUp={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
            >
              {/* Calendar icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span className="shine-ltr hidden sm:inline" data-text="Book a Call with Freight Expert">Book a Call with Freight Expert</span>
              <span className="shine-ltr sm:hidden" data-text="Book a Call">Book a Call</span>
            </button>

            {/* Hamburger — premium pill button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              className={!menuOpen ? 'hamburger-btn' : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px 18px 10px 14px',
                background: menuOpen
                  ? 'rgba(200,168,78,0.14)'
                  : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${menuOpen ? 'rgba(200,168,78,0.7)' : 'rgba(200,168,78,0.45)'}`,
                borderRadius: '100px',
                cursor: 'pointer', zIndex: 60,
                transition: 'all 0.3s cubic-bezier(0.23,1,0.32,1)',
                boxShadow: menuOpen
                  ? '0 0 24px rgba(200,168,78,0.25), inset 0 1px 0 rgba(200,168,78,0.15)'
                  : undefined,
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={e => {
                if (!menuOpen) {
                  e.currentTarget.style.background = 'rgba(200,168,78,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(200,168,78,0.7)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(200,168,78,0.2)'
                }
              }}
              onMouseLeave={e => {
                if (!menuOpen) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(200,168,78,0.45)'
                  e.currentTarget.style.boxShadow = '0 0 0 rgba(200,168,78,0)'
                }
              }}
            >
              {/* Lines or X */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '20px' }}>
                <span style={{
                  display: 'block', height: '1.5px', borderRadius: '2px',
                  background: '#c8a84e', width: '20px',
                  transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none',
                  transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
                }}/>
                <span className={!menuOpen ? 'bar-mid' : ''} style={{
                  display: 'block', height: '1.5px', borderRadius: '2px',
                  background: 'rgba(200,168,78,0.55)', width: '13px',
                  opacity: menuOpen ? 0 : 1,
                  transform: menuOpen ? 'scaleX(0)' : undefined,
                  transition: 'all 0.25s ease',
                }}/>
                <span style={{
                  display: 'block', height: '1.5px', borderRadius: '2px',
                  background: '#c8a84e', width: '20px',
                  transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                  transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
                }}/>
              </div>
              {/* Label */}
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px', fontWeight: 800,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: '#ffffff',
                textShadow: '0 0 12px rgba(255,255,255,0.35)',
                transition: 'color 0.3s ease',
                lineHeight: 1,
              }}>
                {menuOpen ? 'Close' : 'Menu'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 49,
          pointerEvents: menuOpen ? 'all' : 'none',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.45s ease',
        }}
      >
        {/* Backdrop */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(3,3,6,0.97)',
          backdropFilter: 'blur(24px)',
        }}/>

        {/* Gold accent line top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #c8a84e, transparent)',
          opacity: menuOpen ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
        }}/>

        {/* Content */}
        <div style={{
          position: 'relative', height: '100%',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: 'clamp(80px, 10vw, 120px) clamp(32px, 8vw, 120px)',
        }}>

          {/* Nav items */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((link, i) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '14px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: '24px',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(-32px)',
                  transition: `opacity 0.5s ease ${0.1 + i * 0.06}s, transform 0.5s cubic-bezier(0.23,1,0.32,1) ${0.1 + i * 0.06}s`,
                  group: true,
                }}
                onMouseEnter={e => {
                  e.currentTarget.querySelector('.link-num').style.color = '#c8a84e'
                  e.currentTarget.querySelector('.link-label').style.color = '#ffe680'
                  e.currentTarget.querySelector('.link-label').style.textShadow = '0 0 30px rgba(255,214,0,0.4)'
                  e.currentTarget.querySelector('.link-arrow').style.opacity = '1'
                  e.currentTarget.querySelector('.link-arrow').style.transform = 'translateX(8px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.querySelector('.link-num').style.color = 'rgba(200,168,78,0.3)'
                  e.currentTarget.querySelector('.link-label').style.color = '#ffffff'
                  e.currentTarget.querySelector('.link-label').style.textShadow = 'none'
                  e.currentTarget.querySelector('.link-arrow').style.opacity = '0'
                  e.currentTarget.querySelector('.link-arrow').style.transform = 'translateX(0)'
                }}
              >
                <span className="link-num" style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '13px', letterSpacing: '0.2em',
                  color: 'rgba(200,168,78,0.3)',
                  transition: 'color 0.3s ease',
                  minWidth: '28px',
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="link-label" style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(2.2rem, 5vw, 4rem)',
                  letterSpacing: '0.08em',
                  color: '#ffffff',
                  lineHeight: 1,
                  transition: 'color 0.3s ease, text-shadow 0.3s ease',
                }}>
                  {link.label}
                </span>
                <span className="link-arrow" style={{
                  color: '#c8a84e', opacity: 0,
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  transform: 'translateX(0)',
                  marginTop: '4px',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </button>
            ))}
          </nav>

          {/* Contact info row */}
          <div style={{
            marginTop: '48px',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s`,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
            }}>
              info@bejoice.com &nbsp;·&nbsp; +966 11 XXX XXXX
            </div>
          </div>

          {/* Bottom gold line */}
          <div style={{
            position: 'absolute', bottom: '40px', left: 'clamp(32px, 8vw, 120px)',
            display: 'flex', alignItems: 'center', gap: '16px',
            opacity: menuOpen ? 1 : 0,
            transition: 'opacity 0.5s ease 0.55s',
          }}>
            <div style={{ width: '32px', height: '1px', background: 'rgba(200,168,78,0.4)' }}/>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
              letterSpacing: '0.35em', textTransform: 'uppercase',
              color: 'rgba(200,168,78,0.4)',
            }}>
              Bejoice Group · Est. 2006 · Riyadh, KSA
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
