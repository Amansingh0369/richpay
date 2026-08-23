import { bandStats } from '../data/content'
import { Group, Item, CountUp } from './motion'

export default function StatsBand() {
  return (
    <section aria-label="Key figures" className="relative border-y border-[var(--color-line)] bg-[var(--color-surface)]">
      <Group as="dl" className="container-page grid grid-cols-1 gap-10 py-14 text-center sm:grid-cols-3 sm:gap-8 md:py-16" gap={0.1}>
        {bandStats.map((s) => (
          <Item key={s.label} className="relative">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span data-numeric className="block font-display text-[2.25rem] font-semibold leading-none tracking-display text-[var(--color-navy)] md:text-[2.75rem]">
                <CountUp value={s.value} />
              </span>
              <span className="mt-3.5 block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{s.label}</span>
            </dd>
          </Item>
        ))}
      </Group>
    </section>
  )
}
