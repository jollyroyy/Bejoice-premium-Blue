import { useEffect, useState, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import VideoHero from './components/VideoHero'
const LogisticsTools = lazy(() => import('./components/LogisticsTools'))
const Services = lazy(() => import('./components/Services'))
const BejoiceGlobe = lazy(() => import('./components/BejoiceGlobe'))
const WhyBejoice = lazy(() => import('./components/WhyBejoice'))
const Certifications = lazy(() => import('./components/Certifications'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))
import FloatingBookCTA from './components/FloatingBookCTA'
import QuickQuoteModal from './components/QuickQuoteModal'
import ScrollProgress from './components/ScrollProgress'
import GlobalInteractions from './components/GlobalInteractions'
import ScrollReveal from './components/ScrollReveal'
import { LangProvider } from './context/LangContext'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false)
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    // Force top immediately — before browser can restore position
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
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
    // Snap to top after Lenis initialises — prevents drift on refresh
    lenis.scrollTo(0, { immediate: true })

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
      <ScrollReveal />
      <Nav onQuoteClick={() => setQuoteOpen(true)} />
      <main>
        <VideoHero onQuoteClick={() => setQuoteOpen(true)} />
        <Suspense fallback={null}>
          <Contact />
          <LogisticsTools />
          <Services />
          <BejoiceGlobe />
          <WhyBejoice />
          <Certifications />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <FloatingBookCTA />
      {quoteOpen && <QuickQuoteModal onClose={() => setQuoteOpen(false)} />}
    </div>
    </LangProvider>
  )
}
