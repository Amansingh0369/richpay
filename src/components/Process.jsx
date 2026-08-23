import { process } from '../data/content'
import { Reveal, Group, Item, motion, useReducedMotion, WordsUp } from './motion'

export default function Process() {
  const reduce = useReducedMotion()
  return (
    <section id="process" className="section bg-[var(--color-canvas)]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{process.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]"><WordsUp text={process.title} /></h2>
          <span className="rule-gold mx-auto mt-7" aria-hidden="true" />
        </Reveal>

        <Group as="ol" className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7" gap={0.11}>
          {process.steps.map((step, i) => (
            <Item as="li" key={step.n} className="group relative">
              {/* connector rail draws itself left-to-right */}
              {i < process.steps.length - 1 && (
                <motion.span
                  aria-hidden="true"
                  className="absolute left-[4.25rem] right-[-1.75rem] top-8 hidden h-px origin-left bg-gradient-to-r from-[var(--color-gold)]/55 to-[var(--color-line)] lg:block"
                  initial={reduce ? false : { scaleX: 0 }}
                  whileInView={reduce ? false : { scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.11 }}
                />
              )}
              <span
                data-numeric
                className="relative inline-flex h-16 w-16 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-navy)] font-display text-lg font-semibold text-[var(--color-gold-soft)] shadow-[var(--shadow-md)] transition-transform duration-300 group-hover:-translate-y-1"
              >
                {step.n}
                <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
              </span>
              <h3 className="mt-6 text-[1.125rem] font-semibold">{step.title}</h3>
              <p className="mt-3 text-[0.9375rem] text-[var(--color-muted)]">{step.body}</p>
            </Item>
          ))}
        </Group>
      </div>
    </section>
  )
}
