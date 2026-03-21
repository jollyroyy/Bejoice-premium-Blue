import { useEffect, useRef, useState } from 'react'

export default function Contact() {
  const sectionRef = useRef(null)
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', origin: '', destination: '', type: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.querySelectorAll('.fade-up').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 70)
          })
        })
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '16px 20px', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 400,
    color: '#ffffff',
    transition: 'border-color 0.3s',
  }

  const handleFocus = e => { e.target.style.borderColor = 'rgba(200,168,78,0.6)' }
  const handleBlur = e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)' }
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <section id="contact" ref={sectionRef} className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 80%, rgba(200,168,78,0.06) 0%, transparent 55%)' }}/>

      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="section-num fade-up mb-5">06 — Get in Touch</div>
          <h2 className="fade-up section-headline">
            <span className="shine-text" data-text="REQUEST">REQUEST</span><br />
            <span className="accent shine-text shine-gold" data-text="A QUOTE">A QUOTE</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left info */}
          <div className="lg:col-span-2 space-y-10">
            <p className="fade-up body-text">
              Ready to move your cargo with precision? Our team responds within 2 business hours with a tailored solution.
            </p>
            {[
              { label: 'Riyadh HQ', icon: '◈', value: 'King Fahd Road, Al Olaya\nRiyadh 11553, Saudi Arabia' },
              { label: 'Phone', icon: '◉', value: '+966 11 XXX XXXX\n+966 55 XXX XXXX' },
              { label: 'Email', icon: '◆', value: 'info@bejoice.com\nquotes@bejoice.com' },
            ].map((item, i) => (
              <div key={item.label} className="fade-up flex gap-5" style={{ transitionDelay: `${(i + 1) * 70}ms` }}>
                <div style={{ fontSize: '22px', color: '#c8a84e', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(200,168,78,0.7)', marginBottom: '8px', fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: 'rgba(255,255,255,0.92)', whiteSpace: 'pre-line', lineHeight: 1.7, fontWeight: 500 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 fade-up">
            {!sent ? (
              <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-px">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                  <input style={inputStyle} placeholder="Full Name *" name="name" value={form.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                  <input style={inputStyle} placeholder="Company" name="company" value={form.company} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                  <input style={inputStyle} placeholder="Email Address *" type="email" name="email" value={form.email} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} required />
                  <input style={inputStyle} placeholder="Phone / WhatsApp" name="phone" value={form.phone} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px">
                  <input style={inputStyle} placeholder="Origin Country / Port" name="origin" value={form.origin} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                  <input style={inputStyle} placeholder="Destination" name="destination" value={form.destination} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <select style={{ ...inputStyle, cursor: 'pointer', appearance: 'none' }} name="type" value={form.type} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}>
                  <option value="" className="bg-black">Service Type</option>
                  {['Air Freight','Sea Freight','Road Transport','Customs Clearance','Warehousing','Project Cargo'].map(s => (
                    <option key={s} value={s.toLowerCase()} className="bg-black">{s}</option>
                  ))}
                </select>
                <textarea style={{ ...inputStyle, resize: 'none' }} placeholder="Additional details — cargo type, weight, dimensions, special requirements..." name="message" value={form.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} rows={5} />
                <div className="pt-4">
                  <button type="submit" className="btn-gold w-full justify-center" style={{ fontSize: '13px', letterSpacing: '0.2em', padding: '18px' }}>
                    <span className="shine-ltr" data-text="Send Enquiry">Send Enquiry</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', paddingTop: '8px' }}>
                  We respond within 2 business hours. No spam, ever.
                </p>
              </form>
            ) : (
              <div className="glass-card border-gold/35 p-16 text-center" style={{ background: 'linear-gradient(135deg, rgba(200,168,78,0.07) 0%, transparent 100%)' }}>
                <div className="gold-text mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '5rem', letterSpacing: '0.1em' }}>✓</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', letterSpacing: '0.1em', color: '#ffffff', marginBottom: '16px' }}>ENQUIRY SENT</h3>
                <p className="body-text mx-auto" style={{ maxWidth: '340px' }}>Our logistics team will contact you within 2 business hours with a tailored quote.</p>
                <button className="btn-ghost mt-10" onClick={() => setSent(false)}><span>New Enquiry</span></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
