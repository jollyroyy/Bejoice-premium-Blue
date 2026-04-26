import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '../context/LangContext'
import ar from '../i18n/ar'
import { SparklesCore } from './ui/sparkles'

/* ── Capabilities data ── */
const CAPABILITIES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BC2E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    title: 'Saudi Arabia Focus',
    desc: 'Strong presence aligned with Vision 2030 and regional growth',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BC2E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: 'Strategic Positioning',
    desc: 'Dubai HQ with operations in KSA, India & China',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BC2E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 20V10M12 20V4M18 20v-6"/>
      </svg>
    ),
    title: 'Heavy Lift Experts',
    desc: 'Specialized in heavy lift & project logistics execution',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BC2E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'Decisive Execution',
    desc: 'Fast, solution-driven logistics with full accountability',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BC2E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Hands-On Team',
    desc: 'Deep regional and international knowledge at every level',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5BC2E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: 'Safety & Reliability',
    desc: 'Committed to performance excellence and zero-compromise safety',
  },
]

/* ── Founding members ── */
const FOUNDERS = [
  { name: 'Mohammed Ashraful Althaf', role: 'COO & Co-Owner', img: '/ashraful-coo.webp' },
  { name: 'Preetham Canute Pinto',    role: 'CEO & Co-Owner', img: '/preetham-ceo.webp' },
  { name: 'Shahil',                    role: 'Managing Partner', img: '/shahil-mp.webp' },
]

export default function WhyBejoice() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' })

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-4 md:px-10 lg:px-20"
      style={{ background: '#183650' }}
    >
      <SparklesCore background="transparent" minSize={0.5} maxSize={1.8} particleDensity={45} particleColor="rgba(91,194,231,0.8)" speed={0.6} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(91,194,231,0.06) 0%, transparent 60%)' }} />

      <div className="max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Outer Glassmorphism Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 50%, rgba(91,194,231,0.02) 100%)',
            backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)',
            border: '1px solid rgba(91,194,231,0.28)',
            borderTop: '1px solid rgba(91,194,231,0.55)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,194,231,0.06) inset, inset 0 1px 0 rgba(91,194,231,0.22), 0 0 50px rgba(91,194,231,0.06)',
            position: 'relative',
          }}
        >
          {/* Ambient light layers */}
          <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', borderRadius:24 }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(91,194,231,0.08) 0%, transparent 60%)' }}/>
            <div style={{ position:'absolute', bottom:'-10%', right:'-5%', width:'clamp(300px,50vw,600px)', height:'clamp(300px,50vw,600px)', borderRadius:'50%', background:'radial-gradient(circle, rgba(91,194,231,0.03) 0%, transparent 65%)' }}/>
          </div>

          {/* ── Header Block ── */}
          <div style={{
            textAlign: 'center',
            padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem) clamp(1.2rem,2.5vw,2rem)',
            borderBottom: '1px solid rgba(91,194,231,0.1)',
            position: 'relative', zIndex: 2,
          }}>
            <div style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(13px,1.4vw,16px)',
              letterSpacing: '0.45em', textTransform: 'uppercase',
              color: 'rgba(91,194,231,1)',
              textShadow: '0 0 20px rgba(91,194,231,0.5)',
              fontWeight: 700, marginBottom: '0.8rem',
            }}>
              Moving Trade Beyond Borders
            </div>
            <motion.h2
              className="no-reveal"
              initial={{ x: -70, opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              animate={isInView ? { x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)' } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(3rem,7vw,6rem)',
                letterSpacing: '0.07em', lineHeight: 1,
                margin: 0,
                color: '#ffffff',
                filter: 'drop-shadow(0 0 30px rgba(91,194,231,0.3))',
              }}
            >
              <span style={{ color: '#ffffff' }}>WHY </span>
              <span style={{ color: '#5BC2E7' }}>BEJOICE</span>
            </motion.h2>
            <div style={{ width: 60, height: 2, margin: '1.4rem auto 0', background: 'linear-gradient(90deg, transparent, rgba(91,194,231,0.7), transparent)' }} />
          </div>

          {/* ── Main Description ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,5vw,4rem)',
              borderBottom: '1px solid rgba(91,194,231,0.08)',
              position: 'relative', zIndex: 2,
            }}
          >
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(16px,1.6vw,18.5px)',
              fontWeight: 400, color: 'rgba(255,255,255,0.78)',
              lineHeight: 1.85, margin: 0,
              maxWidth: '72ch', marginLeft: 'auto', marginRight: 'auto',
              textAlign: 'center',
            }}>
              Bejoice is a dynamic freight forwarding company focused on moving cargo with precision, speed,
              and reliability across key international trade lanes, with a strong and growing emphasis on
              <span style={{ color: '#5BC2E7', fontWeight: 600 }}> Saudi Arabia's rapidly expanding logistics sector</span>.
              With our HQ in Dubai and established operations in Saudi Arabia, China, and India, Bejoice
              is strategically positioned to support the Kingdom's vision of becoming a global logistics
              hub under <span style={{ color: '#5BC2E7', fontWeight: 600 }}>Vision 2030</span>.
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(15px,1.5vw,17px)',
              fontWeight: 400, color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.85, margin: '1.2rem 0 0',
              maxWidth: '72ch', marginLeft: 'auto', marginRight: 'auto',
              textAlign: 'center',
            }}>
              We specialize in heavy lift and project cargo, where planning, execution, and safety are
              critical. Every movement is carefully engineered with coordination, control, and full
              accountability from origin to final delivery — supporting the Kingdom's mega projects
              and industrial growth requirements.
            </p>
          </motion.div>

          {/* ── Capabilities Grid ── */}
          <div style={{
            padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.5rem,5vw,4rem)',
            borderBottom: '1px solid rgba(91,194,231,0.08)',
            position: 'relative', zIndex: 2,
          }}>
            {/* Section label */}
            <div style={{ display:'flex', alignItems:'center', justifyContent: 'center', gap:12, marginBottom:'clamp(1.5rem,2.5vw,2rem)' }}>
              <div style={{ width:40, height:2, background:'linear-gradient(90deg, transparent, #5BC2E7)', borderRadius:1 }} />
              <span style={{
                fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(16px,1.8vw,21px)',
                fontWeight:800, letterSpacing:'0.35em', textTransform:'uppercase',
                color:'#5BC2E7', textShadow:'0 0 20px rgba(91,194,231,0.6)',
              }}>
                Our Capabilities
              </span>
              <div style={{ width:40, height:2, background:'linear-gradient(90deg, #5BC2E7, transparent)', borderRadius:1 }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
              gap: 0,
            }}>
              {CAPABILITIES.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: [0.16,1,0.3,1] }}
                  style={{
                    padding: 'clamp(1rem,1.8vw,1.4rem) clamp(0.8rem,1.5vw,1.2rem)',
                    borderRight: i % 3 !== 2 ? '1px solid rgba(91,194,231,0.06)' : 'none',
                    borderBottom: i < 3 ? '1px solid rgba(91,194,231,0.06)' : 'none',
                    display: 'flex', gap: 'clamp(0.6rem,1vw,0.8rem)',
                    alignItems: 'flex-start',
                    transition: 'all 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
                    cursor: 'default',
                    zIndex: 1,
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -18,
                    backgroundColor: 'rgba(91,194,231,0.12)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
                    zIndex: 10,
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 1000, 
                    damping: 40 
                  }}
                >
                  {/* Icon badge */}
                  <div style={{
                    width: 'clamp(34px,3.2vw,40px)', height: 'clamp(34px,3.2vw,40px)',
                    borderRadius: 9, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(91,194,231,0.14) 0%, rgba(91,194,231,0.04) 100%)',
                    border: '1px solid rgba(91,194,231,0.22)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 3px 12px rgba(91,194,231,0.08), inset 0 1px 0 rgba(91,194,231,0.15)',
                  }}>
                    {cap.icon}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 'clamp(1.4rem,2.2vw,1.7rem)',
                      letterSpacing: '0.06em', lineHeight: 1.1,
                      color: '#ffffff', marginBottom: 4,
                      textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    }}>
                      {cap.title}
                    </div>
                    <div style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 'clamp(13px,1.3vw,15.5px)',
                      color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, fontWeight: 450,
                    }}>
                      {cap.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Founding Members ── */}
          <div style={{
            padding: 'clamp(2rem,3.5vw,3rem) clamp(1.5rem,5vw,4rem)',
            position: 'relative', zIndex: 2,
          }}>
            {/* Section label */}
            <div style={{ textAlign:'center', marginBottom:'clamp(1.5rem,2.5vw,2rem)' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:12, marginBottom:'clamp(0.6rem,1vw,0.8rem)' }}>
                <div style={{ width:40, height:2, background:'linear-gradient(90deg, transparent, #5BC2E7)', borderRadius:1 }} />
                <span style={{
                  fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(14px,1.6vw,18px)',
                  fontWeight:800, letterSpacing:'0.35em', textTransform:'uppercase',
                  color:'#5BC2E7', textShadow:'0 0 20px rgba(91,194,231,0.6)',
                }}>
                  Founding Members — Bejoice KSA
                </span>
                <div style={{ width:40, height:2, background:'linear-gradient(90deg, #5BC2E7, transparent)', borderRadius:1 }} />
              </div>
            </div>

            {/* Founders Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(1rem,2vw,1.5rem)',
              maxWidth: 840,
              margin: '0 auto',
            }}>
              {FOUNDERS.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 80, damping: 16 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -20, 
                    borderColor: 'rgba(91,194,231,0.85)',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                    zIndex: 10 
                  }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 1000, 
                    damping: 40 
                  }}
                  style={{
                    textAlign: 'center',
                    padding: 'clamp(1.2rem,2vw,1.8rem) clamp(0.8rem,1vw,1.2rem)',
                    background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, rgba(91,194,231,0.015) 100%)',
                    border: '1px solid rgba(91,194,231,0.14)',
                    borderRadius: 18,
                    cursor: 'default',
                    transition: 'border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Ambient hover glow */}
                  <div style={{
                    position:'absolute', inset:0, pointerEvents:'none',
                    background:'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(91,194,231,0.06) 0%, transparent 70%)',
                    opacity:0, transition:'opacity 0.4s',
                  }} className="founder-glow" />

                  {/* Portrait */}
                  <motion.div 
                    style={{
                      width: 'clamp(110px,13vw,170px)', height: 'clamp(110px,13vw,170px)',
                      borderRadius: '50%',
                      margin: '0 auto clamp(0.8rem,1.4vw,1.2rem)',
                      background: 'linear-gradient(135deg, rgba(91,194,231,0.2), rgba(91,194,231,0.05))',
                      border: '2px solid rgba(91,194,231,0.25)',
                      overflow: 'hidden',
                      boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(91,194,231,0.1) inset',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={f.img}
                      alt={f.name}
                      loading="lazy"
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center top',
                        filter: 'grayscale(15%) contrast(1.05)',
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </motion.div>

                  {/* Name */}
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(0.9rem,1.6vw,1.15rem)',
                    letterSpacing: '0.12em', lineHeight: 1.15,
                    color: '#ffffff',
                    marginBottom: 3,
                  }}>
                    {f.name}
                  </div>

                  {/* Role */}
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(13px,1.35vw,16px)',
                    fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(91,194,231,0.75)',
                    lineHeight: 1.3,
                  }}>
                    {f.role}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>

      {/* ── Mobile responsive overrides ── */}
      <style>{`
        @media (max-width: 600px) {
          #why-us .max-w-5xl > div > div:nth-child(4) > div:last-child {
            grid-template-columns: 1fr !important;
            max-width: 280px !important;
            margin: 0 auto !important;
          }
        }
        @media (max-width: 768px) {
          #why-us .max-w-5xl > div > div:nth-child(3) > div:last-child > div {
            border-right: none !important;
            border-bottom: 1px solid rgba(91,194,231,0.06) !important;
          }
          #why-us .max-w-5xl > div > div:nth-child(3) > div:last-child > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  )
}
