import { bandStats } from '../data/content'

/* ============================================================================
   Stats band — an infinite marquee on a gold fill.

   CONTRAST: the fill is brand gold, so the text is navy (--color-on-gold,
   6.37:1). White on gold is 2.59:1 and is the one pairing the contrast contract
   names as never allowed — that is why this is navy rather than white.

   MOTION: the track runs continuously — no hover pause and no visible control,
   by request. It collapses to a static row under prefers-reduced-motion, which
   is the only remaining way a user can stop it.

   The moving track is aria-hidden and the figures are exposed once through the
   visually-hidden <dl> — otherwise a screen reader would read the same three
   stats four times over.
   ========================================================================== */

export default function StatsBand() {
  // Two runs per half, four total: enough width to cover a wide viewport, and
  // translating -50% lands on the identical second half.
  const half = [...bandStats, ...bandStats]

  return (
    <section
      aria-label="Key figures"
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-gold-soft)_0%,var(--color-gold)_100%)]"
    >
      {/* Real content for assistive tech — announced once, not four times. */}
      <dl className="sr-only">
        {bandStats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="marquee overflow-hidden py-6 md:py-7">
        <div className="marquee-track" aria-hidden="true">
          {[...half, ...half].map((s, i) => (
            <span key={i} className="flex shrink-0 items-baseline gap-3 px-8 md:px-11">
              <span data-numeric className="font-display text-[1.5rem] font-semibold leading-none tracking-display text-[var(--color-on-gold)] md:text-[1.875rem]">
                {s.value}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-on-gold)]/80">
                {s.label}
              </span>
              <span aria-hidden="true" className="ml-5 h-1.5 w-1.5 shrink-0 self-center rounded-full bg-[var(--color-on-gold)]/35" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
