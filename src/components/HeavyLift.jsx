export default function HeavyLift() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #06080f 0%, #0a0e1a 45%, #060508 100%)',
      padding: 'clamp(80px, 12vw, 140px) clamp(1.5rem, 8vw, 8rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-5%', right: '5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,168,78,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: '450px', height: '450px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(80,30,10,0.12) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      {/* Subtle diagonal rule */}
      <div style={{
        position: 'absolute', top: 0, right: '30%',
        width: '1px', height: '100%',
        background: 'linear-gradient(180deg, transparent, rgba(200,168,78,0.08), transparent)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Glass Header Block */}
          <div className="section-glass-header" style={{ display: 'inline-block', marginBottom: '48px' }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <div style={{ width: '44px', height: '1.5px', background: '#c8a84e', flexShrink: 0 }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '12px',
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: '#c8a84e', fontWeight: 600,
              }}>
                Heavy Lift · ODC · OOG · Project Cargo
              </span>
            </div>

            {/* Main heading */}
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
              lineHeight: 0.92, letterSpacing: '0.06em',
              margin: '0',
              color: '#ffffff',
              textShadow: '0 2px 32px rgba(0,0,0,0.5)',
              cursor: 'default',
            }}>
              <span className="shine-text" data-text="WHEN THE LOAD">WHEN THE LOAD</span>
            </h2>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
              lineHeight: 0.92, letterSpacing: '0.06em',
              margin: '0 0 24px',
              color: '#c8a84e',
              textShadow: '0 2px 32px rgba(200,168,78,0.2)',
              cursor: 'default',
            }}>
              <span style={{ color: 'rgba(200,168,78,0.78)' }}>DEFIES LIMITS</span>
            </h2>

            {/* Gold divider */}
            <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #c8a84e, transparent)', marginBottom: '24px' }} />

            {/* Subheading */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(17px, 2.2vw, 24px)',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: 1.5,
              maxWidth: '680px',
              marginBottom: '16px',
              textShadow: '0 1px 16px rgba(0,0,0,0.8)',
            }}>
              Saudi Arabia's most demanding projects trust Bejoice to move what others won't touch.
            </p>

            {/* Body */}
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(16px, 1.8vw, 19px)',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.88)',
              lineHeight: 1.85,
              maxWidth: '620px',
              margin: 0,
            }}>
              From hydraulic axle convoys navigating KSA's most complex routes to precision onsite jacking,
              skidding, and technical engineering — we deliver the full spectrum of heavy lift and
              out-of-gauge logistics, backed by{' '}
              <strong style={{ color: '#c8a84e' }}>25+ years of project cargo expertise</strong> and
              end-to-end customs clearance built for Saudi Arabia's regulatory environment.
            </p>
          </div>

          {/* Capability tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              'Hydraulic Axle Transport',
              'OOG & ODC Cargo',
              'Route Survey & Modification',
              'Onsite Jacking & Skidding',
              'Customs Brokeraging',
              'Technical Engineering',
              'Lift Plans & Load Calc',
              'Wind Turbines & Transformers',
            ].map(tag => (
              <span key={tag} style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px', letterSpacing: '0.15em',
                textTransform: 'uppercase', fontWeight: 600,
                color: 'rgba(200,168,78,0.85)',
                border: '1px solid rgba(200,168,78,0.25)',
                borderRadius: '2px',
                padding: '6px 14px',
                background: 'rgba(200,168,78,0.04)',
              }}>
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
