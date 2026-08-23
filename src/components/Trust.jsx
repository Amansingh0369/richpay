import { trust } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp, WordsUp } from './motion'

export default function Trust() {
  return (
    <section id="trust" className="surface-navy grain section relative overflow-hidden">
      {/* Sunrise along the bottom edge.

          The light comes from blurring a STROKE of the curve, not a circle and
          not the filled shape. A radial gradient is brightest at its centre, so
          it pooled the glow mid-section and left the ends of the arc dark; and
          blurring the filled dome is not much better, because a blur spreads in
          proportion to the shape's mass and the dome is thickest in the middle.
          A stroked line is the same width everywhere, so blurring it lays down
          an even band of light along the entire arc — measured at the edges as
          well as the centre.

          Two passes: a wide soft halo and a tighter one, then the sharp disc on
          top. All three are static, so the blur rasterises once and never costs
          a frame.

          The svg's own box is the clip that keeps the light off the stats. A
          first pass at stdDeviation 52 smeared the shape into a near-solid band
          that reached the stat labels — measured #deba6f directly behind them,
          which is gold-on-gold. Height and blur are both sized so the glow has
          faded out before it reaches that row. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-44 w-full"
        viewBox="0 0 1440 176"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trust-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-soft)" />
            <stop offset="100%" stopColor="var(--color-gold)" />
          </linearGradient>
          <filter id="trust-sun-wide" x="-15%" y="-120%" width="130%" height="340%">
            <feGaussianBlur stdDeviation="17" />
          </filter>
          <filter id="trust-sun-tight" x="-10%" y="-60%" width="120%" height="220%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <path d="M0 144 C 380 56, 1060 56, 1440 144" fill="none" stroke="var(--color-gold)" strokeWidth="16" opacity="0.72" filter="url(#trust-sun-wide)" />
        <path d="M0 144 C 380 56, 1060 56, 1440 144" fill="none" stroke="var(--color-gold-soft)" strokeWidth="8" opacity="0.95" filter="url(#trust-sun-tight)" />
        <path d="M0 176 L0 144 C 380 56, 1060 56, 1440 144 L1440 176 Z" fill="url(#trust-sun)" />
      </svg>

      <div className="container-page relative">
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className="eyebrow eyebrow-on-navy">{trust.eyebrow}</span>
          {/* One line from md up; the wrapper widens with it. Still wraps on a
              phone rather than shrinking below readable. */}
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08] text-white md:whitespace-nowrap">
            <WordsUp text={trust.title} />
          </h2>
          <span className="rule-gold mx-auto mt-6" aria-hidden="true" />
        </Reveal>

        <Group className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3" gap={0.1}>
          {trust.items.map((item) => (
            <Item key={item.title}>
              {/* White on navy, so the copy switches to the light-surface
                  tokens. The icon is gold-ink (5.13:1 on white) — plain gold on
                  white is 2.5:1 and the contract rules it out. */}
              <article className="h-full rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-card)] p-8 shadow-[var(--shadow-lg)] transition-transform duration-300 hover:-translate-y-1">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-gold)]/15 text-[var(--color-gold-ink)]">
                  <Icon name={item.icon} size={22} />
                </span>
                <h3 className="mt-5 text-[1.125rem] font-semibold text-[var(--color-ink)]">{item.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] text-[var(--color-muted)]">{item.body}</p>
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
                <span className="mt-2.5 block text-sm text-white/80">{s.label}</span>
              </dd>
            </Item>
          ))}
        </Group>
      </div>
    </section>
  )
}
