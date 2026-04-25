import { useEffect, useState, lazy, Suspense, startTransition } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Nav from './components/Nav'
import VideoHero from './components/VideoHero'
const LogisticsTools = lazy(() => import('./components/LogisticsTools'))
const Services       = lazy(() => import('./components/Services'))
const WhyBejoice     = lazy(() => import('./components/WhyBejoice'))
const Certifications = lazy(() => import('./components/Certifications'))
const Contact        = lazy(() => import('./components/Contact'))
const Footer         = lazy(() => import('./components/Footer'))
const FloatingBookCTA = lazy(() => import('./components/FloatingBookCTA'))
const QuickQuoteModal = lazy(() => import('./components/QuickQuoteModal'))
import ScrollProgress from './components/ScrollProgress'
import GlobalInteractions from './components/GlobalInteractions'
import ScrollReveal from './components/ScrollReveal'
import { LangProvider } from './context/LangContext'
import {
  ContactSkeleton,
  LogisticsToolsSkeleton,
  ServicesSkeleton,
  CertificationsSkeleton,
  FooterSkeleton,
} from './components/SkeletonSection'
import { usePrefetchSections } from './hooks/usePrefetchSections'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false)
  // Warm all lazy chunks after first interaction — skeletons are never
  // shown on fast connections because the chunks are already cached.
  usePrefetchSections()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    // Force top immediately — before browser can restore position
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 2,
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

    const r1 = setTimeout(() => lenis.resize(), 1000)
    const r2 = setTimeout(() => lenis.resize(), 3000)

    return () => {
      clearTimeout(r1)
      clearTimeout(r2)
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
      <main id="main-content">
        <VideoHero onQuoteClick={() => setQuoteOpen(true)} />
        {/* Each Suspense boundary shows a skeleton that matches the section's
            rough shape — prevents layout jump and gives a LinkedIn-style
            progressive-load feel on slow connections.
            On fast connections the prefetch hook ensures chunks are already
            cached, so the skeleton is never shown at all. */}
        <Suspense fallback={<ContactSkeleton />}><Contact /></Suspense>
        <Suspense fallback={<LogisticsToolsSkeleton />}><LogisticsTools /></Suspense>
        <Suspense fallback={<ServicesSkeleton />}><Services /></Suspense>
        <Suspense fallback={<ServicesSkeleton />}><WhyBejoice /></Suspense>
        <Suspense fallback={<CertificationsSkeleton />}><Certifications /></Suspense>
      </main>
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}><FloatingBookCTA /></Suspense>
      {quoteOpen && (
        <Suspense fallback={null}>
          <QuickQuoteModal onClose={() => {
            // Wrap state update in startTransition so closing the modal
            // doesn't interrupt any ongoing paint/scroll work
            startTransition(() => setQuoteOpen(false))
          }} />
        </Suspense>
      )}
    </div>
    </LangProvider>
  )
}
