import { useEffect, useRef } from 'react'

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
        <div className="mb-20">
          <div className="section-num fade-up mb-5">04 — Trust & Compliance</div>
          <h2 className="fade-up section-headline">
            <span className="shine-text" data-text="CERTIFIED">CERTIFIED</span><br />
            <span className="accent shine-text shine-gold" data-text="TO DELIVER">TO DELIVER</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(200,168,78,0.10)' }}>
          {certs.map((c, i) => (
            <div key={c.code}
              className="fade-up glass-card p-6 md:p-8 lg:p-10 group cursor-default relative overflow-hidden"
              style={{ transitionDelay: `${i * 65}ms` }}
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
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-16 py-10 border-t border-b border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-12">
            {certs.map(c => (
              <span key={c.code} className="fade-up"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '0.28em', color: 'rgba(255,255,255,0.35)' }}>
                {c.code}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
