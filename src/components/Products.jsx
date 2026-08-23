import { products } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item } from './motion'

export default function Products() {
  return (
    <section id="products" className="section bg-[var(--color-canvas)]">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{products.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{products.title}</h2>
          <p className="lead mt-5">{products.sub}</p>
        </Reveal>

        <Group className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3" gap={0.1}>
          {products.items.map((p) => (
            <Item key={p.name}>
              <article
                className={`card-lift flex h-full flex-col p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)] ${
                  p.featured ? 'border-[var(--color-gold)]/70 shadow-[var(--shadow-md)] ring-1 ring-[var(--color-gold)]/25' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[1.25rem] font-semibold">{p.name}</h3>
                  {p.featured && (
                    <span className="shrink-0 rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs font-semibold text-[var(--color-on-gold)] whitespace-nowrap">
                      Most popular
                    </span>
                  )}
                </div>

                <p className="mt-3 text-[var(--color-muted)] text-[0.9375rem]">{p.positioning}</p>

                <dl className="mt-7 space-y-3.5 border-t border-[var(--color-line)] pt-6">
                  {[['Amount', p.amount], ['Interest', p.rate], ['Tenure', p.tenure]].map(([k, v]) => (
                    <div key={k} className="flex items-baseline justify-between gap-4">
                      <dt className="text-sm text-[var(--color-muted)]">{k}</dt>
                      <dd data-numeric className="text-sm font-semibold text-[var(--color-ink)] text-right">{v}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 space-y-2.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[0.875rem] text-[var(--color-body)]">
                      <span className="mt-0.5 text-[var(--color-gold-ink)] shrink-0"><Icon name="check" size={16} /></span>
                      {pt}
                    </li>
                  ))}
                </ul>

                <a
                  href="#apply"
                  className={`btn mt-8 w-full ${p.featured ? 'btn-gold' : 'btn-outline'}`}
                >
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
