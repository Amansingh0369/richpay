import { products } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, WordsUp } from './motion'

/* ============================================================================
   Products.

   The band runs on navy but the cards are white, so the two carry different
   colour sets: the heading and lead use the on-navy safe set (white, and
   gold-soft at 9.72:1 for the eyebrow), while everything inside a card goes
   back to the light-surface tokens — ink, muted, body, and gold-ink (5.13:1)
   for the check marks, since plain gold on white is only 2.5:1.

   Both cards carry the same gold border and the same gold-outlined button. There
   is no featured card and no "Most popular" badge any more, so nothing in this
   section ranks one product above the other.
   ========================================================================== */

export default function Products() {
  return (
    <section id="products" className="section relative overflow-hidden bg-[var(--color-navy)]">
      {/* Flat brand navy, not `surface-navy` — that class layers two radial
          gradients plus a gold wash, which is what read as a gradient here. The
          dot-grid stays; it is a texture, not a gradient. */}
      <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 text-white/[0.05]" />

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className="eyebrow eyebrow-on-navy">{products.eyebrow}</span>
          {/* One line from md up. The wrapper widens to max-w-5xl and the clamp
              tops out lower than the site default — at 3.125rem this title is
              wider than the 1200px container and cannot hold a single line. It
              still wraps on a phone rather than shrinking below readable. */}
          <h2 className="mt-4 text-[clamp(1.75rem,0.85rem+2.3vw,2.875rem)] leading-[1.08] text-white md:whitespace-nowrap">
            <WordsUp text={products.title} />
          </h2>
          <p className="lead-on-navy mx-auto mt-5 max-w-2xl">{products.sub}</p>
        </Reveal>

        {/* Two products, so the grid caps at two columns and stays centred
            rather than stretching a pair of cards across the full page. */}
        <Group className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2" gap={0.1}>
          {products.items.map((p) => (
            <Item key={p.name}>
              <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-gold)]/70 bg-[var(--color-card)] p-8 shadow-[var(--shadow-md)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[var(--shadow-lg)]">
                <h3 className="text-[1.25rem] font-semibold text-[var(--color-ink)]">{p.name}</h3>

                <p className="mt-3 text-[0.9375rem] text-[var(--color-muted)]">{p.positioning}</p>

                <dl className="mt-7 space-y-3.5 border-t border-[var(--color-line)] pt-6">
                  {[['Amount', p.amount], ['Interest', p.rate], ['Tenure', p.tenure]].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-[var(--color-muted)]">{k}</dt>
                      <dd data-numeric className="text-right text-sm font-semibold text-[var(--color-ink)]">{v}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 mb-8 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[0.875rem] text-[var(--color-body)]">
                      <span className="mt-0.5 shrink-0 text-[var(--color-gold-ink)]"><Icon name="check" size={16} /></span>
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* mt-auto pins the button to the foot of both cards, so they
                    line up even when one product has longer copy. */}
                <a href="#apply" className="btn btn-gold mt-auto w-full">
                  Learn more <Icon name="arrow-right" size={17} />
                </a>
              </article>
            </Item>
          ))}
        </Group>
      </div>
    </section>
  )
}
