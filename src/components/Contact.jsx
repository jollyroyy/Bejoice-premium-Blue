import { useEffect, useRef, useState, useCallback } from 'react'
import { SparklesCore } from './ui/sparkles'
import { useLang } from '../context/LangContext'
import ar from '../i18n/ar'

const SERVICES = ['Air Freight','Sea Freight','Road Transport','Customs Clearance','Warehousing','Project Cargo']

const CONTACT_INFO = [
  { icon: '◈', label: 'Dammam HQ',  value: 'Block A, Al Raja Avenue\n1st floor, Office No. 2, Dammam 32234, Saudi Arabia' },
  { icon: '◉', label: 'Phone',      value: '+966 13 823 3461' },
  { icon: '◆', label: 'Email',      value: 'info@bejoiceshipping.com\nquotes@bejoice.com' },
]

export default function Contact() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const sectionRef = useRef(null)
  const [form, setForm]     = useState({ name:'', company:'', email:'', phone:'', origin:'', destination:'', type:'', message:'' })
  const [sent, setSent]     = useState(false)
  const [focused, setFocused] = useState(null)
  const cardRef = useRef(null)
  const glowRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card || !glow) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    glow.style.background = `radial-gradient(600px circle at ${px}% ${py}%, rgba(91,194,231,0.10) 0%, rgba(91,194,231,0.04) 30%, transparent 65%)`
    // Subtle card tilt
    const rx = (y / rect.height - 0.5) * 4
    const ry = (x / rect.width - 0.5) * -4
    card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    const glow = glowRef.current
    if (card) card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
    if (glow) glow.style.background = 'transparent'
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting)
          e.target.querySelectorAll('.fade-up').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 70))
      }),
      { threshold: 0.05 }
    )
    if (sectionRef.current) io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const iStyle = (name) => ({
    width: '100%', boxSizing: 'border-box',
    background: focused === name ? 'rgba(91,194,231,0.09)' : 'rgba(255,255,255,0.08)',
    border: `1px solid ${focused === name ? 'rgba(91,194,231,0.7)' : 'rgba(255,255,255,0.18)'}`,
    borderRadius: 8,
    padding: 'clamp(11px,1.4vw,14px) clamp(12px,1.8vw,16px)',
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 'clamp(16px,1.7vw,19px)',
    color: '#ffffff',
    textShadow: '0 0 12px rgba(255,255,255,0.15)',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  })

  const labelStyle = {
    fontFamily: "'DM Sans',sans-serif",
    fontSize: 'clamp(13px,1.3vw,15px)',
    letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'rgba(91,194,231,1)',
    textShadow: '0 0 16px rgba(91,194,231,0.4)',
    fontWeight: 700,
    display: 'block', marginBottom: 7,
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        /* Deep dark base — echoes hero palette */
        background: 'linear-gradient(160deg, #060810 0%, #080b14 45%, #091524 100%)',
        borderTop: '1px solid rgba(91,194,231,0.08)',
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(3rem,8vw,7rem) clamp(1rem,5vw,2.5rem)',
      }}
    >
      <SparklesCore background="transparent" minSize={0.6} maxSize={2} particleDensity={60} particleColor="rgba(91,194,231,0.9)" speed={0.8} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* ── Ambient light layers ── */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        background:'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(91,194,231,0.1) 0%, transparent 60%)',
      }}/>
      <div style={{ position:'absolute', bottom:'-10%', right:'-5%', pointerEvents:'none',
        width:'clamp(300px,50vw,600px)', height:'clamp(300px,50vw,600px)', borderRadius:'50%',
        background:'radial-gradient(circle, rgba(91,194,231,0.04) 0%, transparent 65%)',
      }}/>
      {/* Subtle diagonal grid lines */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:0.4,
        backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(91,194,231,0.02) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(91,194,231,0.02) 60px)',
      }}/>

      <div style={{ maxWidth:'780px', margin:'0 auto', position:'relative', zIndex:1 }}>

      {/* ══ OUTER AESTHETIC CARD ══ */}
      <div style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(91,194,231,0.018) 100%)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(91,194,231,0.35)',
        borderTop: '1px solid rgba(91,194,231,0.65)',
        borderRadius: 28,
        boxShadow: [
          '0 60px 120px rgba(0,0,0,0.75)',
          '0 0 0 1px rgba(91,194,231,0.08) inset',
          'inset 0 1px 0 rgba(91,194,231,0.30)',
          '0 0 60px rgba(91,194,231,0.10)',
          '0 0 120px rgba(91,194,231,0.05)',
        ].join(', '),
        overflow: 'hidden',
        position: 'relative',
        padding: 'clamp(2rem,5vw,4rem) clamp(1.5rem,4vw,3.5rem) clamp(2rem,4vw,3rem)',
      }}>


        {/* Corner accent — top-left */}
        <div style={{ position:'absolute', top:0, left:0, width:120, height:120, pointerEvents:'none',
          background:'radial-gradient(circle at 0% 0%, rgba(91,194,231,0.12) 0%, transparent 65%)',
        }}/>
        {/* Corner accent — bottom-right */}
        <div style={{ position:'absolute', bottom:0, right:0, width:200, height:200, pointerEvents:'none',
          background:'radial-gradient(circle at 100% 100%, rgba(91,194,231,0.07) 0%, transparent 60%)',
        }}/>
        {/* Top gold shimmer line */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:1, pointerEvents:'none',
          background:'linear-gradient(90deg, transparent 0%, rgba(91,194,231,0.6) 40%, rgba(91,194,231,0.8) 50%, rgba(91,194,231,0.6) 60%, transparent 100%)',
        }}/>


        {/* ── Heading ── */}
        <div className="fade-up" style={{ textAlign:'center', marginBottom:'clamp(2rem,4vw,3.5rem)' }}>
          <h2 className="contact-heading" style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize:'clamp(1.4rem,4vw,3.2rem)',
            letterSpacing:'0.07em', lineHeight:1,
            margin:'0 0 clamp(0.6rem,1.5vw,1rem)',
            color:'#ffffff',
            filter:'drop-shadow(0 0 30px rgba(91,194,231,0.3))',
          }}>
            {isAr ? (
              <><span style={{ color: '#ffffff' }}>{ar.contact.headlineWhite}</span><span style={{ color: '#5BC2E7' }}>{ar.contact.headlineCyan}</span></>
            ) : (
              <><span style={{ color: '#ffffff' }}>REQUEST A </span><span style={{ color: '#5BC2E7' }}>PRIVATE QUOTE</span></>
            )}
          </h2>
          <style>{`
            @keyframes headingSweep {
              0%   { background-position: -100% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
          <p style={{
            fontFamily:"'DM Sans',sans-serif", fontSize: isAr ? 'clamp(19px, 2.3vw, 23px)' : 'clamp(15px, 1.9vw, 19px)',
            color:'#ffffff', maxWidth:500, margin:'0 auto', lineHeight:1.8,
            fontWeight: 500, textShadow:'0 0 20px rgba(255,255,255,0.12)',
          }}>
            {isAr ? ar.contact.subheading : 'Tailored quote. Instant response.'}
          </p>
          <div style={{ width:48, height:1, margin:'clamp(1rem,2vw,1.6rem) auto 0', background:'linear-gradient(90deg,transparent,rgba(91,194,231,0.5),transparent)' }}/>
        </div>

        {!sent ? (
          <>
            {/* ══ GLASS CARD ══ */}
            <div
              ref={cardRef}
              className="fade-up contact-glass-card"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                /* Glass morphism */
                background: 'linear-gradient(135deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter: 'blur(32px)',
                WebkitBackdropFilter: 'blur(32px)',
                border: '1px solid rgba(91,194,231,0.22)',
                borderTop: '1px solid rgba(91,194,231,0.45)',
                borderRadius: 20,
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,194,231,0.05) inset, inset 0 1px 0 rgba(91,194,231,0.18), 0 0 40px rgba(91,194,231,0.05)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.15s ease, box-shadow 0.3s ease',
                willChange: 'transform',
              }}
            >

              {/* Interactive mouse-follow glow */}
              <div ref={glowRef} style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                borderRadius: 20, transition: 'background 0.1s ease',
                zIndex: 1,
              }}/>


              {/* Inner padding */}
              <div style={{ padding: 'clamp(1.6rem,4vw,2.8rem)', position: 'relative', zIndex: 2 }}>
                <form onSubmit={e => { e.preventDefault(); setSent(true) }}>

                  {/* Row 1 — Name / Company */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(8px,1.4vw,14px)', marginBottom:'clamp(8px,1.4vw,14px)' }} className="cg2">
                    <div><label style={labelStyle}>{isAr ? ar.contact.labels.fullName : 'Full Name *'}</label>
                      <input style={iStyle('name')} placeholder={isAr ? ar.contact.placeholders.fullName : 'Ahmed Al-Rashidi'} name="name" value={form.name} onChange={handleChange} onFocus={()=>setFocused('name')} onBlur={()=>setFocused(null)} required />
                    </div>
                    <div><label style={labelStyle}>{isAr ? ar.contact.labels.company : 'Company'}</label>
                      <input style={iStyle('company')} placeholder={isAr ? ar.contact.placeholders.company : 'Company name'} name="company" value={form.company} onChange={handleChange} onFocus={()=>setFocused('company')} onBlur={()=>setFocused(null)} />
                    </div>
                  </div>

                  {/* Row 2 — Email / Phone */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(8px,1.4vw,14px)', marginBottom:'clamp(8px,1.4vw,14px)' }} className="cg2">
                    <div><label style={labelStyle}>{isAr ? ar.contact.labels.email : 'Email *'}</label>
                      <input style={iStyle('email')} placeholder="your@email.com" type="email" name="email" value={form.email} onChange={handleChange} onFocus={()=>setFocused('email')} onBlur={()=>setFocused(null)} required />
                    </div>
                    <div><label style={labelStyle}>{isAr ? ar.contact.labels.phone : 'Phone / WhatsApp'}</label>
                      <input style={iStyle('phone')} placeholder="+966 5X XXX XXXX" name="phone" value={form.phone} onChange={handleChange} onFocus={()=>setFocused('phone')} onBlur={()=>setFocused(null)} />
                    </div>
                  </div>

                  {/* Row 3 — Origin / Destination */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(8px,1.4vw,14px)', marginBottom:'clamp(8px,1.4vw,14px)' }} className="cg2">
                    <div><label style={labelStyle}>{isAr ? ar.contact.labels.origin : 'Origin'}</label>
                      <input style={iStyle('origin')} placeholder={isAr ? ar.contact.placeholders.origin : 'Country / Port'} name="origin" value={form.origin} onChange={handleChange} onFocus={()=>setFocused('origin')} onBlur={()=>setFocused(null)} />
                    </div>
                    <div><label style={labelStyle}>{isAr ? ar.contact.labels.destination : 'Destination'}</label>
                      <input style={iStyle('destination')} placeholder={isAr ? ar.contact.placeholders.destination : 'Country / Port'} name="destination" value={form.destination} onChange={handleChange} onFocus={()=>setFocused('destination')} onBlur={()=>setFocused(null)} />
                    </div>
                  </div>

                  {/* Service type pills */}
                  <div style={{ marginBottom:'clamp(8px,1.4vw,14px)' }}>
                    <label style={labelStyle}>{isAr ? ar.contact.labels.serviceType : 'Service Type'}</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:'clamp(5px,0.8vw,8px)' }}>
                      {(isAr ? ar.contact.services : SERVICES).map((s, sIdx) => (
                        <button key={s} type="button"
                          onClick={() => setForm(f => ({ ...f, type: f.type === (isAr ? SERVICES[sIdx] : s) ? '' : (isAr ? SERVICES[sIdx] : s) }))}
                          style={{
                            fontFamily:"'DM Sans',sans-serif",
                            fontSize:'clamp(13px,1vw,13px)', fontWeight:600,
                            letterSpacing:'0.1em', textTransform:'uppercase',
                            padding:'clamp(8px,0.8vw,9px) clamp(12px,1.3vw,16px)',
                            minHeight: 36,
                            borderRadius:6, cursor:'pointer', transition:'all 0.18s',
                            background: form.type === (isAr ? SERVICES[sIdx] : s) ? 'rgba(91,194,231,0.12)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${form.type === (isAr ? SERVICES[sIdx] : s) ? 'rgba(91,194,231,0.45)' : 'rgba(255,255,255,0.08)'}`,
                            color: form.type === (isAr ? SERVICES[sIdx] : s) ? '#8DD8F0' : 'rgba(255,255,255,0.85)',
                          }}
                        >{s}</button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom:'clamp(1.2rem,2.5vw,2rem)' }}>
                    <label style={labelStyle}>{isAr ? ar.contact.labels.additionalDetails : 'Additional Details'}</label>
                    <textarea
                      style={{ ...iStyle('message'), resize:'none' }}
                      placeholder={isAr ? ar.contact.placeholders.message : 'Cargo type, weight, dimensions, special requirements...'}
                      name="message" rows={3} value={form.message}
                      onChange={handleChange}
                      onFocus={()=>setFocused('message')}
                      onBlur={()=>setFocused(null)}
                    />
                  </div>

                  {/* ── Submit row ── */}
                  <div style={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
                    <button type="submit" className="btn-gold btn-gold--static" style={{
                      flexShrink: 0,
                      fontSize: 'clamp(13px,1.5vw,16px)',
                      letterSpacing: '0.2em',
                      padding: 'clamp(12px,1.5vw,15px) clamp(24px,3vw,38px)',
                    }}>
                      <span>{isAr ? ar.contact.submitBtn : 'Send Query'}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </>
        ) : (
          /* ── Success ── */
          <div className="fade-up" style={{
            textAlign:'center',
            background:'linear-gradient(135deg, rgba(91,194,231,0.05) 0%, rgba(91,194,231,0.02) 100%)',
            border:'1px solid rgba(91,194,231,0.18)',
            borderRadius:20, padding:'clamp(3rem,6vw,6rem) clamp(2rem,5vw,4rem)',
          }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(4rem,10vw,7rem)', color:'#5BC2E7', textShadow:'0 0 40px rgba(91,194,231,0.4)', lineHeight:1, marginBottom:'1.2rem' }}>✓</div>
            <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(1.8rem,4vw,3rem)', letterSpacing:'0.1em', color:'#ffffff', marginBottom:'0.8rem' }}>{isAr ? ar.contact.successTitle : 'ENQUIRY SENT'}</h3>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(13px,1.5vw,16px)', color:'rgba(255,255,255,0.6)', maxWidth:360, margin:'0 auto 2rem', lineHeight:1.75 }}>
              {isAr ? ar.contact.successBody : 'Our logistics team will contact you within 2 business hours with a tailored quote.'}
            </p>
            <button className="btn-ghost" onClick={() => setSent(false)}><span>{isAr ? ar.contact.newEnquiry : 'New Enquiry'}</span></button>
          </div>
        )}

      </div>{/* end outer aesthetic card */}
      </div>

      {/* ── Keyframes + responsive ── */}
      <style>{`
        .contact-info-card {
          transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .contact-info-card:hover {
          background: rgba(91,194,231,0.06) !important;
          border-color: rgba(91,194,231,0.3) !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.35), 0 0 20px rgba(91,194,231,0.06);
        }
        .contact-glass-card:hover {
          box-shadow:
            0 40px 100px rgba(0,0,0,0.65),
            0 0 0 1px rgba(91,194,231,0.12) inset,
            0 1px 0 rgba(91,194,231,0.3) inset,
            0 0 60px rgba(91,194,231,0.04) !important;
          border-color: rgba(255,255,255,0.16) !important;
        }
        @media (max-width: 600px) {
          .cg2 { grid-template-columns: 1fr !important; }
          .contact-glass-card { transform: none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .contact-glass-card { transition: none !important; }
        }
      `}</style>
    </section>
  )
}
