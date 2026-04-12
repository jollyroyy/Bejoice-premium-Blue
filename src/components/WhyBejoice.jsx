import { motion } from 'framer-motion'
import { useLang } from '../context/LangContext'
import ar from '../i18n/ar'

export default function WhyBejoice() {
  const { lang } = useLang()
  const isAr = lang === 'ar'

  return (
    <section id="why-us" className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(91,194,231,0.03) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(91,194,231,0.03) 80px)`,
      }}/>

      <div className="max-w-7xl mx-auto">

        {/* Outer card with meteor background */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 50%, rgba(91,194,231,0.018) 100%)',
          backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(91,194,231,0.28)',
          borderTop: '1px solid rgba(91,194,231,0.55)',
          borderRadius: 28,
          boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(91,194,231,0.06) inset, inset 0 1px 0 rgba(91,194,231,0.22), 0 0 50px rgba(91,194,231,0.06)',
          overflow: 'hidden', position: 'relative',
          padding: 'clamp(24px,3.5vw,48px)',
        }}>

          {/* Ambient light layers (matches Request a Private Quote) */}
          <div style={{ position:'absolute', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden', borderRadius:28 }}>
            <div style={{
              position:'absolute', inset:0,
              background:'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(91,194,231,0.1) 0%, transparent 60%)',
            }}/>
            <div style={{
              position:'absolute', bottom:'-10%', right:'-5%',
              width:'clamp(300px,50vw,600px)', height:'clamp(300px,50vw,600px)', borderRadius:'50%',
              background:'radial-gradient(circle, rgba(91,194,231,0.04) 0%, transparent 65%)',
            }}/>
            <div style={{
              position:'absolute', inset:0, opacity:0.4,
              backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(91,194,231,0.02) 60px),repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(91,194,231,0.02) 60px)',
            }}/>
          </div>


        <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <motion.h2
              className="no-reveal"
              initial={{ x: -70, opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
              whileInView={{ x: 0, opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
              viewport={{ once: true, margin: '-80px 0px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 'clamp(3rem,7vw,6rem)',
                letterSpacing: '0.07em', lineHeight: 1,
                margin: 0,
                color: '#ffffff',
                filter: 'drop-shadow(0 0 30px rgba(91,194,231,0.3))',
              }}
            >
              <span style={{ color: '#ffffff' }}>{isAr ? ar.whyBejoice.why : 'WHY'}</span><br /><span style={{ color: '#5BC2E7' }}>{isAr ? ar.whyBejoice.bejoice : 'BEJOICE'}</span>
            </motion.h2>
          </div>
        </div>
        </div>{/* end outer card */}

      </div>
    </section>
  )
}
