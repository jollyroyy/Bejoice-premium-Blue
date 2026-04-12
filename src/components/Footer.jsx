import { useState } from 'react'
import { useLang } from '../context/LangContext'
import ar from '../i18n/ar'

const footerLinks = {
  Company: ['About Bejoice', 'Certifications', 'Key Markets', 'Careers', 'News'],
  Support: ['Track Shipment', 'Get a Quote', 'Contact Us', 'Port Offices'],
}

const POLICIES = {
  'Privacy Policy': {
    updated: 'March 2026',
    sections: [
      {
        title: '1. Information We Collect',
        body: `We collect information you provide directly, such as name, company name, email address, phone number, and shipment details when you submit a quote request, contact form, or booking. We also automatically collect usage data including IP address, browser type, pages visited, and referring URLs via cookies and analytics tools.`,
      },
      {
        title: '2. How We Use Your Information',
        body: `We use your information to provide freight forwarding and logistics services, respond to inquiries, generate quotes, send service updates and marketing communications (with your consent), improve our website and services, and comply with applicable Saudi Arabian and international laws.`,
      },
      {
        title: '3. Data Sharing',
        body: `We do not sell your personal data. We may share it with trusted third-party partners (carriers, customs brokers, port agents) solely to fulfil your logistics requirements, and with service providers who assist us in operating our website under strict confidentiality agreements.`,
      },
      {
        title: '4. Data Retention',
        body: `We retain personal data for as long as necessary to provide our services and meet legal obligations under Saudi Arabian law (PDPL), typically no longer than 7 years for transactional records.`,
      },
      {
        title: '5. Your Rights',
        body: `Under the Saudi Personal Data Protection Law (PDPL), you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@bejoice.com.`,
      },
      {
        title: '6. Security',
        body: `We implement industry-standard technical and organisational measures to protect your data, including TLS encryption, access controls, and regular security reviews.`,
      },
      {
        title: '7. Contact',
        body: `Bejoice Global Logistics LLC\nKing Fahd Road, Al Olaya, Riyadh 11553, Saudi Arabia\nEmail: privacy@bejoice.com\nPhone: +966 11 XXX XXXX`,
      },
    ],
  },
  'Terms of Service': {
    updated: 'March 2026',
    sections: [
      {
        title: '1. Acceptance of Terms',
        body: `By accessing or using the Bejoice website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.`,
      },
      {
        title: '2. Services',
        body: `Bejoice provides freight forwarding, customs clearance, warehousing, heavy lift, and related logistics services. All services are subject to a separate service agreement or accepted quotation.`,
      },
      {
        title: '3. Quotations',
        body: `All quotes are estimates only and subject to change based on actual cargo dimensions, weight, regulatory requirements, and carrier tariffs. Confirmed rates are binding only when agreed in writing.`,
      },
      {
        title: '4. Liability',
        body: `Bejoice's liability for loss or damage to cargo is limited to the lesser of the actual value or the limits prescribed by applicable international conventions (CMR, Montreal Convention, Hague-Visby Rules). We strongly recommend adequate cargo insurance for all shipments.`,
      },
      {
        title: '5. Prohibited Goods',
        body: `You must not ship goods that are prohibited by Saudi Arabian law, destination country regulations, or international conventions, including but not limited to weapons, narcotics, and items on SASO or customs restricted lists.`,
      },
      {
        title: '6. Intellectual Property',
        body: `All content on this website — including text, graphics, logos, and software — is the property of Bejoice Global Logistics LLC and protected by Saudi and international intellectual property law.`,
      },
      {
        title: '7. Governing Law',
        body: `These Terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes shall be subject to the exclusive jurisdiction of the courts of Riyadh.`,
      },
    ],
  },
  'Cookie Policy': {
    updated: 'March 2026',
    sections: [
      {
        title: '1. What Are Cookies',
        body: `Cookies are small text files placed on your device by our website. They help us provide a personalised and efficient browsing experience.`,
      },
      {
        title: '2. Cookies We Use',
        body: `Essential Cookies: Required for the website to function (session management, security). These cannot be disabled.\n\nAnalytics Cookies: We use Google Analytics to understand how visitors use our site. All data is anonymised.\n\nFunctional Cookies: Remember your preferences such as language selection.\n\nMarketing Cookies: Used to show relevant advertisements and track campaign effectiveness (only with your consent).`,
      },
      {
        title: '3. Managing Cookies',
        body: `You can control and/or delete cookies through your browser settings. Disabling essential cookies may affect website functionality. For more information on managing cookies, visit www.allaboutcookies.org.`,
      },
      {
        title: '4. Third-Party Cookies',
        body: `Our website may include content from third-party services (Cal.com booking, embedded maps). These services may set their own cookies subject to their own privacy policies.`,
      },
      {
        title: '5. Updates',
        body: `We may update this Cookie Policy periodically. Continued use of our website after changes constitutes acceptance of the updated policy.`,
      },
      {
        title: '6. Contact',
        body: `If you have questions about our use of cookies, contact us at info@bejoice.com.`,
      },
    ],
  },
}

function PolicyModal({ title, onClose }) {
  const policy = POLICIES[title]
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(7,16,28,0.92)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        overflowY: 'auto', padding: 'clamp(16px,4vw,48px) clamp(12px,3vw,24px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: '740px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(91,194,231,0.2)',
          borderRadius: '16px',
          padding: 'clamp(24px,4vw,48px)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(1.8rem,4vw,3rem)',
            letterSpacing: '0.08em', color: '#ffffff', margin: 0,
          }}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              width: '36px', height: '36px', borderRadius: '8px',
              fontSize: '18px', flexShrink: 0, marginLeft: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(91,194,231,0.8)', marginBottom: '32px', letterSpacing: '0.05em' }}>
          Last updated: {policy.updated}
        </p>

        {/* Sections */}
        {policy.sections.map(s => (
          <div key={s.title} style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 'clamp(13px,1.6vw,16px)',
              color: 'rgba(255,255,255,0.95)', marginBottom: '10px',
            }}>{s.title}</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(13px,1.5vw,15px)',
              color: 'rgba(255,255,255,0.72)', lineHeight: 1.75,
              whiteSpace: 'pre-line', margin: 0,
            }}>{s.body}</p>
          </div>
        ))}

        <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px' }}>
          <button
            onClick={onClose}
            className="btn-gold"
            style={{ padding: '10px 32px' }}
          >Close</button>
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const [openPolicy, setOpenPolicy] = useState(null)

  return (
    <footer className="relative border-t pt-10 md:pt-20 pb-10 px-6 md:px-12 lg:px-24 overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(91,194,231,0.05) 0%, transparent 60%)' }}/>
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <picture>
                <source srcSet="https://bejoice-premium-assets.s3.ap-southeast-2.amazonaws.com/bejoice-logo-white.webp" type="image/webp" />
                <img src="https://bejoice-premium-assets.s3.ap-southeast-2.amazonaws.com/bejoice-logo-white.webp" alt="Bejoice" width="480" height="267" style={{ height: 'clamp(36px,5vw,56px)', width: 'auto' }} />
              </picture>
              <div style={{ borderLeft: '2px solid rgba(91,194,231,0.45)', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '15px', letterSpacing: '0.18em', color: '#ffffff' }}>BEJOICE</span>
                {isAr ? (
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#8DD8F0', letterSpacing: '0.04em' }}>{ar.footer.tagline}</span>
                ) : (
                  <span className="shine-ltr" data-text="Connecting KSA to the World" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#8DD8F0', letterSpacing: '0.04em' }}>Connecting KSA to the World</span>
                )}
              </div>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px,1.5vw,15px)', color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, maxWidth: '280px', marginBottom: '28px' }}>
              {isAr ? ar.footer.description : 'Premium global freight forwarding and logistics solutions. Trusted by industry leaders across Saudi Arabia and beyond since 2006.'}
            </p>
            <div className="flex gap-3">
              {['LI', 'X', 'WA'].map(s => (
                <button key={s} style={{ width: 'clamp(30px,4vw,40px)', height: 'clamp(30px,4vw,40px)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(9px,1.1vw,12px)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', background: 'none', cursor: 'pointer', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.target.style.borderColor = 'rgba(91,194,231,0.5)'; e.target.style.color = '#5BC2E7' }}
                  onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.color = 'rgba(255,255,255,0.4)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Company + Support links */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(9px,1.1vw,12px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(91,194,231,0.92)', fontWeight: 600, marginBottom: '20px' }}>
                {isAr ? (ar.footer.categories[category] || category) : category}
              </div>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px,1.5vw,15px)', color: 'rgba(255,255,255,0.72)', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={e => e.target.style.color = '#ffffff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.72)'}
                    >{isAr ? (ar.footer.links[item] || item) : item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Us */}
          <div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(9px,1.1vw,12px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(91,194,231,0.92)', fontWeight: 600, marginBottom: '20px' }}>{isAr ? ar.footer.categories['Contact Us'] : 'Contact Us'}</div>
            <ul className="space-y-4">
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg style={{ flexShrink: 0, marginTop: '3px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.7)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:+966110000000" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px,1.5vw,15px)', color: 'rgba(255,255,255,0.72)', textDecoration: 'none', transition: 'color 0.3s', lineHeight: 1.5 }}
                  onMouseEnter={e => e.target.style.color = '#ffffff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.72)'}
                >+966 11 XXX XXXX</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg style={{ flexShrink: 0, marginTop: '3px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.7)" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href="mailto:info@bejoice.com" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px,1.5vw,15px)', color: 'rgba(255,255,255,0.72)', textDecoration: 'none', transition: 'color 0.3s', lineHeight: 1.5 }}
                  onMouseEnter={e => e.target.style.color = '#ffffff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.72)'}
                >info@bejoice.com</a>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg style={{ flexShrink: 0, marginTop: '3px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.7)" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1.3vw,13px)', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
                  King Fahd Road, Al Olaya,<br/>Riyadh 11553, KSA
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg style={{ flexShrink: 0, marginTop: '3px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.7)" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <a href="mailto:quotes@bejoice.com" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px,1.5vw,15px)', color: 'rgba(91,194,231,0.75)', textDecoration: 'none', transition: 'color 0.3s', lineHeight: 1.5 }}
                  onMouseEnter={e => e.target.style.color = '#5BC2E7'}
                  onMouseLeave={e => e.target.style.color = 'rgba(91,194,231,0.75)'}
                >quotes@bejoice.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-line mb-10" />

        {/* ── Social badges: LinkedIn + Instagram ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/company/bejoice-shipping-llc/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '14px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, rgba(0,119,181,0.10) 0%, rgba(0,80,130,0.06) 100%)',
              border: '1px solid rgba(0,119,181,0.35)',
              borderRadius: '4px',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.35s, box-shadow 0.35s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,119,181,0.7)'
              e.currentTarget.style.boxShadow = '0 0 32px rgba(0,119,181,0.18), inset 0 0 20px rgba(0,119,181,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,119,181,0.35)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent, rgba(0,119,181,0.9), transparent)', animation: 'liSweep 3.5s ease-in-out infinite' }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 6, flexShrink: 0, background: 'linear-gradient(135deg, #0077B5 0%, #005983 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,119,181,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(13px,1.4vw,16px)', letterSpacing: '0.18em', color: '#ffffff', lineHeight: 1.1 }}>BEJOICE SHIPPING LLC</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(9px,1vw,11px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,169,255,0.75)', marginTop: 3, fontWeight: 600 }}>{isAr ? ar.footer.followLinkedIn : 'Follow on LinkedIn'}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4, flexShrink: 0, opacity: 0.6 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(0,169,255,0.8)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/bejoice_shipping?igsh=MWVtN2JtdzJuNTRjeA%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '14px',
              padding: '14px 24px',
              background: 'linear-gradient(135deg, rgba(225,48,108,0.08) 0%, rgba(130,58,180,0.06) 100%)',
              border: '1px solid rgba(225,48,108,0.30)',
              borderRadius: '4px',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.35s, box-shadow 0.35s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(225,48,108,0.65)'
              e.currentTarget.style.boxShadow = '0 0 32px rgba(225,48,108,0.15), inset 0 0 20px rgba(225,48,108,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(225,48,108,0.30)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, transparent, rgba(225,48,108,0.9), transparent)', animation: 'igSweep 3.5s ease-in-out infinite 1.75s' }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 8, flexShrink: 0, background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(225,48,108,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(13px,1.4vw,16px)', letterSpacing: '0.18em', color: '#ffffff', lineHeight: 1.1 }}>@BEJOICE_SHIPPING</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(9px,1vw,11px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,120,160,0.75)', marginTop: 3, fontWeight: 600 }}>{isAr ? ar.footer.followInstagram : 'Follow on Instagram'}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4, flexShrink: 0, opacity: 0.6 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(255,120,160,0.8)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

        </div>

        <div className="gold-line mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1.4vw,14px)', color: 'rgba(255,255,255,0.55)' }}>
            {isAr ? ar.footer.rights : '© 2026 Bejoice Global Logistics LLC. All rights reserved.'}
          </div>
          <div className="flex flex-wrap gap-6">
            {Object.keys(POLICIES).map(item => (
              <button key={item} onClick={() => setOpenPolicy(item)}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(10px,1.3vw,13px)', color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', transition: 'color 0.3s', padding: 0 }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
              >{item}</button>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(60px,12vw,120px)', lineHeight: 1, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.02)' }}>
          BEJOICE
        </div>
      </div>

      {openPolicy && <PolicyModal title={openPolicy} onClose={() => setOpenPolicy(null)} />}
    </footer>
  )
}
