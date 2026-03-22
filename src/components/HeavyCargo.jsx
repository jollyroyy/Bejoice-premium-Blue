import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const capabilities = [
  {
    num: '01',
    title: 'Heavy Lift / ODC / OOG Transportation',
    desc: 'Conventional Hydraulic Axles for transporting heavy equipment such as wind turbines, transformers, generators, industrial machinery, construction components, and large project cargo.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10">
        <rect x="2" y="28" width="36" height="10" rx="1"/>
        <circle cx="10" cy="40" r="4"/><circle cx="20" cy="40" r="4"/><circle cx="30" cy="40" r="4"/>
        <path d="M38 33h6v5h-6z"/><circle cx="41" cy="40" r="3"/>
        <rect x="8" y="20" width="22" height="8" rx="1" strokeDasharray="2 1"/>
        <path d="M12 20v-4M22 20v-6M30 20v-3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Route Survey Feasibility Study',
    desc: 'Detailed physical inspection and analysis of the entire transportation route from the pickup location to the final delivery site.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10">
        <path d="M24 4v6M24 38v6M4 24h6M38 24h6" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="10"/>
        <path d="M24 14v10l7 4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 8l3 5M30 8l-3 5" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Route Modification for ODC Transportation',
    desc: 'Removal or adjustment of obstacles such as traffic signals, road signs, guardrails, overhead cables, streetlights, and bypass construction for safe transportation.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10">
        <path d="M8 40L24 10L40 40H8Z" strokeLinejoin="round"/>
        <path d="M24 24v8M24 34v2" strokeLinecap="round" strokeWidth="2"/>
        <path d="M4 44h40" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Custom Clearance & Brokeraging',
    desc: 'Expert handling of documentation and customs regulations to ensure smooth clearance and minimize transit delays across all KSA ports of entry.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10">
        <rect x="10" y="6" width="28" height="36" rx="2"/>
        <path d="M16 16h16M16 22h16M16 28h10" strokeLinecap="round"/>
        <circle cx="34" cy="34" r="7" fill="#050508" strokeWidth="1.5"/>
        <path d="M30 34l3 3 5-6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Onsite Jacking & Skidding',
    desc: 'Lift heavy equipment such as transformers and reactors, while skidding systems allow cargo to be horizontally moved along specially designed tracks or skid beams.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10">
        <rect x="6" y="30" width="36" height="6" rx="1"/>
        <path d="M14 30V18h20v12" strokeLinejoin="round"/>
        <path d="M18 18V12h12v6" strokeLinejoin="round"/>
        <path d="M6 36h36M10 38v4M22 38v4M38 38v4" strokeLinecap="round" opacity="0.6"/>
        <path d="M20 14h8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Technical Engineering Solutions',
    desc: 'Technical analysis and planning for lifting, loading, securing, and transporting heavy cargo safely — including lift plans, load distribution calculations, and structural analysis.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10">
        <rect x="4" y="10" width="40" height="28" rx="2"/>
        <path d="M10 30l6-8 6 6 6-10 6 8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 20h40" opacity="0.3"/>
        <circle cx="16" cy="22" r="1.5" fill="#c8a84e"/>
        <circle cx="28" cy="18" r="1.5" fill="#c8a84e"/>
        <circle cx="22" cy="28" r="1.5" fill="#c8a84e"/>
        <circle cx="34" cy="26" r="1.5" fill="#c8a84e"/>
      </svg>
    ),
  },
]

export default function HeavyCargo() {
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    cardsRef.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="heavy-cargo" className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(200,168,78,0.05) 0%, transparent 55%)' }} />

      <div className="max-w-7xl mx-auto">

        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(200,168,78,0.018) 100%)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderTop: '1px solid rgba(200,168,78,0.22)',
          borderRadius: 28,
          boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,168,78,0.04) inset, 0 2px 0 rgba(200,168,78,0.15) inset, inset 0 0 80px rgba(200,168,78,0.015)',
          overflow: 'hidden', position: 'relative',
          padding: 'clamp(24px,3.5vw,48px)',
        }}>
          {/* Meteor shower background */}
          <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', borderRadius:28 }}>
            {[
              { left:'8%',  top:'-8%',  delay:'0s',   dur:'3.8s', w:1.5, len:120 },
              { left:'22%', top:'-15%', delay:'1.2s', dur:'4.5s', w:1,   len:90  },
              { left:'38%', top:'-5%',  delay:'2.6s', dur:'3.2s', w:2,   len:150 },
              { left:'51%', top:'-20%', delay:'0.7s', dur:'5.0s', w:1,   len:80  },
              { left:'65%', top:'-10%', delay:'3.4s', dur:'3.6s', w:1.5, len:110 },
              { left:'75%', top:'-3%',  delay:'1.8s', dur:'4.2s', w:1,   len:95  },
              { left:'88%', top:'-18%', delay:'0.3s', dur:'4.8s', w:2,   len:130 },
              { left:'14%', top:'-25%', delay:'4.1s', dur:'3.5s', w:1,   len:85  },
              { left:'56%', top:'-12%', delay:'2.0s', dur:'4.0s', w:1.5, len:105 },
              { left:'92%', top:'-8%',  delay:'3.0s', dur:'3.9s', w:1,   len:70  },
            ].map((m, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: m.left, top: m.top,
                width: `${m.w}px`, height: `${m.len}px`,
                background: `linear-gradient(180deg, rgba(255,215,105,0) 0%, rgba(255,215,105,0.55) 40%, rgba(200,168,78,0.85) 70%, rgba(255,255,255,0.5) 100%)`,
                borderRadius: '999px',
                transform: 'rotate(15deg)',
                transformOrigin: 'top center',
                animation: `meteorFall ${m.dur} linear ${m.delay} infinite`,
                opacity: 0,
              }} />
            ))}
            <style>{`
              @keyframes meteorFall {
                0%   { transform: rotate(15deg) translateY(0);    opacity: 0; }
                5%   { opacity: 1; }
                80%  { opacity: 0.6; }
                100% { transform: rotate(15deg) translateY(110vh); opacity: 0; }
              }
            `}</style>
          </div>

          {/* Shining border strips — all four sides */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, zIndex:3, pointerEvents:'none',
            background:'linear-gradient(90deg, transparent 0%, rgba(200,168,78,0.3) 20%, rgba(255,215,105,0.95) 50%, rgba(200,168,78,0.3) 80%, transparent 100%)',
            backgroundSize:'200% 100%', animation:'borderSweepH 4s ease-in-out infinite',
          }}/>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, zIndex:3, pointerEvents:'none',
            background:'linear-gradient(90deg, transparent 0%, rgba(200,168,78,0.3) 20%, rgba(255,215,105,0.95) 50%, rgba(200,168,78,0.3) 80%, transparent 100%)',
            backgroundSize:'200% 100%', animation:'borderSweepH 4s ease-in-out infinite 2s',
          }}/>
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, zIndex:3, pointerEvents:'none',
            background:'linear-gradient(180deg, transparent 0%, rgba(200,168,78,0.3) 20%, rgba(255,215,105,0.95) 50%, rgba(200,168,78,0.3) 80%, transparent 100%)',
            backgroundSize:'100% 200%', animation:'borderSweepV 4s ease-in-out infinite 1s',
          }}/>
          <div style={{ position:'absolute', right:0, top:0, bottom:0, width:2, zIndex:3, pointerEvents:'none',
            background:'linear-gradient(180deg, transparent 0%, rgba(200,168,78,0.3) 20%, rgba(255,215,105,0.95) 50%, rgba(200,168,78,0.3) 80%, transparent 100%)',
            backgroundSize:'100% 200%', animation:'borderSweepV 4s ease-in-out infinite 3s',
          }}/>
          <style>{`
            @keyframes borderSweepH {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
            @keyframes borderSweepV {
              0% { background-position: center 200%; }
              100% { background-position: center -200%; }
            }
          `}</style>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mb-10 md:mb-16 lg:mb-20 flex flex-col items-end"
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            width: '100%', padding: 0,
            textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
          }}>
            <motion.h2
              className="no-reveal"
              initial={{ x: -70, opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true, margin: '-80px 0px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(3rem,7vw,6rem)',
                letterSpacing: '0.07em', lineHeight: 1,
                margin: 0,
                background: 'linear-gradient(100deg, #ffffff 0%, rgba(255,255,255,0.9) 25%, rgba(255,215,105,1) 45%, #ffffff 55%, rgba(255,215,105,1) 75%, rgba(200,168,78,0.9) 100%)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(200,168,78,0.3))',
                animation: 'headingSweep 4s ease-in-out infinite',
              }}
            >
              CONSULTING FOR<br />GIGA PROJECTS
            </motion.h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(14px,1.6vw,17px)',
              color: 'rgba(255,255,255,0.7)',
              marginTop: '16px', marginBottom: 0, maxWidth: '520px', lineHeight: 1.7,
            }}>
              End-to-end project cargo logistics for Saudi Arabia's most ambitious giga-developments — from NEOM to the Red Sea Project.
            </p>
            <style>{`
              @keyframes headingSweep {
                0%   { background-position: -100% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
          </div>
        </motion.div>

        <div className="gold-line mb-20" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(200,168,78,0.12)', perspective: '1200px', position: 'relative', zIndex: 1 }}>
          {capabilities.map((c, i) => (
            <motion.div key={c.num}
              ref={el => cardsRef.current[i] = el}
              className="fade-up p-6 md:p-8 lg:p-10 group cursor-default"
              style={{ borderTop: '1px solid rgba(200,168,78,0.1)' }}
              style={{ transitionDelay: `${i * 75}ms` }}
              whileHover={{
                rotateY: i % 2 === 0 ? 3 : -3,
                rotateX: -2,
                z: 18,
                transition: { type: 'spring', stiffness: 280, damping: 22 }
              }}
            >
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 origin-left">
                {c.icon}
              </div>
              <h3 className="card-title mb-4">{c.title}</h3>
              <p className="card-body">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        </div>{/* end outer glass-card */}
      </div>
    </section>
  )
}
