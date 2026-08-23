import { company, finalCta } from '../data/content'
import Icon from './Icons'
import DottedGlow from './DottedGlow'
import { Reveal, Group, Item, WordsUp, motion, useReducedMotion } from './motion'

/* ============================================================================
   Closing call to action.

   The gold hairline curve that used to sit across the bottom is gone. In its
   place the band gets depth from things that do not draw a line across the
   reader's path: a canvas field of dots that shimmer independently, two slow
   gold blobs drifting behind the copy, and a gold rule under the heading. The
   The dot field is masked to a soft ellipse: strongest through the middle of
   the band, gone by the edges, so it never collides with the section borders.
   It sits behind the copy rather than around it, which is only acceptable
   because the dots are small and sparse — measured, the lead still computes to
   about 6.2:1 sitting directly on top of a fully-lit dot.

   "Talk to an advisor" opens the reader's mail client, exactly as Contact Us in
   the header does — same address, same accessible-name pattern, so the two
   behave identically wherever someone meets them.
   ========================================================================== */

export default function FinalCta() {
  const reduce = useReducedMotion()

  return (
    <section id="apply" className="surface-navy grain relative overflow-hidden py-24 md:py-32">
      {/* Masked to a soft ellipse — full through the middle, gone by the edges. */}
      <DottedGlow
        className="pointer-events-none"
        style={{
          maskImage: 'radial-gradient(115% 85% at 50% 45%, #000 35%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(115% 85% at 50% 45%, #000 35%, transparent 78%)',
        }}
        gap={19}
        radius={2.2}
        colorVar="--color-gold-soft"
        glowColorVar="--color-gold"
        opacity={0.34}
        speedMin={0.25}
        speedMax={1.2}
      />

      {/* Two blobs on long, offset drifts. Transform and opacity only, so this
          stays on the compositor, and both stop under reduced motion. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-[var(--color-gold)]/16 blur-3xl"
        animate={reduce ? undefined : { x: [0, -60, 30, 0], y: [0, 30, -20, 0], scale: [1, 1.12, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[var(--color-gold)]/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, 50, -30, 0], y: [0, -34, 22, 0], scale: [1, 0.92, 1.1, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <div className="container-page relative text-center">
        <Reveal>
          {/* The gradient goes on each WORD, not on the h2. `.text-gradient`
              sets color:transparent with background-clip:text; put it on the
              parent and WordsUp's per-word spans inherit the transparency
              without inheriting the background, so the heading renders as
              nothing at all. Hero hit this and solves it the same way. */}
          {/* One line from md up. Forty characters is the longest heading on
              the site, so it needs the full container AND a lower ceiling than
              the usual 3.25rem — at that size it is wider than the 1200px page
              and cannot fit on one line at any wrapper width. Tighter tracking
              buys back a couple of percent. It still wraps on a phone rather
              than shrinking below readable. */}
          <h2 className="text-[clamp(1.875rem,0.55rem+3.27vw,3.5rem)] font-bold leading-[1.08] md:whitespace-nowrap md:tracking-tight">
            <WordsUp text={finalCta.title} wordClassName="text-gradient" />
          </h2>
          <span className="rule-gold mx-auto mt-7" aria-hidden="true" />
          <p className="lead-on-navy mx-auto mt-6 max-w-2xl">{finalCta.sub}</p>
        </Reveal>

        {/* The proof points read as chips rather than a run-on line — four short
            claims in a row otherwise blur into one sentence. */}
        <Group as="ul" className="mt-9 flex flex-wrap justify-center gap-2.5" gap={0.07}>
          {finalCta.points.map((p) => (
            <Item as="li" key={p}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.09] px-4 py-2 text-sm text-white/90 backdrop-blur-md">
                <span className="shrink-0 text-[var(--color-gold-soft)]"><Icon name="check" size={15} /></span>
                {p}
              </span>
            </Item>
          ))}
        </Group>

        <Reveal delay={90}>
          <div className="mt-11 flex flex-wrap justify-center gap-3">
            {/* Same destination and same accessible-name shape as Contact Us in
                the header, so the two controls behave identically. */}
            <a
              href={`mailto:${company.email}`}
              aria-label={`${finalCta.cta} — email ${company.email}`}
              className="btn btn-gold group"
            >
              {finalCta.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                <Icon name="arrow-right" size={18} />
              </span>
            </a>
            <a href="#calculator" className="btn btn-outline-invert">{finalCta.secondary}</a>
          </div>

          <p className="mt-6 text-sm text-white/60">
            Or call{' '}
            <a
              href={company.phoneHref}
              data-numeric
              className="font-semibold text-[var(--color-gold-soft)] underline-offset-4 transition-colors hover:underline"
            >
              {company.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
