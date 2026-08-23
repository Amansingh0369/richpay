import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

/* ============================================================================
   Inertial smooth scrolling (Lenis) — the weighted, slightly-trailing scroll
   feel from the reference site.

   Two rules it has to obey here:

   1. It NEVER runs under prefers-reduced-motion. Scroll hijacking is exactly the
      kind of motion that triggers vestibular discomfort, so those users get the
      browser's native scroll untouched.
   2. While it is running, CSS `scroll-behavior: smooth` must be off, or the two
      smoothing systems fight each other and anchor jumps stutter. The
      `lenis-active` class on <html> handles that (see global.css).

   `getLenis()` lets ScrollManager route its anchor jumps through Lenis instead
   of window.scrollTo, which would otherwise be overridden mid-flight.
   ========================================================================== */

let instance = null
export const getLenis = () => instance

export default function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let lenis = null
    let raf = 0

    const start = () => {
      if (lenis || mq.matches) return
      lenis = new Lenis({
        duration: 1.05,          // weight; higher = more trailing
        smoothWheel: true,
        touchMultiplier: 1.6,
        wheelMultiplier: 0.9,
      })
      instance = lenis
      document.documentElement.classList.add('lenis-active')
      const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop) }
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      if (!lenis) return
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenis = null
      instance = null
      document.documentElement.classList.remove('lenis-active')
    }

    mq.matches ? stop() : start()
    // Honour the setting being changed while the page is open.
    const onChange = () => (mq.matches ? stop() : start())
    mq.addEventListener('change', onChange)
    return () => { mq.removeEventListener('change', onChange); stop() }
  }, [])

  return null
}
