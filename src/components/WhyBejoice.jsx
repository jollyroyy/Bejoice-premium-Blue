import { motion } from 'framer-motion'

export default function WhyBejoice() {

  return (
    <section id="why-us" className="relative pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(200,168,78,0.03) 80px),repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(200,168,78,0.03) 80px)`,
      }}/>

      <div className="max-w-7xl mx-auto">

        <div style={{ textAlign:'center' }}>
          <div className="section-glass-header" style={{ marginBottom: '2rem', display: 'inline-block' }}>
            <motion.h2
              className="no-reveal hg"
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
                filter: 'drop-shadow(0 0 30px rgba(200,168,78,0.3))',
              }}
            >
              <span style={{ color: '#ffffff' }}>WHY</span><br /><span style={{ color: '#c8a84e' }}>BEJOICE</span>
            </motion.h2>
          </div>
        </div>

      </div>
    </section>
  )
}
