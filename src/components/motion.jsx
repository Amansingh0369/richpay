import { useLayoutEffect, useRef, useState } from 'react'
import {
  motion, useInView, useReducedMotion, useMotionValue,
  useSpring, useTransform, useScroll, animate,
} from 'motion/react'

/* ============================================================================
   Motion primitives.
   Motion tier is "Subtle" (3/10) in MASTER.md, so: short travel, expo easing,
   no bounce on content. Every primitive collapses to the final state when the
   user prefers reduced motion — that is a hard requirement in the design system,
   not a nicety.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]   // --ease-expo

export const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
}

export const scaleIn = {
  hidden: { opacity: 0, y: 26, scale: 0.975 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

export const stagger = (staggerChildren = 0.075, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/* Section-level reveal. Wrap anything; children using `Item` inherit the stagger. */
export function Reveal({
  children, as = 'div', variants = fadeUp, delay = 0,
  amount = 0.25, once = true, className = '', ...rest
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  if (reduce) return <MotionTag className={className} {...rest}>{children}</MotionTag>
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/* Staggered group: <Group><Item/><Item/></Group> */
export function Group({ children, as = 'div', gap = 0.075, delay = 0, amount = 0.2, className = '', ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  if (reduce) return <MotionTag className={className} {...rest}>{children}</MotionTag>
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={stagger(gap, delay)}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

export function Item({ children, as = 'div', variants = fadeUp, className = '', ...rest }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div
  if (reduce) return <MotionTag className={className} {...rest}>{children}</MotionTag>
  return <MotionTag className={className} variants={variants} {...rest}>{children}</MotionTag>
}

/* Headline that reveals word by word from behind a mask — the reference site's
   signature move. Short headlines only (<8 words) per the skill's SplitText
   guidance; never body copy (one wrapper element per word is a real DOM cost).

   THE TRIGGER LIVES ON THE CONTAINER, NOT THE WORDS. Each word starts 108%
   below its mask, and IntersectionObserver clips a target against its ancestors'
   overflow — so a masked word reports zero visible area and `whileInView` on it
   would never fire, leaving every heading permanently invisible. The unclipped
   container observes instead and drives the words through variants.

   Under reduced motion it renders as plain text with no wrappers at all. */
export function WordsUp({ text, className = '', delay = 0, wordClassName = '', amount = 0.4 }) {
  const reduce = useReducedMotion()
  if (reduce) return <span className={className}>{text}</span>
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.062, delayChildren: delay } } }}
    >
      {/* The mask clips at its content box, which sits above the glyph
          descenders when line-height is tight — a "y" or "g" gets shaved as the
          word arrives. pb gives the clip edge room; the equal -mb takes that
          room back out of layout, so baselines and line spacing are untouched. */}
      {text.split(' ').map((w, i) => (
        <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.14em] -mb-[0.14em]">
          <motion.span
            aria-hidden="true"
            className={`inline-block ${wordClassName}`}
            /* translateZ promotes the word to its own compositor layer, so the
               browser moves a cached raster instead of re-rasterising it each
               frame. That matters most for gradient text: background-clip:text
               forces a repaint on every transform otherwise, which is what made
               the hero's accent words jitter. */
            style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
            variants={{ hidden: { y: '108%' }, show: { y: 0, transition: { duration: 0.78, ease: EASE } } }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/* Count-up for stat figures.
   SAFETY CONTRACT: the final value is the DEFAULT render. We only drop to zero
   in a layout effect once we know the animation will actually run, so a slow,
   blocked or failed animation can never leave a "0+" on screen — which is the
   exact bug visible on the current production site. */
export function CountUp({ value, className = '', duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduce = useReducedMotion()
  const [shown, setShown] = useState(value)      // <- final value by default
  const done = useRef(false)

  const m = String(value).match(/^(\D*)([\d,.]+)(.*)$/)

  useLayoutEffect(() => {
    if (reduce || !m || done.current || !inView) return
    done.current = true
    const [, pre, numStr, post] = m
    const decimals = (numStr.split('.')[1] || '').length
    const target = parseFloat(numStr.replace(/,/g, ''))
    const grouped = numStr.includes(',')
    const render = (v) => {
      const n = decimals ? v.toFixed(decimals) : Math.round(v).toString()
      return pre + (grouped ? Number(n).toLocaleString('en-IN') : n) + post
    }
    setShown(render(0))                          // start only once we commit
    const controls = animate(0, target, {
      duration, ease: EASE,
      onUpdate: (v) => setShown(render(v)),
      onComplete: () => setShown(value),         // land exactly on the source string
    })
    // Hard settle: if rAF is throttled, backgrounded or stalls, force the real
    // number anyway. Without this a stalled tween leaves "0+" on screen — the
    // precise failure visible on the production site today.
    const settle = setTimeout(() => { controls.stop(); setShown(value) }, duration * 1000 + 400)
    return () => { clearTimeout(settle); controls.stop(); setShown(value) }
  }, [inView, reduce, value, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{shown}</span>
}

/* Thin progress bar showing how far through the document the reader is.
   Decorative and aria-hidden — it duplicates the scrollbar, so it must not be
   announced. Hidden entirely under reduced motion. */
export function ScrollProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })
  if (reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-soft))]"
    />
  )
}

/* Decorative parallax. Background/ornament layers only — never text or controls. */
export function Parallax({ children, distance = 60, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance])
  if (reduce) return <div ref={ref} className={className}>{children}</div>
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>
}

/* Pointer-tracked tilt for the hero card. Springs back on leave. */
export function Tilt({ children, className = '', max = 7 }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), { stiffness: 180, damping: 22 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), { stiffness: 180, damping: 22 })

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
    >
      {children}
    </motion.div>
  )
}

/* Slow drift for floating ornaments/cards. */
export function Float({ children, className = '', amplitude = 9, duration = 6, delay = 0 }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

export { motion, useReducedMotion }
