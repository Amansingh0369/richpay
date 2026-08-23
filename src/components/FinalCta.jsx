import { finalCta } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp } from './motion'

export default function FinalCta() {
  return (
    <section id="apply" className="surface-navy grain relative overflow-hidden py-24 md:py-32">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-25" viewBox="0 0 1440 160" preserveAspectRatio="none">
        <path d="M0 150 C 380 40, 1060 40, 1440 150" fill="none" stroke="var(--color-gold)" strokeWidth="2.5" />
      </svg>

      <div className="container-page relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-3xl text-[clamp(2rem,1.5rem+2.2vw,3.25rem)] leading-[1.08] text-gradient">{finalCta.title}</h2>
          <p className="lead-on-navy mx-auto mt-6 max-w-2xl">{finalCta.sub}</p>

          <ul className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3">
            {finalCta.points.map((p) => (
              <li key={p} className="inline-flex items-center gap-2 text-sm text-white/80">
                <span className="text-[var(--color-gold-soft)] shrink-0"><Icon name="check" size={16} /></span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a href="#contact" className="btn btn-gold">
              {finalCta.cta} <Icon name="arrow-right" size={18} />
            </a>
            <a href="#calculator" className="btn btn-outline-invert">{finalCta.secondary}</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
