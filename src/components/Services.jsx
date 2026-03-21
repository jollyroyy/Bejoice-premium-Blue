import { useEffect, useRef } from 'react'

const services = [
  {
    num: '01', title: 'Air Freight',
    desc: 'Time-critical global air cargo with priority handling and real-time tracking. Express and charter options available.',
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10"><path d="M6 24L42 12L30 36L22 28L6 24Z" strokeLinejoin="round"/><path d="M22 28L24 42" strokeLinecap="round"/></svg>),
  },
  {
    num: '02', title: 'Sea Freight',
    desc: 'FCL and LCL ocean freight worldwide. Deep expertise in GCC port operations and customs clearance.',
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10"><path d="M8 30L12 18H36L40 30" strokeLinejoin="round"/><path d="M4 34C8 30 12 38 16 34C20 30 24 38 28 34C32 30 36 38 40 34" strokeLinecap="round"/><rect x="20" y="10" width="8" height="8" rx="0.5"/></svg>),
  },
  {
    num: '03', title: 'Road Transport',
    desc: 'Cross-border trucking across the GCC and beyond. Dedicated fleet with GPS tracking and temperature control.',
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10"><rect x="4" y="18" width="28" height="16" rx="1"/><path d="M32 24H40L44 30V34H32V24Z"/><circle cx="12" cy="36" r="4"/><circle cx="36" cy="36" r="4"/></svg>),
  },
  {
    num: '04', title: 'Customs Clearance',
    desc: 'ZATCA-certified customs brokerage. Seamless import/export documentation and full regulatory compliance.',
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10"><rect x="10" y="6" width="28" height="36" rx="2"/><path d="M16 16H32M16 22H32M16 28H26" strokeLinecap="round"/><circle cx="34" cy="34" r="7" fill="#050508" strokeWidth="1.5"/><path d="M30 34L33 37L38 31" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  },
  {
    num: '05', title: 'Warehousing',
    desc: 'Strategically located bonded warehouses across Saudi Arabia with advanced inventory management systems.',
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10"><path d="M4 20L24 8L44 20V42H4V20Z"/><rect x="18" y="28" width="12" height="14" rx="0.5"/><rect x="8" y="24" width="8" height="8" rx="0.5"/><rect x="32" y="24" width="8" height="8" rx="0.5"/></svg>),
  },
  {
    num: '06', title: 'Project Cargo',
    desc: 'Heavy-lift and out-of-gauge logistics. From oil & gas equipment to industrial machinery — we handle complexity.',
    icon: (<svg viewBox="0 0 48 48" fill="none" stroke="#c8a84e" strokeWidth="1.3" className="w-10 h-10"><path d="M6 36L16 20L28 28L38 12" strokeLinecap="round" strokeLinejoin="round"/><path d="M32 12H38V18" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="40" r="3"/><circle cx="24" cy="40" r="3"/><circle cx="40" cy="40" r="3"/></svg>),
  },
]

export default function Services() {
  const sectionRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }) },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    cardsRef.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="services" className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(200,168,78,0.05) 0%, transparent 55%)' }} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 md:mb-16 lg:mb-20 gap-6 md:gap-8">
          <div>
            <div className="section-num mb-5">01 — What We Do</div>
            <h2 className="section-headline">
              <span className="shine-text" data-text="OUR">OUR</span><br />
              <span className="accent shine-text shine-gold" data-text="SERVICES">SERVICES</span>
            </h2>
          </div>
        </div>

        <div className="gold-line mb-20" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(200,168,78,0.12)' }}>
          {services.map((s, i) => (
            <div key={s.num}
              ref={el => cardsRef.current[i] = el}
              className="fade-up glass-card p-6 md:p-8 lg:p-10 group cursor-default"
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 8vw, 56px)', lineHeight: 1, letterSpacing: '0.06em', color: 'rgba(200,168,78,0.12)', marginLeft: '-4px', marginBottom: '16px', transition: 'color 0.4s' }}
                className="group-hover:!text-gold/25">
                {s.num}
              </div>
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 origin-left">
                {s.icon}
              </div>
              <h3 className="card-title mb-4">{s.title}</h3>
              <p className="card-body">{s.desc}</p>
              <div className="flex items-center gap-3 mt-8 transition-all duration-300"
                style={{ color: 'rgba(200,168,78,0.5)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c8a84e'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(200,168,78,0.5)'}
              >
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 500 }}>Learn More</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
