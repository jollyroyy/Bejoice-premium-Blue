import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal() {
  useEffect(() => {
    const r1 = setTimeout(() => ScrollTrigger.refresh(), 1000)
    const r2 = setTimeout(() => ScrollTrigger.refresh(), 3000)
    return () => { clearTimeout(r1); clearTimeout(r2) }
  }, [])

  return null
}
