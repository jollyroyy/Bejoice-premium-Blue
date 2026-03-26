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
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 60% 0%, rgba(200,168,78,0.06) 0%, transparent 50%)' }}/>

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mb-20"
        >
          <div style={{ display: 'inline-block' }}>
            <h2 style={{
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
            }}>
              CERTIFIED<br />TO DELIVER
            </h2>
            <style>{`
              @keyframes headingSweep {
                0%   { background-position: -100% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(200,168,78,0.10)', perspective: '1200px' }}>
          {certs.map((c, i) => (
            <motion.div key={c.code}
              className="fade-up glass-card p-6 md:p-8 lg:p-10 group cursor-default relative overflow-hidden"
              style={{ transitionDelay: `${i * 65}ms` }}
              whileHover={{
                rotateY: i % 3 === 0 ? 4 : i % 3 === 1 ? -2 : 3,
                rotateX: -2,
                z: 20,
                transition: { type: 'spring', stiffness: 280, damping: 22 }
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${c.color}90, transparent)` }}/>
              <div className="inline-flex items-center px-3 py-1.5 mb-6"
                style={{ background: `${c.color}18`, border: `1.5px solid ${c.color}50`, borderRadius: 0 }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.2em', color: c.color }}>
                  {c.code}
                </span>
              </div>
              <h3 className="card-title mb-4 leading-tight">{c.name}</h3>
              <p className="card-body">{c.desc}</p>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 100%, ${c.color}0a 0%, transparent 65%)` }}/>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
