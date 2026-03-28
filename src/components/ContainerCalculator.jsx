import { useState, useMemo } from 'react'
import Container3DViewer, { CONTAINER_SPECS, WeightDistributionGuide } from './Container3DViewer'

const BOX_COLORS = ['#c8a84e','#3b82f6','#10b981','#e05252','#8b5cf6','#f59e0b','#06b6d4']

export default function ContainerCalculator() {
  const [containerType, setContainerType] = useState('20ft')
  const [items, setItems] = useState([{
    id: 1, l: 120, w: 80, h: 80, weight: 200, qty: 5, unit: 'cm', stackable: true
  }])
  const container = CONTAINER_SPECS[containerType]

  const totalCBM = useMemo(() =>
    items.reduce((s, i) => {
      const f = i.unit === 'in' ? 2.54 : 1
      return s + (i.l * f) * (i.w * f) * (i.h * f) / 1e6 * i.qty
    }, 0)
  , [items])
  const totalWeight = useMemo(() => items.reduce((s, i) => s + i.weight * i.qty, 0), [items])
  const containerCBM = (container.length * container.width * container.height) / 1e6
  const utilization = Math.min(100, (totalCBM / containerCBM) * 100)

  const updateItem = (id, field, val) => setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i))
  const addItem = () => setItems(prev => [...prev, { id: Date.now(), l: 100, w: 80, h: 80, weight: 150, qty: 3, unit: 'cm', stackable: true }])
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))

  return (
    <section id="container-calculator" style={{
      background: 'linear-gradient(180deg,#040408 0%,#06080f 60%,#040408 100%)',
      padding: 'clamp(60px,8vw,100px) 0',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(200,168,78,0.028) 1px,transparent 1px),linear-gradient(90deg,rgba(200,168,78,0.028) 1px,transparent 1px)',
        backgroundSize: '56px 56px',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(16px,4vw,40px)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px,6vw,64px)' }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#c8a84e', fontFamily: 'DM Sans,sans-serif', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>
            LOAD OPTIMISER
          </div>
          <h2 style={{
            fontFamily: 'Bebas Neue,sans-serif',
            fontSize: 'clamp(2.4rem,6vw,4.2rem)',
            color: '#fff', letterSpacing: 4, lineHeight: 1, margin: 0,
          }}>
            CONTAINER CALCULATOR
          </h2>
          <p style={{
            fontFamily: 'DM Sans,sans-serif', color: 'rgba(255,255,255,0.48)',
            fontSize: 'clamp(13px,1.5vw,15px)',
            maxWidth: 440, margin: '16px auto 0',
          }}>
            Enter cargo dimensions and see how it packs into the container.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="cc-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'clamp(280px,38%,420px) 1fr',
          gap: 'clamp(20px,3vw,40px)',
          alignItems: 'start',
        }}>

          {/* LEFT: Form */}
          <div>
            {/* Container selector */}
            <div style={{ marginBottom: 22 }}>
              <span style={lbl}>Container Type</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                {Object.entries(CONTAINER_SPECS).map(([key, c]) => (
                  <button key={key} onClick={() => setContainerType(key)} style={{
                    flex: 1, padding: '9px 4px', borderRadius: 8,
                    border: `1px solid ${containerType === key ? '#c8a84e' : 'rgba(255,255,255,0.1)'}`,
                    background: containerType === key ? 'rgba(200,168,78,0.11)' : 'rgba(255,255,255,0.03)',
                    color: containerType === key ? '#c8a84e' : 'rgba(255,255,255,0.5)',
                    fontFamily: 'DM Sans,sans-serif', fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s', letterSpacing: 0.3,
                  }}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cargo items */}
            {items.map((item, idx) => (
              <div key={item.id} style={{
                background: 'rgba(255,255,255,0.028)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '18px 16px', marginBottom: 14,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: BOX_COLORS[idx % BOX_COLORS.length], fontWeight: 700, letterSpacing: 1.5, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: BOX_COLORS[idx % BOX_COLORS.length] }} />
                    ITEM {idx + 1}
                  </span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <select value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} style={sel}>
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', cursor: 'pointer', fontSize: 20, lineHeight: 1, padding: '0 4px', minWidth: 28, minHeight: 28 }}>×</button>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
                  {[['L', 'l'], ['W', 'w'], ['H', 'h']].map(([label, f]) => (
                    <div key={f}>
                      <span style={micro}>{label} ({item.unit})</span>
                      <input type="number" min="1" value={item[f]}
                        onChange={e => updateItem(item.id, f, Math.max(1, +e.target.value || 1))}
                        style={inp} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  <div>
                    <span style={micro}>Weight (kg)</span>
                    <input type="number" min="0" value={item.weight}
                      onChange={e => updateItem(item.id, 'weight', Math.max(0, +e.target.value || 0))}
                      style={inp} />
                  </div>
                  <div>
                    <span style={micro}>Quantity</span>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      <button onClick={() => updateItem(item.id, 'qty', Math.max(1, item.qty - 1))} style={stepB}>−</button>
                      <input type="number" min="1" value={item.qty}
                        onChange={e => updateItem(item.id, 'qty', Math.max(1, +e.target.value || 1))}
                        style={{ ...inp, textAlign: 'center', flex: 1, marginTop: 0 }} />
                      <button onClick={() => updateItem(item.id, 'qty', item.qty + 1)} style={stepB}>+</button>
                    </div>
                  </div>
                </div>

                <button onClick={() => updateItem(item.id, 'stackable', !item.stackable)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}>
                  <span style={{
                    width: 36, height: 18, borderRadius: 9, position: 'relative', flexShrink: 0,
                    background: item.stackable ? 'rgba(200,168,78,0.65)' : 'rgba(255,255,255,0.1)',
                    transition: 'background 0.2s', display: 'block',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, width: 14, height: 14, borderRadius: 7, background: '#fff',
                      left: item.stackable ? 20 : 2, transition: 'left 0.2s',
                    }} />
                  </span>
                  <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Stackable</span>
                </button>
              </div>
            ))}

            <button onClick={addItem} style={{
              width: '100%', padding: 12, borderRadius: 8,
              border: '1px dashed rgba(200,168,78,0.3)',
              background: 'transparent', color: 'rgba(200,168,78,0.65)',
              fontFamily: 'DM Sans,sans-serif', fontSize: 12, fontWeight: 600,
              cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
            }}>
              + ADD ITEM
            </button>
          </div>

          {/* RIGHT: 3D visualisation */}
          <div style={{
            background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(200,168,78,0.1)',
            borderRadius: 18, padding: 'clamp(20px,3vw,36px)', position: 'sticky', top: 100,
          }}>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, marginBottom: 4, textTransform: 'uppercase' }}>
              {container.label} · {container.length}×{container.width}×{container.height} cm
            </div>
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.2)', marginBottom: 16 }}>
              max {container.maxWeight.toLocaleString()} kg · {containerCBM.toFixed(0)} m³
            </div>

            <Container3DViewer items={items} containerType={containerType} />

            {/* Utilization detail */}
            <div style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 10, color: utilization > 95 ? '#ef4444' : 'rgba(255,255,255,0.28)', marginTop: 8 }}>
              {utilization > 100 ? '⚠ Exceeds container volume' : utilization > 95 ? '⚠ Almost full' : `${(containerCBM - totalCBM).toFixed(1)} m³ remaining`}
            </div>

            {/* CTA */}
            <button
              onClick={() => typeof window.__showCalModal === 'function' && window.__showCalModal()}
              style={{
                width: '100%', marginTop: 20, padding: 14, borderRadius: 10,
                background: 'linear-gradient(135deg,#c8a84e 0%,#ffe680 50%,#c8a84e 100%)',
                border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans,sans-serif', fontSize: 14, fontWeight: 700,
                color: '#0a0a12', letterSpacing: 1,
              }}
            >
              GET A FREIGHT QUOTE →
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .cc-grid { grid-template-columns: 1fr !important; }
          .cc-grid > div:last-child { position: static !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Style shorthands ─────────────────────────────────────────────────────────
const lbl = {
  fontFamily: 'DM Sans,sans-serif', fontSize: 11,
  color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: 0.5,
}
const micro = {
  display: 'block', fontFamily: 'DM Sans,sans-serif', fontSize: 10,
  color: 'rgba(255,255,255,0.38)', marginBottom: 5, letterSpacing: 0.2,
}
const inp = {
  width: '100%', padding: '8px 10px', marginTop: 0,
  background: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
  color: '#fff', fontFamily: 'DM Sans,sans-serif', fontSize: 14,
  boxSizing: 'border-box', outline: 'none',
}
const sel = {
  padding: '4px 8px', background: 'rgba(255,255,255,0.055)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
  color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans,sans-serif',
  fontSize: 11, cursor: 'pointer', outline: 'none',
}
const stepB = {
  width: 30, flexShrink: 0, background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7,
  color: '#fff', cursor: 'pointer', fontFamily: 'DM Sans,sans-serif', fontSize: 16,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
