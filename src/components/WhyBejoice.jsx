import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const pillars = [
{ icon: '◉', title: 'Real-Time Visibility', desc: 'End-to-end shipment tracking with live status updates, proactive alerts, and dedicated account managers.' },
  { icon: '◆', title: 'GCC Network', desc: 'Deeply rooted partnerships with port authorities, carriers, and customs brokers across all GCC countries.' },
  { icon: '◐', title: 'Risk Management', desc: 'Comprehensive cargo insurance and contingency planning to protect your supply chain at every stage.' },
]

export default function WhyBejoice() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'))
        })
      },
      { threshold: 0.08 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="why-us" ref={sectionRef} className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(200,168,78,0.03) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(200,168,78,0.03) 80px)`,
      }}/>

      <div className="max-w-7xl mx-auto">

        {/* Outer card with meteor background */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(200,168,78,0.018) 100%)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(200,168,78,0.28)',
          borderTop: '1px solid rgba(200,168,78,0.55)',
          borderRadius: 28,
          boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(200,168,78,0.06) inset, inset 0 1px 0 rgba(255,215,105,0.22), 0 0 50px rgba(200,168,78,0.06)',
          overflow: 'hidden', position: 'relative',
          padding: 'clamp(24px,3.5vw,48px)',
        }}>

          {/* Ambient light layers (matches Request a Private Quote) */}
          <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', borderRadius:28 }}>
            <div style={{
              position:'absolute', inset:0,
              background:'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(200,168,78,0.1) 0%, transparent 60%)',
            }}/>
            <div style={{
              position:'absolute', bottom:'-10%', right:'-5%',
              width:'clamp(300px,50vw,600px)', height:'clamp(300px,50vw,600px)', borderRadius:'50%',
              background:'radial-gradient(circle, rgba(200,168,78,0.04) 0%, transparent 65%)',
            }}/>
            <div style={{
              position:'absolute', inset:0, opacity:0.4,
              backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(200,168,78,0.02) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(200,168,78,0.02) 60px)',
            }}/>
          </div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start" style={{ position:'relative', zIndex:1 }}>
          {/* Left */}
          <div>
            <div>
              <div style={{ marginBottom: '2rem' }}>
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
                    color: '#ffffff',
                    filter: 'drop-shadow(0 0 30px rgba(200,168,78,0.3))',
                  }}
                >
                  <span style={{ color: '#ffffff' }}>WHY</span><br /><span style={{ color: '#c8a84e' }}>BEJOICE</span>
                </motion.h2>
                <style>{`
                  @keyframes headingSweep {
                    0%   { background-position: -100% center; }
                    100% { background-position: 200% center; }
                  }
                `}</style>
              </div>

            </div>
          </div>

          {/* Right: pillars */}
          <div className="space-y-px" style={{ perspective: '1000px' }}>
            {pillars.map((p, i) => (
              <motion.div key={p.title}
                className="fade-up group p-8 flex gap-6 items-start"
                style={{ borderTop: '1px solid rgba(200,168,78,0.1)', transitionDelay: `${i * 90}ms` }}
                whileHover={{
                  rotateX: -2,
                  rotateY: 4,
                  z: 16,
                  transition: { type: 'spring', stiffness: 280, damping: 22 }
                }}
              >
                <motion.div
                  style={{ fontSize: 'clamp(22px,3vw,32px)', color: '#c8a84e', flexShrink: 0, marginTop: '2px' }}
                  whileHover={{ rotate: 15, scale: 1.15 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                >
                  {p.icon}
                </motion.div>
                <div>
                  <h3 className="card-title mb-3">{p.title}</h3>
                  <p className="card-body">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        </div>{/* end outer card */}

      </div>
    </section>
  )
}
