// QuoteModal.jsx — stylish quote request modal
import { useState, useEffect, useRef } from 'react'

const STYLE_ID = 'qm-keyframes'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = `
    @keyframes qm-backdrop-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes qm-panel-in {
      from { opacity: 0; transform: translateY(28px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    @keyframes qm-service-select {
      0%   { transform: scale(1); }
      40%  { transform: scale(0.96); }
      100% { transform: scale(1); }
    }
    .qm-input {
      width: 100%; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(200,168,78,0.18); border-radius: 8px;
      color: #fff; font-family: 'DM Sans', sans-serif;
      font-size: 13.5px; padding: 11px 14px; outline: none;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .qm-input::placeholder { color: rgba(255,255,255,0.28); }
    .qm-input:focus { border-color: rgba(200,168,78,0.55); background: rgba(255,255,255,0.08); }
    .qm-select {
      width: 100%; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(200,168,78,0.18); border-radius: 8px;
      color: #fff; font-family: 'DM Sans', sans-serif;
      font-size: 13.5px; padding: 11px 14px; outline: none;
      cursor: pointer; appearance: none;
      transition: border-color 0.2s, background 0.2s;
      box-sizing: border-box;
    }
    .qm-select:focus { border-color: rgba(200,168,78,0.55); background: rgba(255,255,255,0.08); }
    .qm-select option { background: #0d1525; color: #fff; }
    .qm-submit {
      width: 100%; padding: 14px;
      background: linear-gradient(135deg, #e8cc7a, #c8a84e);
      color: #050508; border: none; border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 800;
      letter-spacing: 0.14em; text-transform: uppercase;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(200,168,78,0.4);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .qm-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(200,168,78,0.6); }
    .qm-submit:active { transform: scale(0.98); }
    .qm-submit:disabled { opacity: 0.5; cursor: default; transform: none; }
    .qm-service-card {
      flex: 1 1 0; min-width: 0;
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 16px 10px 14px;
      border-radius: 12px;
      border: 1.5px solid rgba(200,168,78,0.15);
      background: rgba(255,255,255,0.04);
      cursor: pointer;
      transition: border-color 0.2s, background 0.2s, transform 0.18s;
      user-select: none;
    }
    .qm-service-card:hover {
      border-color: rgba(200,168,78,0.4);
      background: rgba(200,168,78,0.07);
      transform: translateY(-2px);
    }
    .qm-service-card.active {
      border-color: rgba(200,168,78,0.8);
      background: rgba(200,168,78,0.12);
      box-shadow: 0 0 18px rgba(200,168,78,0.18);
      animation: qm-service-select 0.25s ease;
    }
  `
  document.head.appendChild(s)
}

const SERVICES = [
  { id: 'ocean',   icon: '🚢', label: 'Ocean Freight',  sub: 'FCL / LCL' },
  { id: 'air',     icon: '✈️', label: 'Air Freight',    sub: 'Express / Standard' },
  { id: 'heavy',   icon: '🏗️', label: 'Heavy Cargo',   sub: 'Project / OOG' },
  { id: 'warehouse', icon: '🏭', label: 'Warehousing', sub: '3PL / Storage' },
]

const ORIGINS = [
  'China / Asia Pacific', 'Europe', 'USA / North America',
  'Middle East / GCC', 'South Asia', 'Africa', 'Other',
]

export default function QuoteModal({ onClose }) {
  const [service, setService]   = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm]         = useState({
    name: '', company: '', email: '', phone: '',
    origin: '', destination: 'Saudi Arabia (KSA)', cargo: '', notes: '',
  })
  const backdropRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = e => {
    e.preventDefault()
    if (!service) return
    setSubmitted(true)
  }

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(3,3,8,0.82)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'qm-backdrop-in 0.3s ease forwards',
      }}
    >
      <div style={{
        width: '100%', maxWidth: 580,
        maxHeight: '90vh', overflowY: 'auto',
        background: 'linear-gradient(170deg, #0c1220 0%, #060810 100%)',
        border: '1px solid rgba(200,168,78,0.28)',
        borderRadius: 20,
        boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,168,78,0.1)',
        animation: 'qm-panel-in 0.38s cubic-bezier(0.34,1.4,0.64,1) forwards',
        scrollbarWidth: 'none',
      }}>

        {/* ── Top gold line ── */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #c8a84e 40%, #e8cc7a 60%, transparent 100%)',
          borderRadius: '20px 20px 0 0',
        }} />

        {submitted ? (
          /* ── Success state ── */
          <div style={{
            padding: '60px 40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 52 }}>✅</div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
              letterSpacing: '0.12em', color: '#e8cc7a',
            }}>
              Quote Request Sent!
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7, maxWidth: 340,
            }}>
              Our freight team will review your request and get back to you within <strong style={{ color: '#c8a84e' }}>1 hour</strong>. Expect a detailed quote tailored to your shipment.
            </p>
            <button
              onClick={onClose}
              style={{
                marginTop: 8, padding: '12px 36px',
                background: 'linear-gradient(135deg, #e8cc7a, #c8a84e)',
                color: '#050508', border: 'none', borderRadius: 8,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, fontWeight: 800, letterSpacing: '0.14em',
                textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(200,168,78,0.4)',
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* ── Header ── */}
            <div style={{
              padding: '28px 32px 0',
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <div style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11, letterSpacing: '0.22em',
                  color: '#c8a84e', textTransform: 'uppercase', marginBottom: 6,
                }}>
                  Bejoice Freight · Free Quote
                </div>
                <h2 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  letterSpacing: '0.1em', color: '#fff',
                  lineHeight: 1, margin: 0,
                }}>
                  Request a Quote
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  borderRadius: 8, cursor: 'pointer',
                  fontSize: 16, padding: '5px 10px',
                  lineHeight: 1, transition: 'all 0.2s',
                  flexShrink: 0, marginTop: 4,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.13)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
              >✕</button>
            </div>

            <div style={{ padding: '24px 32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* ── Service selection ── */}
              <div>
                <Label>Select Service <span style={{ color: '#ef4444' }}>*</span></Label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10 }}>
                  {SERVICES.map(s => (
                    <div
                      key={s.id}
                      className={`qm-service-card${service === s.id ? ' active' : ''}`}
                      onClick={() => setService(s.id)}
                    >
                      <span style={{ fontSize: 26, lineHeight: 1 }}>{s.icon}</span>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 11.5, fontWeight: 700,
                        color: service === s.id ? '#e8cc7a' : 'rgba(255,255,255,0.8)',
                        textAlign: 'center', lineHeight: 1.3,
                        transition: 'color 0.2s',
                      }}>{s.label}</span>
                      <span style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 10, color: 'rgba(255,255,255,0.35)',
                        textAlign: 'center',
                      }}>{s.sub}</span>
                    </div>
                  ))}
                </div>
                {!service && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(200,168,78,0.6)', marginTop: 6 }}>
                    Please select a service to continue
                  </p>
                )}
              </div>

              {/* ── Divider ── */}
              <div style={{ height: 1, background: 'rgba(200,168,78,0.1)' }} />

              {/* ── Contact details ── */}
              <div>
                <Label>Your Details</Label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 10 }}>
                  <input className="qm-input" placeholder="Full Name" value={form.name} onChange={e => set('name', e.target.value)} required />
                  <input className="qm-input" placeholder="Company" value={form.company} onChange={e => set('company', e.target.value)} />
                  <input className="qm-input" type="email" placeholder="Email Address" value={form.email} onChange={e => set('email', e.target.value)} required />
                  <input className="qm-input" type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>

              {/* ── Shipment details ── */}
              <div>
                <Label>Shipment Details</Label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 10 }}>
                  {/* Origin dropdown */}
                  <div style={{ position: 'relative' }}>
                    <select className="qm-select" value={form.origin} onChange={e => set('origin', e.target.value)}>
                      <option value="" disabled>Origin Country / Region</option>
                      {ORIGINS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'rgba(200,168,78,0.5)' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <input className="qm-input" placeholder="Destination" value={form.destination} onChange={e => set('destination', e.target.value)} />
                  <input
                    className="qm-input"
                    placeholder="Cargo Description"
                    value={form.cargo}
                    onChange={e => set('cargo', e.target.value)}
                    style={{ gridColumn: '1 / -1' }}
                  />
                  <textarea
                    className="qm-input"
                    placeholder="Additional notes — weight, dimensions, incoterms, urgency..."
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    style={{ gridColumn: '1 / -1', resize: 'none' }}
                  />
                </div>
              </div>

              {/* ── Submit ── */}
              <button type="submit" className="qm-submit" disabled={!service || !form.name || !form.email}>
                Get My Free Quote →
              </button>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11, color: 'rgba(255,255,255,0.28)',
                textAlign: 'center', margin: 0, lineHeight: 1.5,
              }}>
                🔒 Your details are confidential. We respond within 1 hour during business hours.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 700,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.45)',
    }}>
      {children}
    </div>
  )
}
