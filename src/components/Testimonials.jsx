import { testimonials } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp } from './motion'

/* Deliberately a static grid, not a carousel.
   MASTER.md's testimonial pattern demands pause/stop controls, keyboard
   equivalents, focus/hover halt and a reduced-motion static fallback. With only
   four quotes, showing them all satisfies the intent with none of that risk. */
export default function Testimonials() {
  return (
    <section id="stories" className="section bg-[var(--color-canvas)]">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{testimonials.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{testimonials.title}</h2>
          <span className="rule-gold mt-6" aria-hidden="true" />
        </Reveal>

        <Group className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2" gap={0.09}>
          {testimonials.items.map((t) => (
            <Item key={t.name}>
              <figure className="card-lift flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                <span className="text-[var(--color-gold)]" aria-hidden="true">
                  <Icon name="quote" size={28} />
                </span>

                <blockquote className="mt-5 flex-1">
                  <p className="text-[1.0625rem] leading-relaxed text-[var(--color-body)]">“{t.quote}”</p>
                </blockquote>

                <div className="mt-6 flex items-center gap-1" role="img" aria-label="Rated 5 out of 5">
                  {Array.from({ length: 5 }, (_, n) => (
                    <span key={n} className="text-[var(--color-gold)]" aria-hidden="true"><Icon name="star" size={15} /></span>
                  ))}
                </div>

                <figcaption className="mt-5 pt-6 border-t border-[var(--color-line)] flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-[var(--color-navy)] text-[var(--color-gold-soft)] text-sm font-semibold"
                  >
                    {t.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-[var(--color-ink)] truncate">{t.name}</span>
                    <span className="block text-sm text-[var(--color-muted)] truncate">{t.role} · {t.city}</span>
                  </span>
                  <span data-numeric className="ml-auto shrink-0 text-sm font-semibold text-[var(--color-gold-ink)]">{t.amount}</span>
                </figcaption>
              </figure>
            </Item>
          ))}
        </Group>
      </div>
    </section>
  )
}
