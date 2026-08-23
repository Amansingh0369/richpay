import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useScroll, useTransform } from 'motion/react'
import { process } from '../data/content'
import { Reveal, Group, Item, motion, useReducedMotion, WordsUp } from './motion'

/* ============================================================================
   The process — a pinned horizontal rail.

   The section is taller than the viewport; inside it a sticky pane holds the
   steps in a row that translates left as the page scrolls down. Vertical input,
   horizontal travel. Section height is 100vh + the exact horizontal distance,
   so a pixel of scrolling moves the rail a pixel — anything else feels like
   the page is dragging.

   The rail runs on every width. Only prefers-reduced-motion falls back to the
   stacked grid — a pinned sideways rail is precisely the motion that setting
   exists to switch off.

   Two things the phone case needs that the desktop one does not:
   · svh, not vh. The sticky pane and the section height both key off the
     viewport, and vh changes as mobile browsers collapse their URL bar — the
     section would resize mid-scroll and useScroll's offsets would jump. svh is
     the stable small-viewport value.
   · The card is min(78vw, …) — the 78vw arm only ever wins on a phone, so a
     card stays centred and readable there while desktop keeps the width it
     already had.

   The steps contain no focusable elements, so nothing can receive focus while
   translated off screen.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

function useHorizontalRail() {
  const reduce = useReducedMotion()
  // useReducedMotion resolves after mount, so gate on the settled value.
  const [on, setOn] = useState(false)
  useEffect(() => { setOn(!reduce) }, [reduce])
  return on
}

/* Both card variants live at module scope. Defining them inside Process made
   them a NEW component type on every render, so each time the lit tile changed
   React unmounted and remounted all four — the halos restarted together (the
   flash) and the colours jumped instead of tweening. */

const TILE_NAVY = 'rgb(7,31,61)'
const TILE_GOLD = 'rgb(198,154,69)'
const NUM_GOLD = 'rgb(230,194,122)'
const NUM_NAVY = 'rgb(7,31,61)'

function Halo({ i, reduce }) {
  if (reduce) return null
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)] ring-1 ring-[var(--color-gold)]"
      animate={{ opacity: [0, 0.4, 0], scale: [1, 1.16, 1.26] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: i * 0.8 }}
    />
  )
}

/* Grid variant — static colours. */
function GridCard({ step, i, reduce }) {
  return (
    <div>
      <span
        data-numeric
        className="relative inline-flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[var(--radius-lg)] bg-[var(--color-navy)] font-display text-xl font-semibold text-[var(--color-gold-soft)] shadow-[var(--shadow-md)] transition-transform duration-300 group-hover:-translate-y-1"
      >
        {step.n}
        <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
        <Halo i={i} reduce={reduce} />
      </span>
      <h3 className="mt-6 text-[1.125rem] font-semibold">{step.title}</h3>
      <p className="mt-3 text-[0.9375rem] text-[var(--color-muted)]">{step.body}</p>
    </div>
  )
}

/* Rail variant — colour is derived from scroll progress as a MotionValue, so
   the tile fills gradually as the line arrives and nothing re-renders while
   scrolling. Driving it from React state meant the colour could only change in
   one discrete step, which is what read as a flash. */
function RailCard({ step, i, last, progress, reduce }) {
  const at = last === 0 ? 0 : i / last
  const lit = useTransform(progress, [Math.max(-1, at - 0.12), at], [0, 1], { clamp: true })
  const backgroundColor = useTransform(lit, [0, 1], [TILE_NAVY, TILE_GOLD])
  const color = useTransform(lit, [0, 1], [NUM_GOLD, NUM_NAVY])

  return (
    <div className="text-center">
      <motion.span
        data-numeric
        style={reduce ? undefined : { backgroundColor, color }}
        className={`relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-[var(--radius-lg)] font-display text-lg font-semibold sm:h-[4.5rem] sm:w-[4.5rem] sm:text-xl shadow-[var(--shadow-md)] transition-transform duration-300 group-hover:-translate-y-1 ${reduce ? 'bg-[var(--color-navy)] text-[var(--color-gold-soft)]' : ''}`}
      >
        {step.n}
        <Halo i={i} reduce={reduce} />
      </motion.span>
      <h3 className="mt-7 text-[1.1875rem] font-semibold sm:mt-9 sm:text-[1.375rem]">{step.title}</h3>
      <p className="mx-auto mt-3.5 max-w-[24rem] text-[0.9375rem] leading-relaxed text-[var(--color-muted)] sm:mt-4 sm:text-[1.0625rem]">{step.body}</p>
    </div>
  )
}

export default function Process() {
  const reduce = useReducedMotion()
  const rail = useHorizontalRail()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)

  // How far the rail must travel: its own width minus what already fits.
  useLayoutEffect(() => {
    if (!rail) { setDistance(0); return }
    const measure = () => {
      const track = trackRef.current
      if (!track) return
      /* Exactly track-minus-viewport. The track is padded by half a viewport
         minus half a card at each end, so at x=0 card 01 sits dead centre and
         at full travel card 04 does. Any extra here would break both. */
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (trackRef.current) ro.observe(trackRef.current)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [rail])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  /* useScroll caches the target's offsets and only recomputes them on window
     resize. This section's height is derived from `distance`, which is measured
     after first paint — so without this the offsets stay pinned to the
     pre-measurement height and progress never leaves 0. */
  useEffect(() => {
    if (!rail || !distance) return
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    return () => cancelAnimationFrame(id)
  }, [rail, distance])
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const railWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Each tile derives its own colour from progress; see RailCard.
  const lastIndex = process.steps.length - 1

  const Header = (
    <Reveal className="mx-auto max-w-4xl text-center">
      <span className="eyebrow">{process.eyebrow}</span>
      {/* One line from md up; it still wraps on narrow phones rather than
          shrinking below a readable size. */}
      <h2 className="mt-4 text-[clamp(1.75rem,1.1rem+2.4vw,3rem)] leading-[1.08] md:whitespace-nowrap">
        <WordsUp text={process.title} />
      </h2>
      <span className="rule-gold mx-auto mt-7" aria-hidden="true" />
    </Reveal>
  )

  /* ONE section element, always carrying sectionRef, with the layout switching
     inside it. Returning a different tree for the grid case left the ref
     unattached on first render — useScroll bound to nothing, and progress sat
     at 0 forever no matter how far the page scrolled. */
  return (
    <section
      id="process"
      ref={sectionRef}
      className={rail ? 'relative bg-[var(--color-canvas)]' : 'section bg-[var(--color-canvas)]'}
      style={rail ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      {!rail ? (
        <div className="container-page">
          {Header}
          <Group as="ol" className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7" gap={0.11}>
            {process.steps.map((step, i) => (
              <Item as="li" key={step.n} className="group relative">
                <GridCard step={step} i={i} reduce={reduce} />
              </Item>
            ))}
          </Group>
        </div>
      ) : (
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="container-page">{Header}</div>

          <motion.ol
            ref={trackRef}
            style={{ x, '--card-w': 'min(78vw, clamp(20rem,24vw,25rem))' }}
            className="relative mt-10 flex w-max items-start gap-[9vw] pl-[calc((100vw-var(--card-w))/2)] pr-[calc((100vw-var(--card-w))/2)] sm:gap-[6vw] md:mt-16"
          >
            {/* One line running tile-centre to tile-centre. Because each end is
                padded by (100vw - card)/2, the first tile's centre lands exactly
                50vw into the track and the last exactly 50vw from its end — so
                the line's insets are simply 50vw, whatever the card width
                resolves to. Top 2.25rem is half the tile height. */}
            <span aria-hidden="true" className="absolute left-[50vw] right-[50vw] top-[2.25rem] h-[3px] -translate-y-1/2 rounded-full bg-[var(--color-line)]" />
            <motion.span
              aria-hidden="true"
              className="absolute left-[50vw] right-[50vw] top-[2.25rem] h-[3px] origin-left -translate-y-1/2 rounded-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-soft))]"
              style={{ scaleX: scrollYProgress }}
            />

            {process.steps.map((step, i) => (
              <motion.li
                key={step.n}
                className="group relative w-[var(--card-w)] shrink-0"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.07 }}
              >
                <RailCard step={step} i={i} last={lastIndex} progress={scrollYProgress} reduce={reduce} />
              </motion.li>
            ))}
          </motion.ol>

          <div className="container-page mt-10 md:mt-14">
            <div aria-hidden="true" className="h-[3px] w-full max-w-md overflow-hidden rounded-full bg-[var(--color-line)]">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-soft))]"
                style={{ width: railWidth }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
