import { useEffect, useRef, useState } from 'react'
import { useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react'
import { hero } from '../data/content'
import Icon from './Icons'
import { motion, useReducedMotion } from './motion'

/* ============================================================================
   The hero's proof card — an illustrative approval that plays itself.

   The steps tick on in sequence, the progress bar rises with them, then the
   whole thing resets and the bar falls back to zero before running again.

   ACCESSIBILITY: the looping region is aria-hidden and a static sentence
   describes it for assistive tech instead. Announcing "1 of 3… 2 of 3… 3 of 3…"
   on a five-second loop, forever, would be hostile.

   Under prefers-reduced-motion it does not animate at all — it renders the
   completed state and stays there.

   Worth knowing: WCAG 2.2.2 (Pause, Stop, Hide) asks for a pause control on
   anything that moves automatically for more than five seconds. There is none
   here, matching the decision already taken on the stats marquee.
   ========================================================================== */

const EASE = [0.22, 0.61, 0.36, 1]

export default function HeroProofCard() {
  const { approvalCard: card } = hero
  const reduce = useReducedMotion()
  const total = card.steps.length
  const [step, setStep] = useState(reduce ? total : 0)

  useEffect(() => {
    if (reduce) { setStep(total); return }
    let cancelled = false
    let timer
    let current = 0
    const advance = () => {
      if (cancelled) return
      const next = current >= total ? 0 : current + 1
      current = next
      setStep(next)
      // hold longer on the completed state, and briefly at zero before restarting
      const hold = next === total ? 2400 : next === 0 ? 800 : 1150
      timer = setTimeout(advance, hold)
    }
    timer = setTimeout(advance, 900)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [reduce, total])

  const pct = (step / total) * 100

  /* Levitation. Pointer position drives a small rotation on both axes plus a
     lift, and a glare follows the cursor across the surface — the two together
     are what read as "floating" rather than "tilting". Springs rather than
     tweens so it settles instead of snapping back.
     `transformPerspective` lives on the element; without it rotateX/rotateY are
     an affine skew and look flat. */
  const ref = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const hovered = useMotionValue(0)

  const spring = { stiffness: 150, damping: 18, mass: 0.6 }
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), spring)
  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), spring)
  const lift = useSpring(useTransform(hovered, [0, 1], [0, -10]), spring)
  const glareOpacity = useSpring(hovered, { stiffness: 120, damping: 24 })
  const gx = useTransform(mx, (v) => `${v * 100}%`)
  const gy = useTransform(my, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(320px circle at ${gx} ${gy}, rgba(255,255,255,0.16), rgba(255,255,255,0.05) 38%, transparent 65%)`

  const onMove = (e) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onEnter = () => { if (!reduce) hovered.set(1) }
  const onLeave = () => {
    if (reduce) return
    hovered.set(0)
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={reduce ? undefined : { rotateX, rotateY, y: lift, transformPerspective: 1200 }}
      className="glass glass-deep relative mx-auto max-w-md p-6 md:p-7 lg:mx-0 lg:max-w-none"
    >
      {/* Glare follows the cursor across the surface. */}
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)]"
          style={{ backgroundImage: glare, opacity: glareOpacity }}
        />
      )}

      {/* One static sentence stands in for the whole looping illustration. */}
      <p className="sr-only">
        Illustrative example: a {card.amount} personal loan, approved in {card.meta.toLowerCase()} once
        documents are submitted, the credit check passes and the loan is approved.
      </p>

      <div aria-hidden="true">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
            <span className="relative flex h-2 w-2">
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

        {/* Progress rises as steps tick and falls back when the loop resets. */}
        <div className="mt-7 space-y-2.5">
          <div className="flex items-baseline justify-between text-[0.8125rem]">
            <span className="text-white/65">{card.progressLabel}</span>
            <span data-numeric className="font-semibold text-white">{step} of {total}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-soft))]"
              animate={{ width: `${pct}%` }}
              initial={false}
              transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
            />
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {card.steps.map((label, i) => {
            const done = i < step
            return (
              <li key={label} className="flex items-center gap-3">
                {/* A real checkbox shape — squared with a soft radius, an empty
                    outline when pending, a gold fill when ticked.
                    The tick is NAVY on the gold, never white: white on gold is
                    2.59:1 and is the one pairing the contrast contract rules
                    out. Navy on gold is 6.37:1. */}
                <motion.span
                  className="relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] border"
                  animate={{
                    backgroundColor: done ? 'rgb(198,154,69)' : 'rgba(255,255,255,0.04)',
                    borderColor: done ? 'rgb(198,154,69)' : 'rgba(255,255,255,0.28)',
                    scale: done ? 1 : 0.94,
                  }}
                  transition={{ duration: reduce ? 0 : 0.34, ease: EASE }}
                >
                  {/* Stroking pathLength draws the tick on rather than popping
                      a glyph in, which is what makes it read as being ticked. */}
                  <motion.svg
                    viewBox="0 0 24 24" width="13" height="13" fill="none"
                    stroke="var(--color-on-gold)" strokeWidth="3.2"
                    strokeLinecap="round" strokeLinejoin="round"
                    aria-hidden="true" focusable="false"
                  >
                    <motion.path
                      d="M5 12.5 10 17.5 19 7"
                      initial={false}
                      animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
                      transition={{
                        pathLength: { duration: reduce ? 0 : 0.34, ease: EASE, delay: reduce ? 0 : 0.08 },
                        opacity: { duration: reduce ? 0 : 0.12 },
                      }}
                    />
                  </motion.svg>

                  {/* A single gold pulse at the moment of ticking. */}
                  {done && !reduce && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-[7px] ring-2 ring-[var(--color-gold)]"
                      initial={{ opacity: 0.85, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.75 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  )}
                </motion.span>
                <motion.span
                  className="text-sm"
                  animate={{ color: done ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.45)' }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
                >
                  {label}
                </motion.span>
              </li>
            )
          })}
        </ul>
      </div>
    </motion.div>
  )
}
