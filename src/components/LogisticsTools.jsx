import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── helpers ────────────────────────────────────────────────────────────────
const CONTAINER = (cbm) =>
  cbm <= 25 ? '20ft Standard (≤25 CBM)' :
  cbm <= 67 ? '40ft Standard (≤67 CBM)' :
              '40ft High Cube (≤76 CBM)'

const TRUCK_CAP = {
  '3.5t': { vol: 18,  wt: 3500  },
  '10t':  { vol: 40,  wt: 10000 },
  '20t':  { vol: 80,  wt: 20000 },
  '40t':  { vol: 120, wt: 40000 },
}

const inp = {
  background:   'rgba(255,255,255,0.05)',
  border:       '1px solid rgba(255,255,255,0.12)',
  borderRadius: '0.45rem',
  padding:      '0.55rem 0.8rem',
  color:        '#fff',
  fontFamily:   "'DM Sans', sans-serif",
  fontSize:     '0.85rem',
  outline:      'none',
  width:        '100%',
  boxSizing:    'border-box',
  transition:   'border-color 0.2s',
}

const lbl = {
  fontFamily:    "'DM Sans', sans-serif",
  fontSize:      '0.6rem',
  fontWeight:    600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color:         'rgba(255,255,255,0.45)',
  display:       'block',
  marginBottom:  '0.3rem',
}

function Lbl({ children }) { return <span style={lbl}>{children}</span> }

// ── tabs config ─────────────────────────────────────────────────────────────
const TABS = [
  { id: 'sea',       icon: '🚢', label: 'Sea'       },
  { id: 'air',       icon: '✈️', label: 'Air'       },
  { id: 'land',      icon: '🚛', label: 'Land'      },
  { id: 'warehouse', icon: '🏭', label: 'Warehouse' },
]

// ── main calculator ─────────────────────────────────────────────────────────
function LoadCalculator() {
  const [tab,     setTab]     = useState('sea')
  const [results, setResults] = useState(null)

  // sea
  const [seaRows,   setSeaRows]   = useState([{ l:'', w:'', h:'', qty:'1', unit:'cm' }])
  const [seaWeight, setSeaWeight] = useState('')

  // air
  const [airL,      setAirL]      = useState('')
  const [airW,      setAirW]      = useState('')
  const [airH,      setAirH]      = useState('')
  const [airQty,    setAirQty]    = useState('1')
  const [airActual, setAirActual] = useState('')

  // land
  const [landRows,  setLandRows]  = useState([{ l:'', w:'', h:'', qty:'1', weight:'' }])
  const [truckType, setTruckType] = useState('20t')

  // warehouse
  const [whL,   setWhL]   = useState('')
  const [whW,   setWhW]   = useState('')
  const [whH,   setWhH]   = useState('')
  const [whQty, setWhQty] = useState('1')
  const [whDays,setWhDays]= useState('30')

  const calculate = () => {
    // Conversion factors: each unit → cm
    const TO_CM = { mm: 0.1, cm: 1, m: 100, in: 2.54, ft: 30.48 }
    if (tab === 'sea') {
      let totalCBM = 0
      const totalKg = parseFloat(seaWeight) || 0
      for (const r of seaRows) {
        const f = TO_CM[r.unit] || 1
        const lcm = (parseFloat(r.l)||0)*f, wcm = (parseFloat(r.w)||0)*f, hcm = (parseFloat(r.h)||0)*f
        totalCBM += (lcm*wcm*hcm/1e6)*(parseInt(r.qty)||1)
      }
      setResults({
        tab: 'sea',
        cbm:       totalCBM.toFixed(3),
        weight:    totalKg,
        container: CONTAINER(totalCBM),
        loadPct:   Math.min(100, (totalCBM/76*100)).toFixed(1),
      })
    } else if (tab === 'air') {
      const vol = ((parseFloat(airL)||0)*(parseFloat(airW)||0)*(parseFloat(airH)||0)/5000)*(parseInt(airQty)||1)
      const act = (parseFloat(airActual)||0)*(parseInt(airQty)||1)
      const chargeable = Math.max(vol, act)
      setResults({
        tab: 'air',
        volWeight:  vol.toFixed(2),
        actWeight:  act.toFixed(2),
        chargeable: chargeable.toFixed(2),
        basis:      chargeable === vol ? 'Volumetric' : 'Actual',
      })
    } else if (tab === 'land') {
      let totalVol = 0, totalKg = 0
      for (const r of landRows) {
        const q = parseInt(r.qty)||1
        totalVol += ((parseFloat(r.l)||0)*(parseFloat(r.w)||0)*(parseFloat(r.h)||0)/1e6)*q
        totalKg  += (parseFloat(r.weight)||0)*q
      }
      const cap = TRUCK_CAP[truckType]
      setResults({
        tab:    'land',
        vol:    totalVol.toFixed(3),
        weight: totalKg.toFixed(0),
        truck:  truckType,
        volPct: Math.min(100,(totalVol/cap.vol*100)).toFixed(1),
        wtPct:  Math.min(100,(totalKg/cap.wt*100)).toFixed(1),
      })
    } else {
      const cbm  = ((parseFloat(whL)||0)*(parseFloat(whW)||0)*(parseFloat(whH)||0)/1e6)*(parseInt(whQty)||1)
      const days = parseFloat(whDays)||1
      const cost = (cbm * days * 0.35).toFixed(2)
      setResults({ tab:'warehouse', cbm: cbm.toFixed(3), days, cost })
    }
  }

  const exportCSV = () => {
    if (!results) return
    const rows = [['Field','Value']]
    Object.entries(results).forEach(([k,v]) => k !== 'tab' && rows.push([k,v]))
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(csv)
    a.download = `bejoice-${results.tab}-calc.csv`
    a.click()
  }

  const exportPDF = () => {
    if (!results) return
    const w = window.open('','_blank')
    w.document.write(`<html><head><title>Bejoice Load Calc</title><style>body{font-family:sans-serif;padding:2rem;color:#111}h2{color:#c8a84e}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ddd;padding:8px}th{background:#f5f5f5}</style></head><body><h2>Bejoice Group — Load Calculation</h2><p>${new Date().toLocaleString()}</p><table><tr><th>Field</th><th>Value</th></tr>${Object.entries(results).filter(([k])=>k!=='tab').map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table></body></html>`)
    w.document.close(); w.print()
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:'0.4rem', padding:'1.1rem 1.3rem 0', flexShrink:0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setResults(null) }}
            style={{
              flex:1, padding:'0.6rem 0.3rem',
              background:   tab===t.id ? '#c8a84e' : 'rgba(255,255,255,0.04)',
              border:       '1px solid',
              borderColor:  tab===t.id ? '#c8a84e' : 'rgba(255,255,255,0.1)',
              borderRadius: '0.55rem',
              color:        tab===t.id ? '#0a0a0f' : 'rgba(255,255,255,0.6)',
              fontFamily:   "'DM Sans', sans-serif",
              fontSize:     '0.65rem', fontWeight:700,
              cursor:       'pointer',
              display:      'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem',
              transition:   'all 0.2s',
            }}>
            <span style={{ fontSize:'1rem' }}>{t.icon}</span>
            <span style={{ letterSpacing:'0.04em' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Inputs ── */}
      <div style={{ flex:1, overflowY:'auto', padding:'1rem 1.3rem' }}>

        {/* SEA */}
        {tab==='sea' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            {seaRows.map((r,i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 0.6fr 0.6fr auto', gap:'0.35rem', alignItems:'end' }}>
                {['l','w','h'].map(f => (
                  <div key={f}>
                    <Lbl>{f.toUpperCase()} (cm)</Lbl>
                    <input style={inp} type="number" value={r[f]} placeholder="0"
                      onChange={e=>setSeaRows(rows=>rows.map((row,idx)=>idx===i?{...row,[f]:e.target.value}:row))} />
                  </div>
                ))}
                <div>
                  <Lbl>Qty</Lbl>
                  <input style={inp} type="number" value={r.qty}
                    onChange={e=>setSeaRows(rows=>rows.map((row,idx)=>idx===i?{...row,qty:e.target.value}:row))} />
                </div>
                <div>
                  <Lbl>Unit</Lbl>
                  <select style={{...inp,padding:'0.48rem'}} value={r.unit}
                    onChange={e=>setSeaRows(rows=>rows.map((row,idx)=>idx===i?{...row,unit:e.target.value}:row))}>
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="m">m</option>
                    <option value="in">in</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
                {seaRows.length>1 && (
                  <button onClick={()=>setSeaRows(r=>r.filter((_,idx)=>idx!==i))}
                    style={{ background:'rgba(255,50,50,0.15)', border:'none', borderRadius:'0.3rem', color:'rgba(255,100,100,0.8)', cursor:'pointer', padding:'0.48rem 0.6rem', alignSelf:'flex-end' }}>✕</button>
                )}
              </div>
            ))}
            <div style={{ display:'flex', gap:'0.8rem', alignItems:'center' }}>
              <button onClick={()=>setSeaRows(r=>[...r,{l:'',w:'',h:'',qty:'1',unit:'cm'}])}
                style={{ background:'rgba(200,168,78,0.1)', border:'1px solid rgba(200,168,78,0.25)', borderRadius:'0.4rem', color:'#c8a84e', cursor:'pointer', padding:'0.4rem 0.8rem', fontFamily:"'DM Sans',sans-serif", fontSize:'0.72rem', fontWeight:600, whiteSpace:'nowrap' }}>
                + Add Row
              </button>
              <div style={{ flex:1 }}>
                <Lbl>Total Weight (kg)</Lbl>
                <input style={inp} type="number" value={seaWeight} placeholder="0" onChange={e=>setSeaWeight(e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {/* AIR */}
        {tab==='air' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 0.7fr', gap:'0.5rem' }}>
              {[['L (cm)',airL,setAirL],['W (cm)',airW,setAirW],['H (cm)',airH,setAirH],['Qty',airQty,setAirQty]].map(([lb,val,setter])=>(
                <div key={lb}>
                  <Lbl>{lb}</Lbl>
                  <input style={inp} type="number" value={val} placeholder="0" onChange={e=>setter(e.target.value)} />
                </div>
              ))}
            </div>
            <div>
              <Lbl>Actual Weight (kg/pc)</Lbl>
              <input style={inp} type="number" value={airActual} placeholder="0" onChange={e=>setAirActual(e.target.value)} />
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', margin:0 }}>
              Vol. weight = L×W×H ÷ 5000 per piece
            </p>
          </div>
        )}

        {/* LAND */}
        {tab==='land' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            <div>
              <Lbl>Truck Type</Lbl>
              <select style={{...inp,padding:'0.52rem'}} value={truckType} onChange={e=>setTruckType(e.target.value)}>
                <option value="3.5t">3.5t Pickup (18 CBM)</option>
                <option value="10t">10t Truck (40 CBM)</option>
                <option value="20t">20t Truck (80 CBM)</option>
                <option value="40t">40t Semi (120 CBM)</option>
              </select>
            </div>
            {landRows.map((r,i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 0.6fr 0.8fr auto', gap:'0.35rem', alignItems:'end' }}>
                {['l','w','h'].map(f=>(
                  <div key={f}>
                    <Lbl>{f.toUpperCase()} (cm)</Lbl>
                    <input style={inp} type="number" value={r[f]} placeholder="0"
                      onChange={e=>setLandRows(rows=>rows.map((row,idx)=>idx===i?{...row,[f]:e.target.value}:row))} />
                  </div>
                ))}
                <div>
                  <Lbl>Qty</Lbl>
                  <input style={inp} type="number" value={r.qty}
                    onChange={e=>setLandRows(rows=>rows.map((row,idx)=>idx===i?{...row,qty:e.target.value}:row))} />
                </div>
                <div>
                  <Lbl>kg/pc</Lbl>
                  <input style={inp} type="number" value={r.weight}
                    onChange={e=>setLandRows(rows=>rows.map((row,idx)=>idx===i?{...row,weight:e.target.value}:row))} />
                </div>
                {landRows.length>1 && (
                  <button onClick={()=>setLandRows(r=>r.filter((_,idx)=>idx!==i))}
                    style={{ background:'rgba(255,50,50,0.15)', border:'none', borderRadius:'0.3rem', color:'rgba(255,100,100,0.8)', cursor:'pointer', padding:'0.48rem 0.6rem', alignSelf:'flex-end' }}>✕</button>
                )}
              </div>
            ))}
            <button onClick={()=>setLandRows(r=>[...r,{l:'',w:'',h:'',qty:'1',weight:''}])}
              style={{ background:'rgba(200,168,78,0.1)', border:'1px solid rgba(200,168,78,0.25)', borderRadius:'0.4rem', color:'#c8a84e', cursor:'pointer', padding:'0.4rem 0.8rem', fontFamily:"'DM Sans',sans-serif", fontSize:'0.72rem', fontWeight:600, alignSelf:'flex-start' }}>
              + Add Row
            </button>
          </div>
        )}

        {/* WAREHOUSE */}
        {tab==='warehouse' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.8rem' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 0.7fr', gap:'0.5rem' }}>
              {[['L (cm)',whL,setWhL],['W (cm)',whW,setWhW],['H (cm)',whH,setWhH],['Qty',whQty,setWhQty]].map(([lb,val,setter])=>(
                <div key={lb}>
                  <Lbl>{lb}</Lbl>
                  <input style={inp} type="number" value={val} placeholder="0" onChange={e=>setter(e.target.value)} />
                </div>
              ))}
            </div>
            <div>
              <Lbl>Storage Days</Lbl>
              <input style={inp} type="number" value={whDays} placeholder="30" onChange={e=>setWhDays(e.target.value)} />
            </div>
            <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'0.68rem', color:'rgba(255,255,255,0.3)', margin:0 }}>
              Rate: $0.35 / CBM / day (indicative)
            </p>
          </div>
        )}

        {/* ── Results ── */}
        <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:8 }}
            transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}
            style={{
              marginTop:'1.4rem',
              background:'rgba(8,8,18,0.85)',
              border:'1.5px solid rgba(200,168,78,0.35)',
              borderRadius:'1rem',
              padding:'1.4rem',
              boxShadow:'0 20px 50px rgba(0,0,0,0.4)',
              position:'relative', overflow:'hidden',
            }}
          >
            {/* Glow blob */}
            <div style={{ position:'absolute', top:'-50%', right:'-20%', width:'140px', height:'140px', background:'rgba(200,168,78,0.1)', filter:'blur(36px)', borderRadius:'50%', pointerEvents:'none' }} />

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem' }}>
              <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.25rem', letterSpacing:'0.08em', color:'#c8a84e' }}>
                AI LOAD ANALYSIS
              </span>
              <div style={{ width:8, height:8, background:'#25c864', borderRadius:'50%', boxShadow:'0 0 10px #25c864' }} />
            </div>

            {/* Stats grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem', marginBottom:'1.2rem' }}>
              <div style={{ background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, marginBottom:'0.2rem', letterSpacing:'0.08em' }}>
                  {results.tab==='air' ? 'Chargeable Wt' : 'Total Volume'}
                </span>
                <span style={{ fontSize:'1.5rem', fontFamily:"'Bebas Neue',sans-serif", color:'#fff', letterSpacing:'0.04em' }}>
                  {results.tab==='air' ? results.chargeable : results.cbm}
                  <span style={{ fontSize:'0.7rem', marginLeft:'0.3rem', color:'#c8a84e' }}>
                    {results.tab==='air' ? 'KG' : 'CBM'}
                  </span>
                </span>
              </div>

              {results.loadPct && (
                <div style={{ background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, marginBottom:'0.2rem', letterSpacing:'0.08em' }}>
                    Usage Efficiency
                  </span>
                  <div style={{ display:'flex', alignItems:'baseline', gap:'0.2rem' }}>
                    <span style={{ fontSize:'1.5rem', fontFamily:"'Bebas Neue',sans-serif", color: results.loadPct>90 ? '#ff5050' : '#fff' }}>
                      {results.loadPct}
                    </span>
                    <span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', fontFamily:"'Bebas Neue',sans-serif" }}>%</span>
                  </div>
                </div>
              )}

              {results.tab==='air' && (
                <div style={{ background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.05)', gridColumn:'span 2' }}>
                  <span style={{ display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, marginBottom:'0.4rem', letterSpacing:'0.08em' }}>
                    Billing Basis
                  </span>
                  <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1rem', color:'#c8a84e', letterSpacing:'0.05em' }}>
                    {results.basis} Weight — {results.basis==='Volumetric' ? results.volWeight : results.actWeight} kg
                  </span>
                </div>
              )}

              {results.tab==='land' && (
                <>
                  <div style={{ background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, marginBottom:'0.2rem', letterSpacing:'0.08em' }}>
                      Volume Fill
                    </span>
                    <span style={{ fontSize:'1.5rem', fontFamily:"'Bebas Neue',sans-serif", color: results.volPct>90?'#ff5050':'#fff' }}>
                      {results.volPct}<span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', fontFamily:"'Bebas Neue',sans-serif" }}>%</span>
                    </span>
                  </div>
                  <div style={{ background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, marginBottom:'0.2rem', letterSpacing:'0.08em' }}>
                      Weight Fill
                    </span>
                    <span style={{ fontSize:'1.5rem', fontFamily:"'Bebas Neue',sans-serif", color: results.wtPct>90?'#ff5050':'#fff' }}>
                      {results.wtPct}<span style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)', fontFamily:"'Bebas Neue',sans-serif" }}>%</span>
                    </span>
                  </div>
                </>
              )}

              {results.tab==='warehouse' && (
                <div style={{ background:'rgba(255,255,255,0.03)', padding:'0.8rem', borderRadius:'0.6rem', border:'1px solid rgba(255,255,255,0.05)', gridColumn:'span 2' }}>
                  <span style={{ display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', fontWeight:600, marginBottom:'0.2rem', letterSpacing:'0.08em' }}>
                    Indicative Cost
                  </span>
                  <span style={{ fontSize:'1.5rem', fontFamily:"'Bebas Neue',sans-serif", color:'#fff' }}>
                    ${results.cost}
                    <span style={{ fontSize:'0.7rem', marginLeft:'0.3rem', color:'#c8a84e' }}>USD</span>
                  </span>
                </div>
              )}
            </div>

            {/* Load bar */}
            {results.loadPct && (
              <div style={{ marginBottom:'1.2rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.62rem', color:'rgba(255,255,255,0.3)', marginBottom:'0.4rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  <span>Container Capacity</span>
                  <span>{results.loadPct}%</span>
                </div>
                <div style={{ height:'5px', background:'rgba(255,255,255,0.08)', borderRadius:'3px', overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }}
                    animate={{ width:`${Math.min(100,results.loadPct)}%` }}
                    transition={{ duration:0.9, ease:'easeOut' }}
                    style={{
                      height:'100%',
                      background: results.loadPct>90
                        ? 'linear-gradient(90deg,#c8a84e,#ff5050)'
                        : 'linear-gradient(90deg,#c8a84e,#e8d48a)',
                      borderRadius:'3px',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Container recommendation */}
            {results.container && (
              <div style={{ padding:'0.8rem', background:'rgba(200,168,78,0.08)', borderRadius:'0.6rem', border:'1px dashed rgba(200,168,78,0.3)', textAlign:'center', marginBottom:'1.2rem' }}>
                <span style={{ display:'block', fontSize:'0.58rem', color:'#c8a84e', textTransform:'uppercase', fontWeight:700, marginBottom:'0.2rem', letterSpacing:'0.08em' }}>
                  AI Recommendation
                </span>
                <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.05rem', color:'#fff', letterSpacing:'0.04em' }}>
                  {results.container}
                </span>
              </div>
            )}

            {/* Export buttons */}
            <div style={{ display:'flex', gap:'0.7rem' }}>
              <button onClick={exportCSV}
                style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'0.5rem', color:'#fff', padding:'0.65rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
                📥 CSV
              </button>
              <button onClick={exportPDF}
                style={{ flex:1, background:'#c8a84e', border:'none', borderRadius:'0.5rem', color:'#0a0a0f', padding:'0.65rem', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontSize:'0.75rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.4rem', transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='0.88'}
                onMouseLeave={e=>e.currentTarget.style.opacity='1'}>
                📄 PDF Report
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* ── Calculate button ── */}
      <div style={{ padding:'1rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.07)', flexShrink:0, background:'rgba(255,255,255,0.02)' }}>
        <button onClick={calculate}
          style={{ width:'100%', padding:'1rem', background:'linear-gradient(135deg,#c8a84e,#a8843e)', border:'none', borderRadius:'0.75rem', color:'#050508', fontFamily:"'Bebas Neue',sans-serif", fontSize:'1.15rem', letterSpacing:'0.16em', cursor:'pointer', transition:'all 0.3s', boxShadow:'0 10px 30px rgba(200,168,78,0.2)' }}
          onMouseEnter={e=>{e.currentTarget.style.opacity='0.88'; e.currentTarget.style.transform='translateY(-1px)'}}
          onMouseLeave={e=>{e.currentTarget.style.opacity='1';   e.currentTarget.style.transform='translateY(0)'}}>
          GENERATE AI ANALYSIS
        </button>
      </div>
    </div>
  )
}

// ── Section wrapper ─────────────────────────────────────────────────────────
export default function LogisticsTools() {
  return (
    <section id="tools" style={{
      background: '#050508',
      padding: 'clamp(80px,10vw,130px) clamp(1.5rem,8vw,8rem)',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Ambient glows */}
      <div style={{ position:'absolute', top:'5%', right:'-10%', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle,rgba(200,168,78,0.05) 0%,transparent 65%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'5%', left:'-8%', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(30,60,180,0.05) 0%,transparent 65%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'1400px', margin:'0 auto', position:'relative', zIndex:1 }}>

        {/* Heading */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-8%' }}
          transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
          style={{ marginBottom:'3.5rem' }}
        >
          <span style={{ display:'block', fontFamily:"'DM Sans',sans-serif", fontSize:'11px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(200,168,78,0.7)', marginBottom:'1rem' }}>
            Client Utilities
          </span>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(42px,7vw,90px)', letterSpacing:'0.05em', color:'rgba(255,255,255,0.92)', lineHeight:1, marginBottom:'1.2rem' }}>
            Freight <span style={{ color:'#c8a84e' }}>Calculators</span>
          </h2>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'clamp(15px,1.6vw,18px)', color:'rgba(255,255,255,0.45)', maxWidth:'55ch', lineHeight:1.8 }}>
            Accurate CBM and chargeable weight estimates in real time — Sea, Air, Land or Warehouse — before you send us an enquiry.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'clamp(1.5rem,3vw,3rem)', alignItems:'start' }}>

          {/* Left: calculator card */}
          <motion.div
            initial={{ opacity:0, x:-24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-8%' }}
            transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
            style={{
              background: 'rgba(255,255,255,0.025)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '2rem',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '520px',
            }}
          >
            <LoadCalculator />
          </motion.div>

          {/* Right: container guide card */}
          <motion.div
            initial={{ opacity:0, x:24 }}
            whileInView={{ opacity:1, x:0 }}
            viewport={{ once:true, margin:'-8%' }}
            transition={{ duration:0.9, delay:0.12, ease:[0.16,1,0.3,1] }}
            animate={{ rotateZ: [-0.8, 0.8, -0.8] }}
            style={{ perspective: 800 }}
          >
            <motion.div
              animate={{ rotateZ: [-0.8, 0.8, -0.8] }}
              transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
              whileHover={{ rotateZ: 0, scale: 1.02, transition: { duration: 0.3 } }}
              style={{
                background:'rgba(255,255,255,0.02)',
                border:'1px solid rgba(255,255,255,0.07)',
                borderRadius:'1.5rem',
                padding:'clamp(2rem,4vw,3.5rem)',
                transformOrigin: 'center center',
                willChange: 'transform',
              }}
            >
              <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'2rem' }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background:'rgba(200,168,78,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0 }}>📦</div>
                <h3 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'clamp(28px,3.5vw,40px)', letterSpacing:'0.1em', color:'#fff', margin:0 }}>Container Guide</h3>
              </div>
              {[
                { name:'20ft Standard', cbm:'≤25 CBM', payload:'21,700 kg' },
                { name:'40ft Standard', cbm:'≤67 CBM', payload:'26,500 kg' },
                { name:'40ft High Cube', cbm:'≤76 CBM', payload:'26,500 kg' },
              ].map((c,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'1rem 0', borderBottom: i<2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'18px', color:'rgba(255,255,255,0.75)', fontWeight:600 }}>{c.name}</span>
                  <div style={{ display:'flex', gap:'0.8rem', alignItems:'center' }}>
                    <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:'17px', letterSpacing:'0.1em', color:'#c8a84e' }}>{c.cbm}</span>
                    <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:'15px', color:'rgba(255,255,255,0.35)' }}>{c.payload}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
