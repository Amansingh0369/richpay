import { trust } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp } from './motion'

export default function Trust() {
  return (
    <section id="trust" className="surface-navy grain section relative overflow-hidden">
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 w-full h-32 opacity-25" viewBox="0 0 1440 128" preserveAspectRatio="none">
        <path d="M0 20 C 380 120, 1060 120, 1440 20" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
      </svg>

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="pill">{trust.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08] text-white">{trust.title}</h2>
          <span className="rule-gold mx-auto mt-6" aria-hidden="true" />
        </Reveal>

        <Group className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3" gap={0.1}>
          {trust.items.map((item) => (
            <Item key={item.title}>
              <article className="glass h-full p-8 transition-transform duration-300 hover:-translate-y-1">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-gold)]/20 text-[var(--color-gold-soft)]">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="mt-5 text-[1.125rem] font-semibold text-white">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] text-white/70">{item.body}</p>
              </article>
            </Item>
          ))}
        </Group>

        {/* Static, correct figures — the live site currently renders these as
            0+ / ₹0Cr+ / 0.0★ / <0 min because its count-up never initialises. */}
        <Group as="dl" className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 lg:grid-cols-4" gap={0.09}>
          {trust.stats.map((s) => (
            <Item key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span data-numeric className="flex items-center gap-1 text-[1.75rem] md:text-[2rem] leading-none font-semibold text-[var(--color-gold-soft)]"><CountUp value={s.value} />{s.star && <Icon name="star" size={19} className="text-[var(--color-gold)]" />}</span>
                <span className="mt-2.5 block text-sm text-white/60">{s.label}</span>
              </dd>
            </Item>
          ))}
        </Group>
      </div>
    </section>
  )
}
