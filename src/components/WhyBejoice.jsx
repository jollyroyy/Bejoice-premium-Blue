import { useEffect, useRef } from 'react'

const pillars = [
  { icon: '◈', title: 'ZATCA Certified', desc: 'Fully compliant with Saudi Zakat, Tax and Customs Authority — ensuring zero delays at border crossings.' },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          {/* Left */}
          <div>
            <div className="fade-up">
              <div className="section-num mb-5">02 — Our Edge</div>
              <h2 className="section-headline mb-8">
                <span className="shine-text" data-text="WHY">WHY</span><br />
                <span className="accent shine-text shine-gold" data-text="BEJOICE">BEJOICE</span>
              </h2>
              <p className="body-text max-w-sm">
                Decades of experience meeting the demands of one of the world's most dynamic logistics corridors — with the discipline of a global operator.
              </p>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(80px, 18vw, 160px)', lineHeight: 1, letterSpacing: '0.05em', color: 'rgba(200,168,78,0.06)', userSelect: 'none', marginTop: '16px', marginLeft: '-8px' }}>
                18
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,168,78,0.55)', marginTop: '-24px' }}>
                Years of Excellence
              </div>
            </div>
          </div>

          {/* Right: pillars */}
          <div className="space-y-px">
            {pillars.map((p, i) => (
              <div key={p.title}
                className="fade-up glass-card group p-8 flex gap-6 items-start"
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div style={{ fontSize: '28px', color: '#c8a84e', flexShrink: 0, marginTop: '2px', transition: 'transform 0.3s' }}
                  className="group-hover:scale-110">
                  {p.icon}
                </div>
                <div>
                  <h3 className="card-title mb-3">{p.title}</h3>
                  <p className="card-body">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
