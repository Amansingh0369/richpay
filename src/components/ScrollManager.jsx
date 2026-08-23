import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/* ============================================================================
   The browser only anchors/restores scroll on real document loads. With
   client-side routing we do it ourselves:

     · hash, same route      -> smooth scroll (the user is moving within a page,
                                so the motion conveys where they went)
     · hash, different route -> instant jump. Animating 12,000px after a route
                                change isn't continuity, it's a 2.5s wait, and
                                the intermediate content is meaningless.
     · no hash               -> new page, go to the top instantly

   `scroll-padding-top` on <html> keeps the target clear of the fixed header,
   so scrollIntoView already lands correctly — nothing to offset here.
   Reduced motion downgrades every smooth scroll to an instant one.
   ========================================================================== */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const prevPath = useRef(pathname)

  useEffect(() => {
    const samePage = prevPath.current === pathname
    prevPath.current = pathname

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = samePage && !reduce ? 'smooth' : 'instant'

    // Two frames: one for the route's first paint, one for layout to settle
    // before we measure the target's position.
    let raf2
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior, block: 'start' })
      })
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [pathname, hash])

  return null
}
