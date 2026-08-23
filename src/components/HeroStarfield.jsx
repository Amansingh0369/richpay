import { useEffect, useRef } from 'react'

/* ============================================================================
   React host for the "Starfield Close" scene.

   The scene module is loaded with a dynamic import, so three.js and the
   postprocessing chain land in a separate chunk fetched AFTER first paint
   rather than blocking it. Nothing three-related is in the main bundle.

   It never loads at all under prefers-reduced-motion — a camera diving down a
   tunnel is exactly the motion that triggers vestibular discomfort, and the
   .surface-hero CSS gradient underneath is the fallback.
   ========================================================================== */

export default function HeroStarfield({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = ref.current
    if (!canvas) return

    // Bail before fetching the chunk at all if the device cannot render it.
    try {
      const probe = document.createElement('canvas')
      if (!(probe.getContext('webgl') || probe.getContext('experimental-webgl'))) return
    } catch { return }

    let scene = null
    let cancelled = false

    import('../three/starfield.js')
      .then(({ createStarfield }) => createStarfield(canvas))
      .then((s) => {
        if (cancelled) { s.dispose(); return }
        scene = s
      })
      .catch(() => { /* leave the CSS gradient showing */ })

    return () => { cancelled = true; scene?.dispose() }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
