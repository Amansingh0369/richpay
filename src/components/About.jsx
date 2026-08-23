import { about, numbers, journey, SHOW_JOURNEY } from '../data/content'
import { Reveal, Group, Item, CountUp } from './motion'

export default function About() {
  return (
    <section id="about" className="section bg-[var(--color-surface)]">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          <Reveal>
            <span className="eyebrow">{about.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{about.title}</h2>
            <span className="rule-gold mt-6" aria-hidden="true" />
            {about.body.map((p) => (
              <p key={p.slice(0, 24)} className="mt-5 text-[var(--color-body)]">{p}</p>
            ))}
          </Reveal>

          <Reveal delay={100} className="grid gap-5">
            {[about.vision, about.mission].map((b) => (
              <article key={b.title} className="card-lift p-8">
                <h3 className="text-[1.125rem] font-semibold">{b.title}</h3>
                <p className="mt-3 text-[0.9375rem] text-[var(--color-muted)]">{b.body}</p>
              </article>
            ))}
          </Reveal>
        </div>

        {/* ---- Values ---- */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 70}>
              <article className="h-full border-t-2 border-[var(--color-gold)] pt-5">
                <h3 className="text-[1.0625rem] font-semibold">{v.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] text-[var(--color-muted)]">{v.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ---- By the numbers ---- */}
        <div className="mt-16 pt-14 border-t border-[var(--color-line)]">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">{numbers.eyebrow}</span>
            <h2 className="mt-4 text-[1.75rem] md:text-[2rem]">{numbers.title}</h2>
          </Reveal>
          <dl className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {numbers.items.map((n, i) => (
              <Reveal key={n.label} delay={i * 70}>
                <dt className="sr-only">{n.label}</dt>
                <dd>
                  <span data-numeric className="block text-[1.75rem] md:text-[2rem] leading-none font-semibold text-[var(--color-navy)]"><CountUp value={n.value} /></span>
                  <span className="mt-2.5 block text-sm text-[var(--color-muted)]">{n.label}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>

        {/* Gated: the client's source doc contradicts itself on these dates.
            Flip SHOW_JOURNEY in src/data/content.js once confirmed. */}
        {SHOW_JOURNEY && (
          <div className="mt-16 pt-14 border-t border-[var(--color-line)]">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">{journey.eyebrow}</span>
              <h2 className="mt-4 text-[1.75rem] md:text-[2rem]">{journey.title}</h2>
            </Reveal>
            <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
              {journey.items.map((j, i) => (
                <Reveal as="li" key={j.year} delay={i * 90}>
                  <span data-numeric className="text-sm font-semibold tracking-[0.14em] text-[var(--color-gold-ink)]">{j.year}</span>
                  <h3 className="mt-2 text-[1.0625rem] font-semibold">{j.title}</h3>
                  <p className="mt-2 text-[0.9375rem] text-[var(--color-muted)]">{j.body}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
