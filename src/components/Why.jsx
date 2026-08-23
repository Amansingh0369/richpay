import { why } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp } from './motion'
import mark from '../assets/richpay-mark-invert.png'

/* ============================================================================
   Why RichPay.
   Layout adapted from 21st.dev "Feature Bento" (id 18898): a 3-column bento
   whose tiles differ in *kind* — one large anchor tile, standard feature cards,
   a stat tile and a CTA tile — with content pinned to the bottom of each tile
   (`justify-between`) so the icons align across the row.

   Re-skinned onto our tokens. The source's blue/purple/rose gradients, shadcn
   `bg-card`/`bg-border` tokens, unsplash image, `↗` text-glyph "icon" and
   animate-ping are all gone.

   Gold appears exactly once, as the stat tile's FILL with navy text on top
   (6.37:1) — the only use the contrast contract sanctions on a light band.

     md grid:   [ featured  featured  item ]
                [ featured  featured  item ]
                [ item      stat      cta  ]
   ========================================================================== */

export default function Why() {
  const featured = why.items.find((i) => i.featured) || why.items[0]
  const rest = why.items.filter((i) => i !== featured)

  return (
    <section id="why" className="section bg-[var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{why.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{why.title}</h2>
          <p className="lead mt-6">{why.sub}</p>
        </Reveal>

        <Group
          className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[minmax(13rem,1fr)]"
          gap={0.085}
        >
          {/* ---- Anchor tile: the headline reason ---- */}
          <Item className="sm:col-span-2 md:row-span-2">
            <article className="surface-navy group relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] p-8 md:p-10">
              <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 text-white/[0.06]" />
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-gold)]/18 blur-3xl" />
              {/* Official growth-bar mark, filling the space the source template gave to a photo */}
              <img
                src={mark} alt="" aria-hidden="true"
                className="pointer-events-none absolute -bottom-8 right-[-3rem] w-64 max-w-none opacity-[0.07] transition-transform duration-700 group-hover:scale-105 md:w-80 lg:w-[22rem]"
              />

              <div className="relative">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-gold)]/16 text-[var(--color-gold-soft)] ring-1 ring-inset ring-[var(--color-gold)]/30 transition-transform duration-300 group-hover:scale-105">
                  <Icon name={featured.icon} size={26} />
                </span>
                <h3 className="mt-7 font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.125rem)] font-semibold leading-[1.15] tracking-display text-white">
                  {featured.title}
                </h3>
                <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-white/72">{featured.body}</p>
              </div>
            </article>
          </Item>

          {/* ---- Standard feature tiles ---- */}
          {rest.map((item) => (
            <Item key={item.title}>
              <article className="card-lift group flex h-full flex-col justify-between p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lg)]">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-gold)]/22 to-[var(--color-gold)]/8 text-[var(--color-gold-ink)] transition-transform duration-300 group-hover:scale-105">
                  <Icon name={item.icon} size={22} />
                </span>
                <div className="mt-8">
                  <h3 className="text-[1.0625rem] font-semibold leading-snug">{item.title}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">{item.body}</p>
                </div>
              </article>
            </Item>
          ))}

          {/* ---- Proof tile: the one gold fill on this band ---- */}
          <Item>
            <article className="relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(150deg,var(--color-gold-soft)_0%,var(--color-gold)_100%)] p-7 text-[var(--color-on-gold)]">
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-white/22 blur-3xl" />
              <div className="relative">
                <span data-numeric className="block font-display text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] font-semibold leading-none tracking-display">
                  <CountUp value={why.stat.value} />
                </span>
                <p className="mt-3 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-on-gold)]">
                  {why.stat.label}
                </p>
              </div>
            </article>
          </Item>

          {/* ---- CTA tile ---- */}
          <Item>
            <a
              href={why.cta.href}
              className="surface-navy-soft group relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] p-7 transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]"
            >
              <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[var(--color-gold)]/20 blur-3xl" />
              <span className="relative flex items-start justify-between gap-3">
                <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
                  {why.cta.eyebrow}
                </span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-300 group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-on-gold)]">
                  <Icon name="arrow-right" size={16} />
                </span>
              </span>
              <span className="relative mt-10 block font-display text-[1.25rem] font-semibold leading-snug tracking-display text-white">
                {why.cta.label}
              </span>
            </a>
          </Item>
        </Group>
      </div>
    </section>
  )
}
