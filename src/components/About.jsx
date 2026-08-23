import { about, company, numbers, journey, SHOW_JOURNEY } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp, motion, useReducedMotion } from './motion'

/* ============================================================================
   About — the story on the left, the evidence on the right.

   Two independent columns rather than one flow: the narrative reads top to
   bottom on its own, while the numbers, timeline and contact details stack
   beside it as reference material. On a phone they collapse into one column in
   that same order.

   Every accent here is gold-ink (5.13:1 on light), not gold. Plain gold on a
   light surface is 2.5:1 and the contrast contract rules it out — the gold is
   only allowed to carry weight as a fill, a rule or a border.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

function SectionLabel({ children }) {
  return <span className="eyebrow block">{children}</span>
}

/* ---- Timeline ---------------------------------------------------------- */
function Journey({ reduce }) {
  return (
    <motion.ol
      className="relative mt-6"
      initial={reduce ? false : 'hidden'}
      whileInView={reduce ? false : 'show'}
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* The rail draws itself downward as the list scrolls in, so the eye is
          led through the years rather than being handed a finished line. */}
      <motion.span
        aria-hidden="true"
        className="absolute left-[5px] top-2 bottom-6 w-px origin-top bg-[var(--color-line)]"
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
        transition={{ duration: 1.1, ease: EASE }}
      />
      {journey.items.map((j, i) => (
        <motion.li
          key={j.year}
          className="relative pl-8 pb-8 last:pb-0"
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.25 + i * 0.18 }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-gold)] ring-4 ring-[var(--color-surface)]"
            variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.3 + i * 0.18 }}
          />
          <span data-numeric className="text-[0.8125rem] font-semibold tracking-[0.12em] text-[var(--color-gold-ink)]">
            {j.year}
          </span>
          <h4 className="mt-1 text-[1.0625rem] font-semibold text-[var(--color-ink)]">{j.title}</h4>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">{j.body}</p>
        </motion.li>
      ))}
    </motion.ol>
  )
}

export default function About() {
  const reduce = useReducedMotion()

  const contactRows = [
    { icon: 'mail', text: company.email, href: `mailto:${company.email}` },
    { icon: 'phone', text: company.phone, href: company.phoneHref },
    { icon: 'pin', text: company.address, href: null },
  ]

  return (
    <section id="about" className="section bg-[var(--color-surface)]">
      <div className="container-page">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ================= LEFT: the story ================= */}
          <div>
            <Reveal>
              <SectionLabel>{about.eyebrow}</SectionLabel>
              <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{about.title}</h2>
            </Reveal>

            <Group className="mt-6 space-y-5" gap={0.09}>
              {about.body.map((p) => (
                <Item key={p.slice(0, 24)} variants={rise}>
                  <p className="text-justify text-[var(--color-body)] leading-relaxed">{p}</p>
                </Item>
              ))}
            </Group>

            {/* Mission — the gold bar wipes down as it arrives. */}
            <Reveal className="mt-8">
              {/* THE TRIGGER IS ON THE CARD, NOT THE BAR. The bar starts at
                  scaleY 0, so it has zero rendered area — and an element with no
                  area never satisfies an IntersectionObserver threshold, so
                  whileInView on the bar itself never fired and it stayed
                  invisible. Same trap as the masked heading words. */}
              <motion.div
                className="relative overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-canvas)] p-6 pl-7"
                initial={reduce ? false : 'hidden'}
                whileInView={reduce ? false : 'show'}
                viewport={{ once: true, amount: 0.3 }}
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 w-1.5 origin-top bg-[var(--color-gold)]"
                  variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
                <h3 className="text-[1.0625rem] font-semibold text-[var(--color-ink)]">{about.mission.title}</h3>
                <p className="mt-3 text-[1.0625rem] italic leading-relaxed text-[var(--color-gold-ink)]">
                  “{about.mission.body}”
                </p>
              </motion.div>
            </Reveal>

            <Reveal className="mt-10">
              <h3 className="text-[1.125rem] font-semibold text-[var(--color-ink)]">{about.valuesTitle}</h3>
            </Reveal>

            <Group className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" gap={0.08}>
              {about.values.map((v) => (
                <Item key={v.title} variants={rise}>
                  <motion.article
                    className="h-full rounded-[var(--radius-md)] bg-[var(--color-canvas)] p-5"
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <h4 className="text-[1rem] font-semibold text-[var(--color-gold-ink)]">{v.title}</h4>
                    <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">{v.body}</p>
                  </motion.article>
                </Item>
              ))}
            </Group>
          </div>

          {/* ================= RIGHT: the evidence ================= */}
          <div>
            <Reveal>
              <SectionLabel>{numbers.eyebrow}</SectionLabel>
            </Reveal>

            <Group as="dl" className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2" gap={0.09}>
              {numbers.items.map((n) => (
                <Item key={n.label} variants={rise}>
                  <motion.div
                    className="rounded-[var(--radius-md)] bg-[var(--color-canvas)] p-5"
                    whileHover={reduce ? undefined : { y: -4 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                  >
                    <dt className="sr-only">{n.label}</dt>
                    <dd>
                      <span data-numeric className="block font-display text-[clamp(1.625rem,1.2rem+1.2vw,2rem)] font-semibold leading-none tracking-display text-[var(--color-gold-ink)]">
                        <CountUp value={n.value} />
                      </span>
                      <span className="mt-2 block text-[0.875rem] text-[var(--color-muted)]">{n.label}</span>
                    </dd>
                  </motion.div>
                </Item>
              ))}
            </Group>

            {/* Gated in data. See the warning above `journey` in content.js —
                these dates contradict the About copy and are unreconciled. */}
            {SHOW_JOURNEY && (
              <div className="mt-10">
                <Reveal><SectionLabel>{journey.eyebrow}</SectionLabel></Reveal>
                <Journey reduce={reduce} />
              </div>
            )}

            <Reveal className="mt-8">
              <div className="rounded-[var(--radius-md)] bg-[var(--color-canvas)] p-6">
                <h3 className="text-[1.0625rem] font-semibold text-[var(--color-ink)]">{about.contactTitle}</h3>
                <ul className="mt-4 space-y-3.5">
                  {contactRows.map((row) => (
                    <li key={row.icon} className="flex items-start gap-3 text-[0.9375rem] text-[var(--color-body)]">
                      <span className="mt-0.5 shrink-0 text-[var(--color-gold-ink)]" aria-hidden="true">
                        <Icon name={row.icon} size={17} />
                      </span>
                      {row.href ? (
                        <a href={row.href} className="leading-relaxed underline-offset-4 transition-colors hover:text-[var(--color-gold-ink)] hover:underline">
                          {row.text}
                        </a>
                      ) : (
                        <span className="leading-relaxed">{row.text}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal className="mt-5">
              <div className="flex items-start gap-3.5 rounded-[var(--radius-md)] border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/8 p-5">
                <span className="mt-0.5 shrink-0 text-[var(--color-gold-ink)]" aria-hidden="true">
                  <Icon name="shield" size={20} />
                </span>
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-[var(--color-ink)]">{about.partner.title}</h3>
                  <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--color-muted)]">{about.partner.body}</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
