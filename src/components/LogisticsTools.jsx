import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LogisticsTools() {
  const [l, setL] = useState(120)
  const [w, setW] = useState(80)
  const [h, setH] = useState(100)
  const [qty, setQty] = useState(1)

  const cbmPerUnit = (l * w * h) / 1_000_000
  const totalCBM = (cbmPerUnit * qty).toFixed(3)
  const volWeightAir = Math.round(cbmPerUnit * qty * 167)
  const volWeightOcean = Math.round(cbmPerUnit * qty * 1000)

  const SliderRow = ({ label, value, setter, max }) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
          {label}
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
          {value} cm
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={max}
        value={value}
        onChange={e => setter(Number(e.target.value))}
        style={{
          width: '100%',
          height: '2px',
          accentColor: '#c8a84e',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '999px',
          appearance: 'none',
          cursor: 'pointer',
          outline: 'none',
        }}
      />
    </div>
  )

  return (
    <section style={{
      background: '#050508',
      padding: 'clamp(80px, 10vw, 140px) clamp(1.5rem, 8vw, 8rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '5%', right: '-8%',
        width: '700px', height: '700px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(200,168,78,0.05) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '5%', left: '-6%',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(30,60,180,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8%' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '4rem' }}
        >
          <span style={{
            display: 'block',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '1rem',
          }}>
            Client Utilities
          </span>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(42px, 7vw, 90px)',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1,
            marginBottom: '1.5rem',
          }}>
            Freight <span style={{ color: '#c8a84e' }}>Calculators</span>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '55ch',
            lineHeight: 1.8,
          }}>
            Accurate CBM and chargeable weight estimates in real time — before you even send us an enquiry.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'clamp(1rem, 2vw, 2rem)',
        }}>

          {/* Main CBM card - span 8 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              gridColumn: 'span 12',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 0,
              background: 'rgba(255,255,255,0.025)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '2.5rem',
              overflow: 'hidden',
            }}
          >
            {/* Inputs side */}
            <div style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(200,168,78,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px',
                }}>📦</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '0.15em', color: '#fff' }}>
                  CBM Volume Calculator
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <SliderRow label="Length (cm)" value={l} setter={setL} max={1200} />
                <SliderRow label="Width (cm)"  value={w} setter={setW} max={240}  />
                <SliderRow label="Height (cm)" value={h} setter={setH} max={300}  />

                <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{
                    display: 'block',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: '12px',
                  }}>
                    Number of Packages
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(0,0,0,0.4)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', width: 'fit-content' }}>
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      style={{ padding: '10px 18px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer' }}
                    >−</button>
                    <span style={{ padding: '10px 12px', fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#fff', minWidth: '40px', textAlign: 'center' }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      style={{ padding: '10px 18px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '18px', cursor: 'pointer' }}
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results side */}
            <div style={{
              padding: 'clamp(2rem, 4vw, 3.5rem)',
              background: 'linear-gradient(135deg, #080810 0%, #050508 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2.5rem',
            }}>
              <div>
                <span style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8a84e', marginBottom: '12px' }}>
                  Total Volume
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={totalCBM}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}
                  >
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(52px, 8vw, 90px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>
                      {totalCBM}
                    </span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(20px, 3vw, 32px)', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
                      CBM
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(255,255,255,0.08), transparent)' }} />

              <div>
                <span style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                  ✈ Chargeable Weight (Air)
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={volWeightAir}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}
                  >
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '0.04em' }}>
                      {volWeightAir}
                    </span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: 'rgba(255,255,255,0.3)' }}>kg</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div>
                <span style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                  🚢 Volume Weight (Ocean)
                </span>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={volWeightOcean}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}
                  >
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 52px)', color: 'rgba(255,255,255,0.88)', letterSpacing: '0.04em' }}>
                      {volWeightOcean}
                    </span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', color: 'rgba(255,255,255,0.3)' }}>kg</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: 'rgba(255,255,255,0.2)', lineHeight: 1.7 }}>
                * Air: 1 CBM = 167 kg divisor. Ocean: 1 CBM = 1,000 kg. Final chargeable weight = greater of actual vs volumetric weight.
              </p>
            </div>
          </motion.div>

          {/* Tracking card - span 6 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              gridColumn: 'span 6',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '2.5rem',
              padding: 'clamp(2rem, 4vw, 3rem)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.4s ease',
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{
              position: 'absolute', top: 0, right: 0,
              fontSize: '120px', opacity: 0.04, pointerEvents: 'none',
              transform: 'translate(15px, -15px)',
            }}>📍</div>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(200,168,78,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', marginBottom: '1.5rem',
            }}>📍</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3.5vw, 38px)', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
              Track Your<br/>Shipment
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '28ch', marginBottom: '2rem' }}>
              Real-time status and location updates across all major sea and air carriers globally.
            </p>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8a84e' }}>
              Open Tracker →
            </span>
          </motion.div>

          {/* Incoterms card - span 6 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8%' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              gridColumn: 'span 6',
              background: 'rgba(255,255,255,0.015)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '2.5rem',
              padding: 'clamp(2rem, 4vw, 3rem)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            whileHover={{ scale: 1.01 }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(200,168,78,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '1.5rem' }}>📋</div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3.5vw, 38px)', letterSpacing: '0.1em', color: '#fff', marginBottom: '1rem', lineHeight: 1.1 }}>
              Incoterms<br/>2020 Guide
            </h3>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: '30ch', marginBottom: '2rem' }}>
              Understand FOB, EXW, CIF, DDP — know exactly where your risk and cost obligation starts and ends.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {['FOB', 'EXW', 'CIF', 'DDP', 'DAP'].map(term => (
                <span key={term} style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '14px',
                  letterSpacing: '0.15em',
                  color: 'rgba(200,168,78,0.7)',
                  background: 'rgba(200,168,78,0.07)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(200,168,78,0.12)',
                }}>
                  {term}
                </span>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
