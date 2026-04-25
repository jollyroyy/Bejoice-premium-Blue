import { useRef } from 'react'
import useFadeUpBatch from '../hooks/useFadeUpBatch'
import { SparklesCore } from './ui/sparkles'

const CAPABILITIES = [
  'Strong presence in Saudi Arabia, aligned with regional growth and Vision 2030',
  'Strategically positioned — Dubai HQ, KSA, India & China',
  'Specialized expertise in Heavy Lift & Project Logistics',
  'Structured for fast, decisive, and solution-driven execution',
  'Experienced, hands-on team with deep regional and international knowledge',
  'Strong commitment to reliability, safety, and performance excellence',
]

const TEAM = [
  { name: 'Preetham Canute Pinto', role: 'CEO & Co-Owner',    initials: 'PC' },
  { name: 'Mohammed Ashraful Althaf', role: 'COO & Co-Owner', initials: 'MA' },
  { name: 'Shahil',                  role: 'Managing Partner', initials: 'SH' },
]

export default function WhyBejoice() {
  const sectionRef = useRef(null)
  useFadeUpBatch(sectionRef)

  return (
    <section
      id="why-us"
      ref={sectionRef}
      style={{
        background: '#183650',
        borderTop: '1px solid rgba(91,194,231,0.08)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3rem,8vw,7rem) clamp(1rem,5vw,2.5rem)',
      }}
    >
      <SparklesCore background="transparent" minSize={0.6} maxSize={2} particleDensity={60} particleColor="rgba(91,194,231,0.9)" speed={0.8} className="absolute inset-0 w-full h-full pointer-events-none" />
      {/* Ambient top glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 45% at 50% 0%, rgba(91,194,231,0.07) 0%, transparent 65%)',
      }} />
      {/* Bottom-right orb */}
      <div style={{
        position: 'absolute', bottom: '-12%', right: '-6%', pointerEvents: 'none',
        width: 'clamp(300px,50vw,700px)', height: 'clamp(300px,50vw,700px)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,194,231,0.04) 0%, transparent 65%)',
      }} />
      {/* Grid hatch */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35,
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(91,194,231,0.022) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(91,194,231,0.022) 60px)',
      }} />

      <div style={{ maxWidth: 'min(1200px, calc(100vw - 2rem))', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ══ OUTER PRESTIGE CARD ══ */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.032) 0%, rgba(255,255,255,0.012) 55%, rgba(91,194,231,0.016) 100%)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(91,194,231,0.3)',
          borderTop: '1px solid rgba(91,194,231,0.6)',
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 60px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(91,194,231,0.07) inset, inset 0 1px 0 rgba(91,194,231,0.28), 0 0 70px rgba(91,194,231,0.08)',
          padding: 'clamp(2rem,4vw,4rem) clamp(1.5rem,4vw,4rem)',
        }}>

          {/* Top sweep shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1, pointerEvents: 'none',
            background: 'linear-gradient(90deg, transparent 0%, rgba(91,194,231,0.55) 40%, rgba(91,194,231,0.8) 50%, rgba(91,194,231,0.55) 60%, transparent 100%)',
          }} />
          {/* Inner diagonal texture */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.018,
            backgroundImage: 'repeating-linear-gradient(45deg, #5BC2E7 0px, #5BC2E7 1px, transparent 1px, transparent 14px)',
          }} />
          {/* Left ambient radial */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 55% 70% at 0% 50%, rgba(91,194,231,0.05) 0%, transparent 70%)',
          }} />

          {/* ── HEADER ── */}
          <div className="fade-up" style={{ position: 'relative', zIndex: 2, marginBottom: 'clamp(2rem,4vw,3.5rem)', textAlign: 'center' }}>

            {/* Headline */}
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(3rem,7vw,6rem)',
              letterSpacing: '0.07em', lineHeight: 1,
              margin: '0 0 clamp(0.5rem,1vw,0.8rem)',
              textShadow: '0 2px 40px rgba(0,0,0,0.8)',
              filter: 'drop-shadow(0 0 30px rgba(91,194,231,0.3))',
            }}>
              <span style={{ color: '#ffffff' }}>WHY </span>
              <span style={{ color: '#5BC2E7', textShadow: '0 0 50px rgba(91,194,231,0.4)' }}>BEJOICE</span>
            </h2>

            {/* Subheading */}
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.1rem,2.4vw,1.9rem)',
              letterSpacing: '0.12em', lineHeight: 1.1,
              color: 'rgba(255,255,255,0.45)',
              margin: '0 0 clamp(1rem,2vw,1.6rem)',
            }}>
              MOVING TRADE BEYOND BORDERS
            </p>

            {/* Divider rule */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <div style={{ width: 52, height: 2, background: 'linear-gradient(90deg,rgba(91,194,231,0.15),#5BC2E7)' }} />
              <div style={{ width: 5, height: 5, background: '#5BC2E7', opacity: 0.65, transform: 'rotate(45deg)', flexShrink: 0 }} />
              <div style={{ width: 52, height: 2, background: 'linear-gradient(90deg,#5BC2E7,rgba(91,194,231,0.15))' }} />
            </div>
          </div>

          {/* ── TWO-COLUMN BODY ── */}
          <div className="wb-two-col" style={{ position: 'relative', zIndex: 2, marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>

            {/* LEFT — body text */}
            <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.4rem,2.5vw,2rem)' }}>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(15px,1.55vw,17px)',
                lineHeight: 1.9, color: 'rgba(255,255,255,0.78)',
                letterSpacing: '0.012em',
              }}>
                Bejoice is a dynamic freight forwarding company focused on moving cargo with precision, speed, and reliability across key international trade lanes — with a strong and growing emphasis on Saudi Arabia's rapidly expanding logistics sector.
              </p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(15px,1.55vw,17px)',
                lineHeight: 1.9, color: 'rgba(255,255,255,0.68)',
                letterSpacing: '0.012em',
              }}>
                With our HQ in Dubai and established operations in Saudi Arabia, China, and India, Bejoice is strategically positioned to support the Kingdom's vision of becoming a global logistics hub under Vision 2030. We specialize in heavy lift and project cargo — every movement carefully engineered with full accountability from origin to final delivery, supporting the Kingdom's mega-projects and industrial growth requirements.
              </p>

            </div>

            {/* RIGHT — capabilities card */}
            <div className="fade-up">
              <div style={{
                background: 'linear-gradient(145deg,rgba(255,255,255,0.028) 0%,rgba(91,194,231,0.025) 100%)',
                border: '1px solid rgba(91,194,231,0.16)',
                borderTop: '1px solid rgba(91,194,231,0.3)',
                borderRadius: 16,
                padding: 'clamp(1.4rem,2.2vw,2rem) clamp(1.2rem,2vw,1.8rem)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 32px rgba(0,0,0,0.4)',
                position: 'relative', overflow: 'hidden',
                height: '100%',
              }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: 'linear-gradient(90deg,transparent,rgba(91,194,231,0.45) 50%,transparent)',
                }} />

                <h3 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.4rem,2.5vw,2rem)',
                  letterSpacing: '0.1em', lineHeight: 1,
                  color: '#ffffff',
                  margin: '0 0 clamp(1rem,1.6vw,1.4rem)',
                }}>
                  <span style={{ color: '#ffffff' }}>OUR </span>
                  <span style={{ color: '#5BC2E7' }}>CAPABILITIES</span>
                </h3>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {CAPABILITIES.map((cap, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start',
                      gap: 12, padding: 'clamp(0.6rem,1vw,0.85rem) 0',
                      borderBottom: i < CAPABILITIES.length - 1
                        ? '1px solid rgba(91,194,231,0.07)' : 'none',
                    }}>
                      <div style={{
                        width: 6, height: 6, minWidth: 6, borderRadius: '50%',
                        background: '#5BC2E7', boxShadow: '0 0 8px rgba(91,194,231,0.5)',
                        marginTop: 6, flexShrink: 0,
                      }} />
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 'clamp(13px,1.2vw,15px)',
                        color: 'rgba(255,255,255,0.75)', lineHeight: 1.6,
                        letterSpacing: '0.01em',
                      }}>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── FOUNDING MEMBERS DIVIDER ── */}
          <div className="fade-up" style={{
            position: 'relative', zIndex: 2,
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 'clamp(2rem,3.5vw,3rem)',
          }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(91,194,231,0.2) 50%)' }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 10, letterSpacing: '0.36em', textTransform: 'uppercase',
              color: 'rgba(91,194,231,0.6)', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
            }}>Founding Members — Bejoice KSA</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(91,194,231,0.2) 50%,transparent)' }} />
          </div>

          {/* ── TEAM CARDS ── */}
          <div className="wb-team-grid" style={{ position: 'relative', zIndex: 2 }}>
            {TEAM.map(({ name, role, initials }, i) => (
              <div key={name} className="wb-team-card fade-up">

                {/* Avatar ring */}
                <div style={{
                  width: 'clamp(88px,11vw,120px)', height: 'clamp(88px,11vw,120px)',
                  borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(145deg,rgba(91,194,231,0.15),rgba(24,54,80,0.9))',
                  boxShadow: '0 0 0 2px rgba(91,194,231,0.35), 0 0 24px rgba(91,194,231,0.15), 0 0 0 5px rgba(91,194,231,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: `wbRingPulse ${3.5 + i * 0.4}s ease-in-out infinite`,
                }}>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(1.6rem,2.5vw,2.2rem)',
                    letterSpacing: '0.1em',
                    color: 'rgba(91,194,231,0.85)',
                    textShadow: '0 0 20px rgba(91,194,231,0.4)',
                  }}>{initials}</span>
                </div>

                {/* Name + role */}
                <div style={{ textAlign: 'center', marginTop: 'clamp(0.9rem,1.5vw,1.2rem)' }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 'clamp(1rem,1.6vw,1.35rem)',
                    letterSpacing: '0.1em', color: '#ffffff', lineHeight: 1.1,
                    marginBottom: 6,
                    textShadow: '0 0 20px rgba(255,255,255,0.1)',
                  }}>{name}</div>
                  <div style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(10px,0.9vw,12px)',
                    letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: 'rgba(91,194,231,0.8)', fontWeight: 600,
                  }}>{role}</div>
                </div>

                {/* Bottom accent */}
                <div style={{
                  width: 'clamp(22px,3vw,36px)', height: 1,
                  background: 'linear-gradient(90deg,transparent,rgba(91,194,231,0.45),transparent)',
                  margin: 'clamp(0.7rem,1vw,0.9rem) auto 0',
                }} />
              </div>
            ))}
          </div>

        </div>{/* end prestige card */}
      </div>

      <style>{`
        @keyframes wbRingPulse {
          0%,100% { box-shadow:0 0 0 2px rgba(91,194,231,0.32),0 0 18px rgba(91,194,231,0.12),0 0 0 5px rgba(91,194,231,0.06); }
          50%      { box-shadow:0 0 0 3px rgba(91,194,231,0.58),0 0 30px rgba(91,194,231,0.28),0 0 0 7px rgba(91,194,231,0.1); }
        }
      `}</style>
    </section>
  )
}
