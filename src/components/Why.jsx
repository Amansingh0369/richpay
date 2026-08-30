import { Fragment, useRef } from 'react'
import { useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { why } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp, WordsUp, motion, useReducedMotion } from './motion'
import mark from '../assets/richpay-mark-invert.png'

/* ============================================================================
   Why RichPay — a bento held inside a one-screen frame.

   Layout adapted from 21st.dev "Feature Bento" (id 18898): tiles that differ in
   *kind* — one large anchor tile, standard feature cards, a stat tile and a CTA
   tile. Re-skinned onto our tokens; the source's blue/purple/rose gradients,
   shadcn tokens, unsplash image, `↗` text-glyph "icon" and animate-ping are
   all gone.

   Gold appears exactly once as a fill — the stat tile, navy text on top
   (6.37:1) — which is the only use the contrast contract sanctions on a light
   band. Everywhere else gold is a hairline, a glow or a hover accent.

   THE FRAME. The section is min-h-[100svh], not h-screen:
   · svh rather than vh, because vh changes as a mobile browser collapses its
     URL bar and the frame would resize under the reader.
   · The hard lock is gated on min-height:720px as well as lg, so a short
     laptop window grows the section instead of crushing a tile. lg, not md:
     the bottom row's tiles are a quarter of the container wide, and between
     768 and 1024 that is ~173px — too narrow for a titled tile with body copy
     in a 166px-tall row, so it clipped at both ends. Below lg the bento
     stacks and the section flows at its natural height instead.
   · pt-24 is not decoration. The 80px header is fixed and paints over the top
     of whatever is beneath it; once the frame is exactly one screen tall, the
     section's own top IS the viewport top, and a smaller pad puts the eyebrow
     underneath the bar. 6rem is what `.section` uses for the same reason.
   · min-h rather than a fixed height, because the honest answer on a phone is
     that six tiles plus a heading do not fit in 844px at a readable size. On a
     desktop the content is shorter than the viewport, so min-h settles at
     exactly one screen and reads as a locked frame; on a phone it grows
     instead of clipping the copy. Clamping it would cost content, not chrome.
   The grid takes the leftover height from md up (flex-1 + 1fr rows), so the
   tiles divide the frame exactly rather than leaving a gap at the bottom.

   MOTION. Three layers, all of which respect prefers-reduced-motion:
   · Entrance — tiles rise and settle in a stagger as the grid scrolls in.
   · Ambient — gold blobs drift on the anchor tile, a shimmer crosses the stat
     tile, the brand mark parallaxes against the page. None of this needs a
     pointer, which matters because a phone has no hover state at all.
   · Pointer — a spotlight tracks the cursor across each tile and the CTA arrow
     is magnetic. Enhancement only: nothing is conveyed by hover alone.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

/* Slightly heavier than the shared fadeUp — these are large tiles and they read
   better arriving from a touch further down and a hair under-scale. */
const riseIn = {
  hidden: { opacity: 0, y: 32, scale: 0.965 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } },
}

const HOVER = { type: 'spring', stiffness: 260, damping: 22, mass: 0.6 }

/* A cursor spotlight, shared by every tile. Returns props to spread on the tile
   plus the motion background to paint into an absolutely-positioned overlay.
   Under reduced motion it binds nothing, so no listeners are attached at all. */
function useSpotlight({ size = 320, tint = 'rgba(198,154,69,0.16)' } = {}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const px = useMotionValue(50)
  const py = useMotionValue(50)
  const hover = useMotionValue(0)
  // Spring the opacity so the spotlight fades in and out instead of snapping.
  const opacity = useSpring(hover, { stiffness: 180, damping: 28 })
  const background = useMotionTemplate`radial-gradient(${size}px circle at ${px}% ${py}%, ${tint}, transparent 72%)`

  const bind = reduce
    ? {}
    : {
      ref,
      onPointerMove: (e) => {
        const r = ref.current?.getBoundingClientRect()
        if (!r) return
        px.set(((e.clientX - r.left) / r.width) * 100)
        py.set(((e.clientY - r.top) / r.height) * 100)
      },
      onPointerEnter: () => hover.set(1),
      onPointerLeave: () => hover.set(0),
    }

  return { bind, background, opacity, reduce }
}

function Spotlight({ background, opacity }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-[var(--radius-lg)]"
      style={{ background, opacity }}
    />
  )
}

/* ---- Anchor tile: the headline reason -------------------------------- */
function AnchorTile({ item, markY }) {
  const { bind, background, opacity, reduce } = useSpotlight({ size: 460, tint: 'rgba(198,154,69,0.20)' })

  return (
    <motion.article
      {...bind}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={HOVER}
      className="surface-navy group relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] p-7 md:p-9"
    >
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 text-white/[0.06]" />

      {/* Ambient: two gold blobs on long, offset drifts. Transform and nothing
          else, so this stays on the compositor. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-gold)]/20 blur-3xl"
        animate={reduce ? undefined : { x: [0, -30, 10, 0], y: [0, 24, -16, 0], scale: [1, 1.14, 0.94, 1] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[var(--color-gold)]/10 blur-3xl"
        animate={reduce ? undefined : { x: [0, 34, -12, 0], y: [0, -20, 14, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      <Spotlight background={background} opacity={opacity} />

      {/* Official growth-bar mark, parallaxed against the page scroll — ambient
          motion that a touch device gets too. */}
      <motion.img
        src={mark} alt="" aria-hidden="true"
        style={reduce ? undefined : { y: markY }}
        className="pointer-events-none absolute -bottom-8 right-[-3rem] w-56 max-w-none opacity-[0.08] transition-transform duration-700 group-hover:scale-105 md:w-80 lg:w-[22rem]"
      />

      <div className="relative">
        <motion.span
          className="inline-flex h-13 w-13 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-gold)]/16 text-[var(--color-gold-soft)] ring-1 ring-inset ring-[var(--color-gold)]/30 md:h-14 md:w-14"
          whileHover={reduce ? undefined : { scale: 1.08, rotate: -6 }}
          transition={HOVER}
        >
          <Icon name={item.icon} size={26} />
        </motion.span>
        <h3 className="mt-5 font-display text-[clamp(1.375rem,1.1rem+1.4vw,2.125rem)] font-semibold leading-[1.15] tracking-display text-white md:mt-7">
          {item.title}
        </h3>
        <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-white/72 md:mt-4 md:text-[1.0625rem]">
          {item.body}
        </p>
      </div>
    </motion.article>
  )
}

/* ---- Standard feature tile ------------------------------------------- */
/* Module scope on purpose: declared inside the parent it would be a new
   component type on every render, remounting the tile and restarting its
   animations. */
function FeatureTile({ item, row = false }) {
  const { bind, background, opacity, reduce } = useSpotlight({ size: 260, tint: 'rgba(198,154,69,0.13)' })

  /* Horizontal on a phone — icon beside the text reads faster in a short row
     than a stacked card does — and upright from sm.

     `row` lies it back down at md, which the bento's bottom row needs: that row
     is ~166px tall, and upright (icon, 20px gap, title, body) wants ~215px in a
     single column. The tile is `justify-end`, so the surplus goes off the TOP
     and card-lift's overflow:hidden clips the icon away silently — it does not
     scroll and scrollHeight cannot see it. Lying down puts the icon beside the
     text instead of above it, which the row has width for. */
  const shape = row
    ? 'flex-row items-center gap-4 sm:flex-col sm:items-start sm:justify-end sm:gap-0 lg:flex-row lg:items-center lg:gap-3.5'
    : 'flex-row items-center gap-4 sm:flex-col sm:items-start sm:justify-end sm:gap-0'

  return (
    <motion.article
      {...bind}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={HOVER}
      className={`card-lift group flex h-full p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-lg)] sm:p-6 ${shape}`}
    >
      <Spotlight background={background} opacity={opacity} />
      <motion.span
        className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-gold)]/22 to-[var(--color-gold)]/8 text-[var(--color-gold-ink)] sm:h-12 sm:w-12 ${row ? 'lg:h-10 lg:w-10' : ''}`}
        whileHover={reduce ? undefined : { scale: 1.1, rotate: -6 }}
        transition={HOVER}
      >
        <Icon name={item.icon} size={22} />
      </motion.span>
      <div className={`relative min-w-0 sm:mt-5 ${row ? 'lg:mt-0' : ''}`}>
        <h3 className={`text-[1rem] font-semibold leading-snug md:text-[1.0625rem] ${row ? 'lg:text-[0.9375rem]' : ''}`}>
          {item.title}
        </h3>
        <p className={`mt-1.5 text-[0.875rem] leading-relaxed text-[var(--color-muted)] sm:mt-2.5 md:text-[0.9375rem] ${row ? 'lg:mt-1 lg:text-[0.8125rem]' : ''}`}>
          {item.body}
        </p>
      </div>
    </motion.article>
  )
}

/* ---- Duo tile: two features sharing one card -------------------------- */
/* The bento's right column is one tall slot rather than two upright cards, so
   these two ride in a single surface split by a hairline. Each keeps its own
   icon, heading and body — this is one tile holding two features, not one
   merged feature, so the copy is untouched and each still reads on its own. */
function DuoTile({ items }) {
  const { bind, background, opacity, reduce } = useSpotlight({ size: 380, tint: 'rgba(198,154,69,0.13)' })

  return (
    <motion.article
      {...bind}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={HOVER}
      className="card-lift group flex h-full flex-col justify-center gap-5 p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-lg)] sm:gap-6 sm:p-6 md:gap-7 md:p-7"
    >
      <Spotlight background={background} opacity={opacity} />
      {items.map((item, i) => (
        <Fragment key={item.title}>
          {/* The flex gap sits on both sides of the rule, so it needs no margin
              of its own — and it is decorative, hence aria-hidden. */}
          {i > 0 && <span aria-hidden="true" className="relative block h-px w-full bg-[var(--color-line)]" />}
          <div className="relative flex flex-row items-center gap-4 sm:items-start sm:gap-5">
            <motion.span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-gold)]/22 to-[var(--color-gold)]/8 text-[var(--color-gold-ink)] sm:h-12 sm:w-12"
              whileHover={reduce ? undefined : { scale: 1.1, rotate: -6 }}
              transition={HOVER}
            >
              <Icon name={item.icon} size={22} />
            </motion.span>
            <div className="min-w-0">
              <h3 className="text-[1rem] font-semibold leading-snug md:text-[1.0625rem]">{item.title}</h3>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-[var(--color-muted)] md:mt-2 md:text-[0.9375rem]">
                {item.body}
              </p>
            </div>
          </div>
        </Fragment>
      ))}
    </motion.article>
  )
}

/* ---- Proof tile: the one gold fill on this band ----------------------- */
function StatTile({ stat }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -6 }}
      transition={HOVER}
      className="relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(150deg,var(--color-gold-soft)_0%,var(--color-gold)_100%)] p-5 text-[var(--color-on-gold)] lg:p-6"
    >
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-white/22 blur-3xl" />

      {/* A light sweep crossing the gold every few seconds. Ambient, so it reads
          as a live surface on a phone where there is no hover at all. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]"
        initial={{ x: '-140%' }}
        animate={reduce ? undefined : { x: ['-140%', '420%'] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
      />

      {/* The vh arm in this clamp is load-bearing: on a short laptop window the
          bento's bottom row is only ~113px tall, and a vw-only clamp kept the
          figure at its full size and pushed the label out of the tile. */}
      <div className="relative">
        <span data-numeric className="block font-display text-[clamp(1.5rem,min(1.4rem+1.6vw,4.6vh),2.75rem)] font-semibold leading-none tracking-display">
          <CountUp value={stat.value} />
        </span>
        <p className="mt-2 text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-gold)] md:text-[0.8125rem]">
          {stat.label}
        </p>
      </div>
    </motion.article>
  )
}

/* ---- CTA tile --------------------------------------------------------- */
function CtaTile({ cta }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  // Magnetic arrow: it leans a quarter of the way toward the pointer.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const ax = useSpring(mx, { stiffness: 240, damping: 20, mass: 0.5 })
  const ay = useSpring(my, { stiffness: 240, damping: 20, mass: 0.5 })

  const onMove = (e) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(Math.max(-14, Math.min(14, (e.clientX - (r.left + r.width / 2)) * 0.22)))
    my.set(Math.max(-14, Math.min(14, (e.clientY - (r.top + r.height / 2)) * 0.22)))
  }
  const reset = () => { mx.set(0); my.set(0) }

  return (
    <motion.a
      ref={ref}
      href={cta.href}
      onPointerMove={reduce ? undefined : onMove}
      onPointerLeave={reduce ? undefined : reset}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={HOVER}
      className="surface-navy-soft group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-lg)] sm:p-6"
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[var(--color-gold)]/20 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.18, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="relative flex items-start justify-between gap-3">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
          {cta.eyebrow}
        </span>
        <motion.span
          style={reduce ? undefined : { x: ax, y: ay }}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-on-gold)]"
        >
          <Icon name="arrow-right" size={16} />
        </motion.span>
      </span>
      <span className="relative mt-8 block font-display text-[1.125rem] font-semibold leading-snug tracking-display text-white md:mt-10 md:text-[1.25rem]">
        {cta.label}
      </span>
    </motion.a>
  )
}

export default function Why() {
  const featured = why.items.find((i) => i.featured) || why.items[0]
  const rest = why.items.filter((i) => i !== featured)
  // The right-hand column is a single tall slot holding the first two
  // supporting features; anything after them sits along the bottom row.
  const duo = rest.slice(0, 2)
  const trailing = rest.slice(2)

  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const markY = useTransform(scrollYProgress, [0, 1], [34, -34])

  return (
    <section
      id="why"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--color-surface)] pb-14 pt-24 [@media(min-width:1024px)_and_(min-height:720px)]:h-[100svh]"
    >
      <div className="container-page flex w-full flex-1 flex-col lg:min-h-0">
        <Reveal className="mx-auto max-w-2xl shrink-0 text-center">
          <span className="eyebrow">{why.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]"><WordsUp text={why.title} /></h2>
          <p className="lead mt-5 md:mt-6">{why.sub}</p>
        </Reveal>

        {/* flex-1 + 1fr rows from md up: the grid absorbs whatever height the
            heading leaves, so the bento divides the frame exactly. */}
        <Group
          className="mt-8 grid grid-cols-2 gap-3.5 sm:gap-4 lg:mt-8 lg:min-h-0 lg:flex-1 lg:grid-cols-4 lg:grid-rows-[repeat(3,minmax(0,1fr))] lg:gap-4"
          gap={0.085}
        >
          <Item variants={riseIn} className="col-span-2 lg:row-span-2">
            <AnchorTile item={featured} markY={markY} />
          </Item>

          {/* Rows 1-2 are two wide tiles side by side: the anchor and the duo.
              Row 3 carries the rest — two small tiles under the anchor, and the
              CTA under the duo. */}
          <Item variants={riseIn} className="col-span-2 lg:row-span-2">
            <DuoTile items={duo} />
          </Item>

          {trailing.map((item) => (
            <Item variants={riseIn} key={item.title} className="col-span-2 sm:col-span-1">
              <FeatureTile item={item} row />
            </Item>
          ))}

          <Item variants={riseIn} className="col-span-1">
            <StatTile stat={why.stat} />
          </Item>

          <Item variants={riseIn} className="col-span-1 sm:col-span-2">
            <CtaTile cta={why.cta} />
          </Item>
        </Group>
      </div>
    </section>
  )
}
