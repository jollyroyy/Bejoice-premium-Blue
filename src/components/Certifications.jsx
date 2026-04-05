import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const certs = [
  { code: 'ZATCA', name: 'Zakat, Tax & Customs Authority', desc: 'Certified customs broker recognized by Saudi Arabia\'s ZATCA for seamless import/export compliance.', color: '#2aaa5e' },
  { code: 'ISO 9001', name: 'Quality Management', desc: 'ISO 9001:2015 certified — demonstrating our commitment to consistent quality processes across all operations.', color: '#c8a84e' },
  { code: 'FIATA', name: 'International Freight Forwarders', desc: 'Member of the International Federation of Freight Forwarders Associations — global network of 40,000+ companies.', color: '#5a9de8' },
  { code: 'IATA', name: 'Air Transport Association', desc: "IATA certified air cargo agent with full access to IATA's global carrier network and airway bill issuance.", color: '#e85a5a' },
  { code: 'AEO', name: 'Authorized Economic Operator', desc: 'AEO status granted by Saudi Customs — enabling expedited border crossings and trusted trader benefits.', color: '#a05ae8' },
  { code: 'SASO', name: 'Saudi Standards Authority', desc: 'SASO-compliant handling ensuring all goods meet Saudi product standards and conformity requirements.', color: '#e89a5a' },
]

export default function Certifications() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.querySelectorAll('.fade-up').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 65)
          })
        })
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="certifications" ref={sectionRef} className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(200,168,78,0.07) 0%, transparent 50%)' }}/>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(200,168,78,0.02) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(200,168,78,0.02) 80px)',
      }}/>

      {/* Watermark */}
      <div style={{
        position: 'absolute', left: '-0.5rem', bottom: '-1rem',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(100px,20vw,240px)',
        lineHeight: 1, color: 'rgba(200,168,78,0.025)', pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.04em',
      }}>CERTIFIED</div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mb-20"
        >
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: '1.5px', background: '#c8a84e' }} />
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, letterSpacing: '0.35em', textTransform: 'uppercase', color: '#c8a84e', fontWeight: 600 }}>
              Industry Accreditations
            </span>
          </div>
          <h2 className="hg" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(3rem,7vw,6rem)',
            letterSpacing: '0.07em', lineHeight: 1,
            margin: 0,
            color: '#ffffff',
            filter: 'drop-shadow(0 0 30px rgba(200,168,78,0.25))',
          }}>
            <span style={{ color: '#ffffff' }}>CERTIFIED</span><br /><span style={{ color: '#c8a84e' }}>TO DELIVER</span>
          </h2>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, #c8a84e, transparent)', marginTop: 20 }} />
        </motion.div>

        {/* ── Cert grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(200,168,78,0.10)', perspective: '1200px', borderRadius: 4, overflow: 'hidden' }}>
          {certs.map((c, i) => (
            <motion.div key={c.code}
              className="fade-up group cursor-default relative overflow-hidden"
              style={{
                transitionDelay: `${i * 65}ms`,
                background: 'linear-gradient(145deg, rgba(8,8,18,0.98) 0%, rgba(12,10,22,0.98) 100%)',
                padding: 'clamp(1.6rem,3vw,2.6rem)',
              }}
              whileHover={{
                rotateY: i % 3 === 0 ? 3 : i % 3 === 1 ? -2 : 3,
                rotateX: -2,
                z: 20,
                transition: { type: 'spring', stiffness: 280, damping: 22 }
              }}
            >
              {/* Animated top border */}
              <div className="absolute top-0 left-0 right-0" style={{ height: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  background: `linear-gradient(90deg, transparent 0%, ${c.color} 50%, transparent 100%)`,
                  animation: `certScan${i} 3s ease-in-out infinite`,
                }} />
              </div>

              {/* Corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
                style={{ background: `radial-gradient(circle at 100% 0%, ${c.color}15 0%, transparent 70%)` }}/>

              {/* Bottom hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 100%, ${c.color}12 0%, transparent 65%)` }}/>

              {/* Badge */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '6px 14px 5px',
                  background: `${c.color}14`,
                  border: `1px solid ${c.color}45`,
                  borderRadius: 3,
                  position: 'relative', overflow: 'hidden',
                }}>
                  {/* Badge shimmer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `linear-gradient(90deg, transparent, ${c.color}20, transparent)`, animation: 'shimmerSlide 1.5s ease-in-out infinite' }}/>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.25em', color: c.color, position: 'relative', zIndex: 1 }}>
                    {c.code}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(13px,1.4vw,16px)',
                fontWeight: 700, letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.92)',
                marginBottom: 12, lineHeight: 1.35,
                transition: 'color 0.3s',
              }}
                className="group-hover:text-white"
              >{c.name}</h3>

              {/* Desc */}
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 'clamp(12px,1.2vw,14px)',
                color: 'rgba(255,255,255,0.52)',
                lineHeight: 1.75, margin: 0,
              }}>{c.desc}</p>

              {/* Bottom accent line */}
              <div className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ height: 1, background: `linear-gradient(90deg, ${c.color}40, transparent)` }}/>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        ${certs.map((c, i) => `
          @keyframes certScan${i} {
            0%,100% { opacity: 0.4; transform: scaleX(0.3) translateX(-100%); }
            50% { opacity: 1; transform: scaleX(1) translateX(0); }
          }
        `).join('')}
      `}</style>
    </section>
  )
}
