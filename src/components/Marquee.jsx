import { motion, useReducedMotion } from './motion'

/* ============================================================================
   Infinite marquee.

   The track holds the item set TWICE and travels -50%, which lands exactly
   where it started — a seamless loop with no jump. That is why the gap between
   cards is a margin on each card rather than a flex `gap`: with a flex gap the
   track measures 2N cards plus 2N-1 gaps, so half of it is half a gap short of
   one full period and the loop visibly stutters every lap. Margins make each
   card exactly (width + gap) wide and the halves identical.

   The duplicate run is aria-hidden, so the quotes are announced once rather
   than twice.

   Under prefers-reduced-motion this renders nothing — the caller is expected to
   show a static layout instead, because a stopped marquee is a row of cards cut
   off at the viewport edge, not a usable fallback.
   ========================================================================== */

export default function Marquee({ items, renderItem, reverse = false, duration = '70s', itemClassName = '' }) {
  const reduce = useReducedMotion()
  if (reduce) return null

  const doubled = [...items, ...items]

  return (
    <div
      className={`marquee-track ${reverse ? 'marquee-track-reverse' : ''}`}
      style={{ '--marquee-duration': duration }}
    >
      {doubled.map((item, i) => (
        <div
          key={i}
          aria-hidden={i >= items.length ? 'true' : undefined}
          className={`shrink-0 ${itemClassName}`}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}

export { motion }
