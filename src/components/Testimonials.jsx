import { testimonials } from '../data/content'
import Icon from './Icons'
import Marquee from './Marquee'
import { Reveal, Group, Item, WordsUp, useReducedMotion } from './motion'

/* ============================================================================
   Customer stories — two infinite rows running in opposite directions.

   This was a static grid, with a note explaining that a carousel would owe the
   reader pause/stop controls. That trade has been made deliberately here, the
   same way it was on the stats band: the rows run continuously with no hover
   pause and no in-page control, by request. prefers-reduced-motion is what
   stops it, and under that setting the section falls back to the plain grid —
   a halted marquee is a row of cards sliced off at the viewport edge, which is
   not a fallback.

   Worth stating plainly: WCAG 2.2.2 (Pause, Stop, Hide) asks for a control on
   anything that moves automatically for more than five seconds, and this has
   none. Moving body copy is also harder to read than moving stat labels, so the
   rows are slow and the quotes are short.
   ========================================================================== */

const FADE = 'linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)'

function Card({ t }) {
  return (
    <figure className="card-lift flex h-full flex-col p-8">
      <span className="text-[var(--color-gold)]" aria-hidden="true">
        <Icon name="quote" size={26} />
      </span>

      <blockquote className="mt-4 flex-1">
        <p className="text-[1.0625rem] leading-relaxed text-[var(--color-body)]">“{t.quote}”</p>
      </blockquote>

      <div className="mt-5 flex items-center gap-1" role="img" aria-label="Rated 5 out of 5">
        {Array.from({ length: 5 }, (_, n) => (
          <span key={n} className="text-[var(--color-gold)]" aria-hidden="true"><Icon name="star" size={14} /></span>
        ))}
      </div>

      <figcaption className="mt-4 flex items-center gap-3 border-t border-[var(--color-line)] pt-5">
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] text-sm font-semibold text-[var(--color-gold-soft)]"
        >
          {t.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold text-[var(--color-ink)]">{t.name}</span>
          <span className="block truncate text-[0.75rem] text-[var(--color-muted)]">{t.role} · {t.city}</span>
        </span>
        <span data-numeric className="ml-auto shrink-0 text-[0.8125rem] font-semibold text-[var(--color-gold-ink)]">{t.amount}</span>
      </figcaption>
    </figure>
  )
}

export default function Testimonials() {
  const reduce = useReducedMotion()
  const items = testimonials.items
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half)]

  return (
    <section id="stories" className="section overflow-hidden bg-[var(--color-canvas)]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{testimonials.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]"><WordsUp text={testimonials.title} /></h2>
          <span className="rule-gold mx-auto mt-6" aria-hidden="true" />
        </Reveal>
      </div>

      {reduce ? (
        <div className="container-page">
          <Group className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.06}>
            {items.map((t) => (
              <Item key={t.name}><Card t={t} /></Item>
            ))}
          </Group>
        </div>
      ) : (
        /* Full-bleed on purpose — the rows should run edge to edge, not stop at
           the page container. The fade mask is what makes cards enter and leave
           rather than being chopped off at the viewport edge. */
        <div className="mt-16 space-y-6">
          {rows.map((row, i) => (
            <div key={i} style={{ maskImage: FADE, WebkitMaskImage: FADE }}>
              <Marquee
                items={row}
                reverse={i === 1}
                duration={i === 0 ? '78s' : '92s'}
                itemClassName="mr-6 w-[21.5rem] sm:w-[24rem] lg:w-[25rem]"
                renderItem={(t) => <Card t={t} />}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
