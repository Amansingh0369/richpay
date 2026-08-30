import { Fragment } from 'react'
import { hero } from '../data/content'
import Icon from './Icons'
import { motion, CountUp, WordsUp, useReducedMotion } from './motion'
import HeroStarfield from './HeroStarfield'
import HeroProofCard from './HeroProofCard'

/* ============================================================================
   Hero.

   Structure (7/5 split, proof panel on the right) is adapted from 21st.dev
   "Glassmorphism Trust Hero" (id 9050). The background technique — a single
   `radial-gradient(125% 125% at 50% 10%, …)` field — is adapted from the
   Tailwind background snippet, recoloured to official navies.

   CLEAN-UP PASS. What was removed and why:
   · Six stacked decorative layers (two radials + linear + grain + dot grid +
     animated arc + parallax watermark) collapsed into ONE gradient. That pile
     was the main reason the section read as busy rather than premium.
   · Gold was doing seven jobs (pill, headline, stat figures, icon tile, arc,
     bloom, CTA). The landing pattern for Trust & Authority is "navy corporate
     base, accent for CTA only", so gold now appears twice: the headline accent
     line and the primary CTA. Stats went white — cleaner AND higher contrast.
   · Two floating glass panels became one card; the trust row is now a hairline
     footer inside it instead of a second panel.
   · Pointer-tracked Tilt removed — it jittered under the cursor and fought the
     Subtle (3/10) motion tier.

   Motion is deliberately restrained per that tier: one staggered entrance,
   ease-out (deceleration on arrival), plus the progress fill and count-ups
   that carry actual meaning. Everything collapses under reduced motion.
   ========================================================================== */

const EASE = [0.22, 0.61, 0.36, 1]   // --ease-out: decelerate on arrival

export default function Hero() {
  const { approvalCard: card, trustStrip } = hero
  const reduce = useReducedMotion()

  // One shared entrance: container staggers, children rise. Short travel (12px)
  // so it reads as a fade rather than a slide.
  const container = reduce ? {} : {
    initial: 'hidden',
    animate: 'show',
    variants: { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } },
  }
  const item = reduce ? {} : {
    variants: {
      hidden: { opacity: 0, y: 12 },
      show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
    },
  }

  return (
    <section id="top" className="surface-hero relative overflow-hidden pt-32 pb-20 md:pt-36 md:pb-24">
      {/* WebGL starfield. .surface-hero's CSS gradient stays on the section as
          the fallback for reduced motion and for devices without WebGL. */}
      <HeroStarfield />

      {/* Legibility scrim, between the shader and the content.
          The shader is generative: a noise ridge can drift anywhere, and at its
          brightest the field reaches ~rgb(96,100,94). White text survives that
          (6.0:1) but the gold accent words fall to 2.33:1. Rather than dim the
          whole effect, this holds the left column — where the headline lives —
          near navy and lets the shader breathe on the right, behind the card,
          which carries its own opaque surface anyway. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(100deg, rgba(4,20,42,.90) 0%, rgba(4,20,42,.86) 30%, rgba(4,20,42,.58) 58%, rgba(4,20,42,.34) 100%)',
        }}
      />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">

          {/* ---------- Left: the pitch ---------- */}
          <motion.div className="lg:col-span-7" {...container}>
            {/* Four hard lines — lead, emphasis, lead, emphasis. Each emphasis
                word gets its own line so the accent face reads as a deliberate
                beat rather than an inline substitution. Leading stays at 1.1
                here; the accent span carries its own line-height, because
                Boldonse sets on a much taller body than Poppins. */}
            <motion.h1
              className="font-display text-[clamp(2rem,1.3rem+2.2vw,3rem)] font-semibold leading-[1.3] tracking-display text-white"
              {...item}
            >
              {hero.headlineLines.map(({ lead, accent }) => (
                <Fragment key={accent}>
                  <span className="block"><WordsUp text={lead} amount={0.1} delay={0.05} /></span>
                  <span className="block font-accent"><WordsUp text={accent} wordClassName="text-gold-gradient" amount={0.1} delay={0.16} /></span>
                </Fragment>
              ))}
            </motion.h1>

            <motion.p className="mt-6 max-w-md text-[1.125rem] leading-relaxed text-white/72" {...item}>
              {hero.sub}
            </motion.p>

            <motion.div className="mt-5 flex flex-wrap gap-3.5" {...item}>
              <a href="#calculator" className="btn btn-gold group">
                {hero.primaryCta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrow-right" size={18} />
                </span>
              </a>
              <a href="#calculator" className="btn btn-outline-invert">{hero.secondaryCta}</a>
            </motion.div>

            <motion.dl className="mt-7 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8" {...item}>
              {hero.stats.map((s) => {
                // A figure ("4.8", "34,000+") and a phrase ("Less than 15
                // minutes") cannot share one type size in a 3-up row this
                // narrow — the phrase would break to three lines and drag the
                // baseline of its own label below the other two. Long values
                // step down and wrap to two balanced lines instead, which keeps
                // the row's label baseline level.
                const isPhrase = s.value.length > 9
                return (
                <div key={s.label} className="flex flex-col">
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="flex flex-1 flex-col">
                    <span
                      data-numeric
                      className={`flex items-center gap-1 font-display font-semibold text-white ${
                        isPhrase
                          ? 'text-[0.9375rem] leading-[1.25] text-balance sm:text-[1rem] md:text-[1.0625rem]'
                          : 'text-[1.375rem] sm:text-[1.625rem] md:text-[1.75rem]'
                      }`}
                    >
                      <CountUp value={s.value} />
                      {s.star && <Icon name="star" size={16} className="text-[var(--color-gold)]" />}
                    </span>
                    <span className="mt-auto block pt-1.5 text-sm text-white/65">{s.label}</span>
                  </dd>
                </div>
                )
              })}
            </motion.dl>

            {/* Credential line. No pill, no border — it belongs with the other
                trust signals rather than above the headline. */}
            <motion.p className="mt-6 flex items-center gap-2 text-[0.8125rem] text-white/60" {...item}>
              <Icon name="shield" size={14} className="text-white/45" />
              {hero.eyebrow}
            </motion.p>
          </motion.div>

          {/* ---------- Right: one proof panel ---------- */}
          <motion.div
            className="lg:col-span-5"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          >
            <HeroProofCard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
