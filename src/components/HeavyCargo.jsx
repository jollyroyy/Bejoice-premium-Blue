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

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px 0px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex flex-col md:flex-row-reverse md:items-end md:justify-between mb-10 md:mb-16 lg:mb-20 gap-6 md:gap-8"
        >
          <div className="text-right">
            <div className="section-num mb-5 justify-end flex">02 — Heavy & Project Cargo</div>
            <h2 className="section-headline">
              <span className="shine-text" data-text="ENGINEERED">ENGINEERED</span><br />
              <span className="accent shine-text shine-gold" data-text="FOR THE IMPOSSIBLE">FOR THE IMPOSSIBLE</span>
            </h2>
          </div>
          <p className="body-text max-w-sm text-right md:text-left">
            From mega-project turbines to out-of-gauge industrial modules — Bejoice delivers the technical expertise, specialised equipment, and regulatory precision to move what others can't.
          </p>
        </motion.div>

        <div className="gold-line mb-20" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'rgba(200,168,78,0.12)' }}>
          {capabilities.map((c, i) => (
            <div key={c.num}
              ref={el => cardsRef.current[i] = el}
              className="fade-up glass-card p-6 md:p-8 lg:p-10 group cursor-default"
              style={{ transitionDelay: `${i * 75}ms` }}
            >
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px, 8vw, 56px)',
                lineHeight: 1, letterSpacing: '0.06em',
                color: 'rgba(200,168,78,0.12)', marginLeft: '-4px', marginBottom: '16px',
                transition: 'color 0.4s',
              }} className="group-hover:!text-gold/25">
                {c.num}
              </div>
              <div className="mb-6 transition-transform duration-300 group-hover:scale-110 origin-left">
                {c.icon}
              </div>
              <h3 className="card-title mb-4">{c.title}</h3>
              <p className="card-body">{c.desc}</p>
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
