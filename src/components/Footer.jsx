import { useState, useEffect, useRef } from 'react'
import logoSrc from '../assets/bejoice-logo-group.png'
import { useLang } from '../context/LangContext'
import ar from '../i18n/ar'
import emailjs from '@emailjs/browser'
import { EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY } from '../utils/emailService'

const footerLinks = {
  Company: ['Why Bejoice', 'Certifications', 'Key Markets', 'Careers'],
  Support: ['Track Shipment', 'Get a Quote', 'Contact Us', 'Our Offices'],
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
        body: `Under the Saudi Personal Data Protection Law (PDPL), you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at info@bejoiceshipping-ksa.com.`,
      },
      {
        title: '6. Security',
        body: `We implement industry-standard technical and organisational measures to protect your data, including TLS encryption, access controls, and regular security reviews.`,
      },
      {
        title: '7. Contact',
        body: `Bejoice Global Logistics LLC\nBlock A, Al Raja Avenue, 1st floor, Office No. 2, Dammam 32234, Saudi Arabia\nEmail: info@bejoiceshipping-ksa.com\nPhone: +966 13 823 3461`,
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
        body: `If you have questions about our use of cookies, contact us at info@bejoiceshipping-ksa.com.`,
      },
    ],
  },
}

function CareersModal({ onClose }) {
  const backdropRef = useRef(null)

  const POSITIONS = [
    'Freight Operations Manager',
    'Business Development Manager',
    'Customs Clearance Officer',
    'Sea Freight Coordinator',
    'Air Freight Coordinator',
    'Project Cargo Specialist',
    'Heavy Lift & Project Coordinator',
    'Sales Executive',
    'Logistics Coordinator',
    'Warehouse Supervisor',
    'Finance & Administration',
    'IT / Technology',
    'Other',
  ]

  const [form, setForm] = useState({ name: '', email: '', phone: '', position: '', otherPosition: '', message: '' })
  const [cvFile, setCvFile] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  const fieldErr = (field) => errors[field] ? (
    <div style={{ color: '#f87171', fontSize: '13px', marginTop: '5px', fontFamily: "'DM Sans',sans-serif" }}>
      {errors[field]}
    </div>
  ) : null

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.position) e.position = 'Please select a position'
    if (form.position === 'Other' && !form.otherPosition.trim()) e.otherPosition = 'Please specify the position'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSubmitting(true)

    const positionLabel = form.position === 'Other' ? form.otherPosition : form.position
    const cvNote = cvFile
      ? `CV Submitted: ${cvFile.name} (${(cvFile.size / 1024).toFixed(0)} KB) — Please follow up with applicant to receive CV.`
      : 'No CV uploaded.'

    const body = [
      '╔══════════════════════════════════════════╗',
      '  JOB APPLICATION — Bejoice Group',
      '╚══════════════════════════════════════════╝',
      '',
      '👤 APPLICANT',
      `• Name:  ${form.name}`,
      `• Email: ${form.email}`,
      `• Phone: ${form.phone}`,
      '',
      '💼 POSITION APPLIED FOR',
      `• ${positionLabel}`,
      '',
      '📄 CV / RESUME',
      cvNote,
      form.message ? `\n📝 COVER NOTE\n${form.message}` : '',
    ].join('\n').trim()

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: 'info@bejoiceshipping-ksa.com',
          reply_to: form.email,
          from_name: form.name,
          subject: `[Bejoice Careers] ${positionLabel} — ${form.name}`,
          mode: 'Career Application',
          client_name: form.name,
          company: '—',
          client_email: form.email,
          phone: form.phone,
          message: body,
        },
        EMAILJS_PUBLIC_KEY,
      )
    } catch (err) {
      console.error('Careers email error:', err)
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const inp = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(91,194,231,0.2)',
    borderRadius: 8, color: '#ffffff',
    fontSize: 16, fontFamily: "'DM Sans',sans-serif",
    padding: '11px 14px', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }
  const lbl = {
    display: 'block', fontFamily: "'DM Sans',sans-serif",
    fontSize: 12, fontWeight: 700,
    color: 'rgba(91,194,231,0.8)',
    letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 6,
  }
  const fw = { marginBottom: 18 }
  const focus = e => { e.target.style.borderColor = 'rgba(91,194,231,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(91,194,231,0.1)' }
  const blur  = (field) => e => { e.target.style.borderColor = errors[field] ? 'rgba(248,113,113,0.5)' : 'rgba(91,194,231,0.2)'; e.target.style.boxShadow = 'none' }

  return (
    <>
      <style>{`
        @keyframes cm-backdrop-in { from { opacity:0 } to { opacity:1 } }
        @keyframes cm-panel-in { from { opacity:0; transform:translateY(40px) scale(0.96) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes cm-badge-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(91,194,231,0.4)} 50%{box-shadow:0 0 0 6px rgba(91,194,231,0)} }
        @keyframes cm-dot-pulse   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        @keyframes cm-tick-pop    { from{transform:scale(0);opacity:0} to{transform:scale(1);opacity:1} }
        .cm-x-btn {
          position:absolute; top:18px; right:18px; z-index:30;
          width:42px; height:42px;
          display:flex; align-items:center; justify-content:center;
          background:rgba(7,16,28,0.9);
          border:1.5px solid rgba(91,194,231,0.5); border-radius:50%;
          color:rgba(91,194,231,0.9); font-size:18px; cursor:pointer;
          box-shadow:0 4px 20px rgba(0,0,0,0.7);
          transition:background 0.25s, border-color 0.25s, transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s, color 0.25s;
          backdrop-filter:blur(8px);
        }
        .cm-x-btn:hover {
          background:rgba(91,194,231,0.15); border-color:#8DD8F0; color:#8DD8F0;
          transform:rotate(90deg) scale(1.1);
          box-shadow:0 6px 28px rgba(91,194,231,0.4), 0 0 0 4px rgba(91,194,231,0.08);
        }
        .cm-top-bar {
          height:3px;
          background:linear-gradient(90deg,transparent 0%,#6b4d10 10%,#5BC2E7 35%,#8DD8F0 50%,#8DD8F0 65%,#5BC2E7 80%,transparent 100%);
          background-size:300% 100%;
          animation:qqm-line-sweep 3s ease-in-out infinite;
          border-radius:24px 24px 0 0; flex-shrink:0;
        }
        .cm-submit-btn {
          width:100%; padding:15px 24px;
          background:linear-gradient(135deg,#5BC2E7 0%,#3aa8d4 50%,#5BC2E7 100%);
          background-size:200% 100%;
          border:none; border-radius:10px; cursor:pointer;
          font-family:"Bebas Neue",sans-serif; font-size:1.15rem; letter-spacing:0.14em;
          color:#07101c; font-weight:700;
          box-shadow:0 6px 28px rgba(91,194,231,0.35),inset 0 1px 0 rgba(255,255,255,0.35);
          animation:qqm-continue-pulse 2.4s ease-in-out infinite;
          transition:opacity 0.2s;
        }
        .cm-submit-btn:disabled { opacity:0.6; cursor:not-allowed; animation:none; }
        @media(max-width:640px){
          .cm-panel { border-radius:16px !important; }
          .cm-heading { font-size:clamp(1.8rem,8vw,2.5rem) !important; }
          .cm-grid-2  { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        data-lenis-prevent
        onClick={e => { if (e.target === backdropRef.current) onClose() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          background: 'rgba(2,3,10,0.92)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: 'max(16px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) max(40px,env(safe-area-inset-bottom)) max(8px,env(safe-area-inset-left))',
          animation: 'cm-backdrop-in 0.28s ease forwards',
          overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Panel */}
        <div
          className="cm-panel"
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative', width: '100%', maxWidth: 680, boxSizing: 'border-box',
            background: 'linear-gradient(160deg,#0d1425 0%,#080c18 40%,#091524 100%)',
            border: '1px solid rgba(91,194,231,0.18)',
            borderRadius: 24,
            boxShadow: '0 60px 140px rgba(0,0,0,0.95),0 0 0 1px rgba(91,194,231,0.06) inset,0 1px 0 rgba(91,194,231,0.2) inset',
            animation: 'cm-panel-in 0.45s cubic-bezier(0.34,1.2,0.64,1) forwards',
          }}
        >
          {/* Animated top bar */}
          <div className="cm-top-bar" />

          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '60%', height: 200,
            background: 'radial-gradient(ellipse at 50% 0%,rgba(91,194,231,0.12) 0%,transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          {/* Close button */}
          <button className="cm-x-btn" onClick={onClose} aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {submitted ? (
            /* ── Success state ── */
            <div style={{ textAlign: 'center', padding: 'clamp(60px,8vh,100px) 2rem', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'rgba(34,197,94,0.1)',
                border: '2px solid rgba(34,197,94,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 28px',
                animation: 'cm-tick-pop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both',
                boxShadow: '0 0 40px rgba(34,197,94,0.2)',
              }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 'clamp(2rem,5vw,3rem)',
                letterSpacing: '0.1em', color: '#ffffff', margin: '0 0 16px', lineHeight: 1,
              }}>
                APPLICATION <span style={{ color: '#5BC2E7' }}>RECEIVED!</span>
              </h2>
              <p style={{
                fontFamily: "'DM Sans',sans-serif", fontSize: 17,
                color: 'rgba(255,255,255,0.75)', lineHeight: 1.75,
                maxWidth: 420, margin: '0 auto 40px',
              }}>
                Thank you for your interest. We will notify you once we have an open position in this role.
              </p>
              <button className="cm-submit-btn" onClick={onClose} style={{ maxWidth: 220, margin: '0 auto', display: 'block' }}>
                Close
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <>
              {/* Heading block */}
              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2.6rem 2.5rem 1.2rem' }}>
                {/* Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(91,194,231,0.07)',
                  border: '1px solid rgba(91,194,231,0.25)',
                  borderRadius: 40, padding: '6px 16px', marginBottom: 18,
                  animation: 'cm-badge-pulse 2.2s ease-in-out infinite',
                }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: '#5BC2E7',
                    display: 'inline-block', boxShadow: '0 0 8px rgba(91,194,231,0.9)',
                    animation: 'cm-dot-pulse 1.8s ease-in-out infinite', flexShrink: 0,
                  }} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 10.5, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(91,194,231,0.9)', fontWeight: 700 }}>
                    Careers at Bejoice
                  </span>
                </div>

                <h2 className="cm-heading" style={{
                  fontFamily: "'Bebas Neue',sans-serif",
                  fontSize: 'clamp(2.2rem,6vw,3.8rem)',
                  letterSpacing: '0.1em', lineHeight: 1, margin: '0 0 12px',
                  color: '#ffffff', textShadow: '0 2px 40px rgba(0,0,0,0.8)',
                }}>
                  JOIN{' '}
                  <span style={{ color: '#5BC2E7', textShadow: '0 0 30px rgba(91,194,231,0.5),0 2px 40px rgba(0,0,0,0.8)' }}>
                    OUR TEAM
                  </span>
                </h2>

                <p style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: 16,
                  color: 'rgba(255,255,255,0.75)', margin: '0 auto 18px',
                  maxWidth: 480, lineHeight: 1.7, fontWeight: 500,
                }}>
                  Express your interest and we'll reach out when a matching role opens.
                </p>

                <div style={{ width: 80, height: 1, margin: '0 auto', background: 'linear-gradient(90deg,transparent,rgba(91,194,231,0.5),transparent)' }} />
              </div>

              {/* Form body */}
              <div style={{ position: 'relative', zIndex: 1, padding: '0.5rem 2.2rem 2.5rem' }}>
                <form onSubmit={handleSubmit} noValidate>

                  {/* Full Name */}
                  <div style={fw}>
                    <label style={lbl}>Full Name <span style={{ color: '#f87171' }}>*</span></label>
                    <input
                      type="text" value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Your full name"
                      style={{ ...inp, borderColor: errors.name ? 'rgba(248,113,113,0.5)' : 'rgba(91,194,231,0.2)' }}
                      onFocus={focus} onBlur={blur('name')}
                    />
                    {fieldErr('name')}
                  </div>

                  {/* Email + Phone */}
                  <div className="cm-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
                    <div>
                      <label style={lbl}>Email <span style={{ color: '#f87171' }}>*</span></label>
                      <input
                        type="email" value={form.email}
                        onChange={e => set('email', e.target.value)}
                        placeholder="your@email.com"
                        style={{ ...inp, borderColor: errors.email ? 'rgba(248,113,113,0.5)' : 'rgba(91,194,231,0.2)' }}
                        onFocus={focus} onBlur={blur('email')}
                      />
                      {fieldErr('email')}
                    </div>
                    <div>
                      <label style={lbl}>Phone <span style={{ color: '#f87171' }}>*</span></label>
                      <input
                        type="tel" value={form.phone}
                        onChange={e => set('phone', e.target.value)}
                        placeholder="+966 5X XXX XXXX"
                        style={{ ...inp, borderColor: errors.phone ? 'rgba(248,113,113,0.5)' : 'rgba(91,194,231,0.2)' }}
                        onFocus={focus} onBlur={blur('phone')}
                      />
                      {fieldErr('phone')}
                    </div>
                  </div>

                  {/* Position */}
                  <div style={fw}>
                    <label style={lbl}>Interested Position <span style={{ color: '#f87171' }}>*</span></label>
                    <select
                      value={form.position}
                      onChange={e => set('position', e.target.value)}
                      style={{
                        ...inp,
                        borderColor: errors.position ? 'rgba(248,113,113,0.5)' : 'rgba(91,194,231,0.2)',
                        cursor: 'pointer', appearance: 'none',
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235BC2E7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: 44,
                      }}
                      onFocus={focus} onBlur={blur('position')}
                    >
                      <option value="" style={{ background: '#0d1a2e', color: 'rgba(255,255,255,0.45)' }}>Select a position…</option>
                      {POSITIONS.map(p => (
                        <option key={p} value={p} style={{ background: '#0d1a2e', color: '#fff' }}>{p}</option>
                      ))}
                    </select>
                    {fieldErr('position')}
                  </div>

                  {/* Other position */}
                  {form.position === 'Other' && (
                    <div style={fw}>
                      <label style={lbl}>Specify Position <span style={{ color: '#f87171' }}>*</span></label>
                      <input
                        type="text" value={form.otherPosition}
                        onChange={e => set('otherPosition', e.target.value)}
                        placeholder="e.g. Supply Chain Analyst"
                        style={{ ...inp, borderColor: errors.otherPosition ? 'rgba(248,113,113,0.5)' : 'rgba(91,194,231,0.2)' }}
                        onFocus={focus} onBlur={blur('otherPosition')}
                      />
                      {fieldErr('otherPosition')}
                    </div>
                  )}

                  {/* CV Upload */}
                  <div style={fw}>
                    <label style={lbl}>CV / Resume <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>(optional)</span></label>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 16px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px dashed rgba(91,194,231,0.28)',
                      borderRadius: 8, cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(91,194,231,0.55)'; e.currentTarget.style.background = 'rgba(91,194,231,0.05)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(91,194,231,0.28)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: 8, flexShrink: 0,
                        background: 'rgba(91,194,231,0.08)', border: '1px solid rgba(91,194,231,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: cvFile ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: cvFile ? 500 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {cvFile ? cvFile.name : 'Upload CV / Resume'}
                        </div>
                        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: 'rgba(91,194,231,0.55)', marginTop: 2 }}>
                          {cvFile ? `${(cvFile.size / 1024).toFixed(0)} KB` : 'PDF, DOC, DOCX — max 5 MB'}
                        </div>
                      </div>
                      {cvFile && <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>}
                      <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const f = e.target.files[0]
                          if (f && f.size > 5 * 1024 * 1024) { alert('File must be under 5 MB'); return }
                          setCvFile(f || null)
                        }}
                      />
                    </label>
                  </div>

                  {/* Cover Note */}
                  <div style={fw}>
                    <label style={lbl}>Cover Note <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>(optional)</span></label>
                    <textarea
                      value={form.message}
                      onChange={e => set('message', e.target.value)}
                      placeholder="Briefly tell us about your experience and why you'd like to join Bejoice..."
                      rows={3}
                      style={{ ...inp, resize: 'vertical', minHeight: 90 }}
                      onFocus={focus} onBlur={e => { e.target.style.borderColor = 'rgba(91,194,231,0.2)'; e.target.style.boxShadow = 'none' }}
                    />
                  </div>

                  <button type="submit" className="cm-submit-btn" disabled={submitting}>
                    {submitting ? 'Submitting…' : 'Submit Application'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
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
          }}>{isAr ? (ar.footer.policies[title] || title) : title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              width: '44px', height: '44px', borderRadius: '8px',
              fontSize: '18px', flexShrink: 0, marginLeft: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >✕</button>
        </div>
        <p style={{ fontFamily: isAr ? "'Cairo','Noto Sans Arabic',sans-serif" : "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(91,194,231,0.8)', marginBottom: '32px', letterSpacing: '0.05em' }}>
          {isAr ? ar.footer.lastUpdated : 'Last updated:'} {policy.updated}
        </p>

        {/* Sections */}
        {policy.sections.map(s => (
          <div key={s.title} style={{ marginBottom: '28px' }}>
            <h3 style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 'clamp(15px,1.6vw,18px)',
              color: 'rgba(255,255,255,0.95)', marginBottom: '10px',
            }}>{s.title}</h3>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 'clamp(15px,1.5vw,17px)',
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
          >{isAr ? ar.footer.close : 'Close'}</button>
        </div>
      </div>
    </div>
  )
}

export default function Footer() {
  const { lang } = useLang()
  const isAr = lang === 'ar'
  const [openPolicy, setOpenPolicy] = useState(null)
  const [careersOpen, setCareersOpen] = useState(false)

  return (
    <footer className="relative border-t pt-10 md:pt-20 pb-10 px-6 md:px-12 lg:px-24 overflow-hidden cv-section cv-footer" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#183650' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(91,194,231,0.05) 0%, transparent 60%)' }}/>
      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16 lg:mb-20" style={{ justifyItems: 'center' }}>
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '24px' }}>
              <img
                src={logoSrc}
                alt="Bejoice"
                loading="lazy" decoding="async"
                style={{ height: '230px', width: 'auto', objectFit: 'contain', display: 'block', opacity: 0.92 }}
              />
            </div>
          </div>

          {/* Company + Support links */}
          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category} className="footer-col-shift">
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1.1vw,14px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(91,194,231,0.92)', fontWeight: 600, marginBottom: '20px' }}>
                {isAr ? (ar.footer.categories[category] || category) : category}
              </div>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    {item === 'Key Markets' ? (
                      /* Bejoice Wings text link → globe mid */
                      <a
                        href="#globe-mid"
                        onClick={(e) => {
                          e.preventDefault()
                          const el = document.getElementById('globe-mid')
                          if (el) {
                            if (window.__lenis) window.__lenis.scrollTo(el, { offset: 0, immediate: true })
                            else el.scrollIntoView({ behavior: 'instant' })
                          }
                        }}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.90)', textDecoration: 'none', transition: 'color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.90)'}
                      >
                        {isAr ? ar.nav.bejoiceWings : 'Bejoice Wings'}
                      </a>
                    ) : item === 'Careers' ? (
                      <button
                        onClick={() => setCareersOpen(true)}
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.90)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.90)'}
                      >
                        {isAr ? (ar.footer.links?.['Careers'] || 'Careers') : 'Careers'}
                      </button>
                    ) : (
                    <a
                      href={item === 'Track Shipment' ? 'https://www.track-trace.com/' : (item === 'Get a Quote' || item === 'Contact Us') ? '#contact' : item === 'Why Bejoice' ? '#why-us' : item === 'Certifications' ? '#certifications' : item === 'Our Offices' ? '#globe' : item === 'About Bejoice' ? '#hero' : '#'}
                      onClick={(e) => {
                        const targets = {
                          'Get a Quote': 'contact',
                          'Contact Us': 'contact',
                          'Certifications': 'certifications',
                          'Why Bejoice': 'why-us',
                          'Our Offices': 'globe',
                          'About Bejoice': 'hero',
                        }
                        const targetId = targets[item]
                        if (targetId) {
                          e.preventDefault()
                          const el = document.getElementById(targetId)
                          if (el) {
                            if (window.__lenis) window.__lenis.scrollTo(el, { offset: -80, immediate: true })
                            else el.scrollIntoView({ behavior: 'instant' })
                          }
                        }
                      }}
                      target={item === 'Track Shipment' ? '_blank' : undefined}
                      rel={item === 'Track Shipment' ? 'noopener noreferrer' : undefined}
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.90)', textDecoration: 'none', transition: 'color 0.3s' }}
                      onMouseEnter={e => e.target.style.color = '#ffffff'}
                      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.90)'}
                    >{isAr ? (ar.footer.links[item] || item) : item}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Us */}
          <div className="footer-col-shift">
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1.1vw,14px)', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(91,194,231,0.92)', fontWeight: 600, marginBottom: '20px' }}>{isAr ? ar.footer.categories['Contact Us'] : 'Contact Us'}</div>
            <ul className="space-y-4">
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg style={{ flexShrink: 0, marginTop: '3px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.7)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.4 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <a href="tel:+966138233461" dir="ltr" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.90)', textDecoration: 'none', transition: 'color 0.3s', lineHeight: 1.5, direction: 'ltr', unicodeBidi: 'embed' }}
                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.90)'}
                  >+966 13 823 3461</a>
                  <span style={{ color: 'rgba(91,194,231,0.5)', fontSize: '12px' }}>·</span>
                  <a href="mailto:info@bejoiceshipping-ksa.com" dir="ltr" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.90)', textDecoration: 'none', transition: 'color 0.3s', lineHeight: 1.5, direction: 'ltr', unicodeBidi: 'embed', whiteSpace: 'nowrap' }}
                    onMouseEnter={e => e.target.style.color = '#ffffff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.90)'}
                  >info@bejoiceshipping-ksa.com</a>
                </div>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <svg style={{ flexShrink: 0, marginTop: '3px' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(91,194,231,0.7)" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                <span style={{ fontFamily: isAr ? "'Cairo','Noto Sans Arabic',sans-serif" : "'DM Sans', sans-serif", fontSize: 'clamp(14px,1.5vw,17px)', color: 'rgba(255,255,255,0.90)', lineHeight: 1.6, textAlign: isAr ? 'right' : 'left', direction: isAr ? 'rtl' : 'ltr' }}>
                  {isAr ? ar.footer.address.split('\n').map((line, i) => <span key={i}>{line}<br/></span>) : <>Al&nbsp;Raja&nbsp;Avenue,&nbsp;Block&nbsp;A,&nbsp;1st&nbsp;floor, <span style={{whiteSpace:'nowrap'}}>Office No. 2, Dammam 32234, KSA</span></>}
                </span>
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
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(15px,1.4vw,18px)', letterSpacing: '0.18em', color: '#ffffff', lineHeight: 1.1 }}>BEJOICE SHIPPING LLC</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1vw,13px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,169,255,0.75)', marginTop: 3, fontWeight: 600 }}>{isAr ? ar.footer.followLinkedIn : 'Follow on LinkedIn'}</div>
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
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(15px,1.4vw,18px)', letterSpacing: '0.18em', color: '#ffffff', lineHeight: 1.1 }}>@BEJOICE_SHIPPING</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(11px,1vw,13px)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,120,160,0.75)', marginTop: 3, fontWeight: 600 }}>{isAr ? ar.footer.followInstagram : 'Follow on Instagram'}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 4, flexShrink: 0, opacity: 0.6 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(255,120,160,0.8)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

        </div>

        <div className="gold-line mb-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(13px,1.4vw,16px)', color: 'rgba(255,255,255,0.55)' }}>
            {isAr ? ar.footer.rights : '© Bejoice Shipping Company'}
          </div>
          <div className="flex flex-wrap gap-6">
            {Object.keys(POLICIES).map(item => (
              <button key={item} onClick={() => setOpenPolicy(item)}
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(12px,1.3vw,15px)', color: 'rgba(255,255,255,0.55)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.05em', transition: 'color 0.3s', padding: 0 }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
              >{isAr ? (ar.footer.policies[item] || item) : item}</button>
            ))}
          </div>
        </div>

      </div>

      {openPolicy && <PolicyModal title={openPolicy} onClose={() => setOpenPolicy(null)} />}
      {careersOpen && <CareersModal onClose={() => setCareersOpen(false)} />}
    </footer>
  )
}
