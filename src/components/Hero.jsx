import { Fragment } from 'react'
import { hero } from '../data/content'
import Icon from './Icons'
import { motion, CountUp, useReducedMotion } from './motion'

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
      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">

          {/* ---------- Left: the pitch ---------- */}
          <motion.div className="lg:col-span-7" {...container}>
            <motion.span className="pill pill-quiet" {...item}>
              <Icon name="shield" size={14} /> {hero.eyebrow}
            </motion.span>

            {/* Four hard lines — lead, emphasis, lead, emphasis. Each emphasis
                word gets its own line so the serif reads as a deliberate beat
                rather than an inline substitution. Leading is a touch looser
                than a sans-only stack would need, to clear the serif descenders
                in "clarity" and "confidence". */}
            <motion.h1
              className="mt-7 font-display text-[clamp(2rem,1.3rem+2.2vw,3rem)] font-semibold leading-[1.1] tracking-display text-white"
              {...item}
            >
              {hero.headlineLines.map(({ lead, accent }) => (
                <Fragment key={accent}>
                  <span className="block">{lead}</span>
                  <span className="block font-accent text-gold-gradient">{accent}</span>
                </Fragment>
              ))}
            </motion.h1>

            <motion.p className="mt-6 max-w-md text-[1.125rem] leading-relaxed text-white/72" {...item}>
              {hero.sub}
            </motion.p>

            <motion.div className="mt-9 flex flex-wrap gap-3.5" {...item}>
              <a href="#calculator" className="btn btn-gold group">
                {hero.primaryCta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  <Icon name="arrow-right" size={18} />
                </span>
              </a>
              <a href="#products" className="btn btn-outline-invert">{hero.secondaryCta}</a>
            </motion.div>

            <motion.dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8" {...item}>
              {hero.stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span data-numeric className="flex items-center gap-1 font-display text-[1.375rem] font-semibold text-white sm:text-[1.625rem] md:text-[1.75rem]">
                      <CountUp value={s.value} />
                      {s.star && <Icon name="star" size={16} className="text-[var(--color-gold)]" />}
                    </span>
                    <span className="mt-1.5 block text-sm text-white/65">{s.label}</span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* ---------- Right: one proof panel ---------- */}
          <motion.div
            className="lg:col-span-5"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={reduce ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
          >
            <motion.div
              className="glass mx-auto max-w-md p-6 md:p-7 lg:mx-0 lg:max-w-none"
              whileHover={reduce ? undefined : { y: -4 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    {!reduce && (
                      <motion.span
                        className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)]"
                        animate={{ scale: [1, 2.4, 1], opacity: [0.7, 0, 0.7] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
                  </span>
                  {card.label}
                </span>
                <span className="text-xs text-white/65">{card.meta}</span>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-white/8 text-white/80 ring-1 ring-inset ring-white/12">
                  <Icon name="rupee" size={22} />
                </span>
                <span className="min-w-0">
                  <span data-numeric className="block font-display text-[clamp(1.75rem,1.1rem+2vw,2.375rem)] font-semibold leading-none tracking-display text-white">
                    {card.amount}
                  </span>
                  <span className="mt-1.5 block text-[0.8125rem] leading-snug text-white/65">{card.caption}</span>
                </span>
              </div>

              <div className="mt-7 space-y-2.5">
                <div className="flex items-baseline justify-between text-[0.8125rem]">
                  <span className="text-white/65">{card.progressLabel}</span>
                  <span data-numeric className="font-semibold text-white">{card.steps.length} of {card.steps.length}</span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                  role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}
                  aria-label={card.progressLabel}
                >
                  <motion.div
                    className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-soft))]"
                    initial={reduce ? false : { width: '0%' }}
                    animate={reduce ? false : { width: '100%' }}
                    style={reduce ? { width: '100%' } : undefined}
                    transition={{ duration: 1.1, ease: EASE, delay: 0.8 }}
                  />
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {card.steps.map((step, i) => (
                  <motion.li
                    key={step} className="flex items-center gap-3"
                    initial={reduce ? false : { opacity: 0, x: -8 }}
                    animate={reduce ? false : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.55 + i * 0.09 }}
                  >
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/16 text-[var(--color-success)]">
                      <Icon name="check" size={14} />
                    </span>
                    <span className="text-sm text-white/85">{step}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Trust row — was a second floating panel; folded in as a hairline footer */}
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-white/10 pt-5">
                {trustStrip.items.map((t) => (
                  <span key={t.text} className="inline-flex items-center gap-2 text-[0.75rem] text-white/72">
                    <Icon name={t.icon} size={14} className="text-white/50" />
                    {t.text}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
