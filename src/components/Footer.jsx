const footerLinks = {
  Services: ['Air Freight', 'Sea Freight', 'Road Transport', 'Customs Clearance', 'Warehousing', 'Project Cargo'],
  Company: ['About Bejoice', 'Certifications', 'Key Markets', 'Careers', 'News'],
  Support: ['Track Shipment', 'Get a Quote', 'Contact Us', 'Port Offices'],
}

export default function Footer() {
  return (
    <footer className="relative border-t pt-20 pb-10 px-6 md:px-12 lg:px-24 overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(200,168,78,0.05) 0%, transparent 60%)' }}/>
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                <polygon points="16,2 30,26 2,26" stroke="#c8a84e" strokeWidth="1.5" fill="none"/>
                <polygon points="16,8 26,24 6,24" fill="#c8a84e" opacity="0.2"/>
              </svg>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '0.22em', color: '#ffffff' }}>BEJOICE</span>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '28px' }}>
              Premium global freight forwarding and logistics solutions. Trusted by industry leaders across Saudi Arabia and beyond since 2006.
            </p>
            <div className="flex gap-3">
              {['LI', 'X', 'WA'].map(s => (
                <button key={s} style={{ width: '36px', height: '36px', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', background: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(200,168,78,0.5)'; e.target.style.color = '#c8a84e' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.color = 'rgba(255,255,255,0.4)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(200,168,78,0.7)', fontWeight: 600, marginBottom: '20px' }}>{category}</div>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={e => e.target.style.color = '#ffffff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                    >{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="gold-line mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.3)' }}>
            © 2025 Bejoice Global Logistics LLC. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.28)', textDecoration: 'none', letterSpacing: '0.05em', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.28)'}
              >{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2aaa5e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>All Systems Operational</span>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(60px,12vw,120px)', lineHeight: 1, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.02)' }}>
          BEJOICE
        </div>
      </div>
    </footer>
  )
}
