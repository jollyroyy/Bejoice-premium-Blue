import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import VideoHero from './components/VideoHero'
import LogisticsTools from './components/LogisticsTools'
import Services from './components/Services'
import HeavyCargo from './components/HeavyCargo'
import HeavyLift from './components/HeavyLift'
import WhyBejoice from './components/WhyBejoice'
import KeyMarkets from './components/KeyMarkets'
import Certifications from './components/Certifications'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingBookCTA from './components/FloatingBookCTA'
import QuickQuoteModal from './components/QuickQuoteModal'
import ScrollProgress from './components/ScrollProgress'
import GlobalInteractions from './components/GlobalInteractions'
import { LangProvider } from './context/LangContext'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false)
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    })

    window.__lenis = lenis

    // Correct Lenis ↔ GSAP ScrollTrigger bridge
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return (
    <LangProvider>
    <div className="grain">
      <ScrollProgress />
      <GlobalInteractions />
      <Nav onQuoteClick={() => setQuoteOpen(true)} />
      <main>
        <VideoHero onQuoteClick={() => setQuoteOpen(true)} />
        <LogisticsTools />
        <Services />
        <HeavyLift />
        <HeavyCargo />
        <WhyBejoice />
        <KeyMarkets />
        <Certifications />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingBookCTA />
      {quoteOpen && <QuickQuoteModal onClose={() => setQuoteOpen(false)} />}
    </div>
    </LangProvider>
  )
}
