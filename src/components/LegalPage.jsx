import { Fragment } from 'react'
import Header from './Header'
import Footer from './Footer'
import Icon from './Icons'
import SmartLink from './SmartLink'

/* ============================================================================
   Shell for legal / policy pages (privacy policy, terms, fair practice code…).

   Long-form regulatory prose, so the priorities are different from the
   marketing sections: a narrow measure (~68ch, inside the 65–75 the design
   system asks for), generous leading, and a visible heading hierarchy that
   survives skim-reading. Motion is one quiet reveal — this is a document, not
   a pitch.

   NOTE: the published page justifies its body text (`text-align: justify` +
   `hyphens: auto`). That is not carried over — justified text on a narrow
   measure opens rivers of whitespace and hurts readability, and the design
   system's line-length rule already handles measure. Left-aligned here.
   ========================================================================== */

/* Both the title band and the document share this column so their left edges
   line up and the whole page reads as one centred measure. ~44rem keeps body
   copy near 70 characters a line, inside the 65-75 the design system asks for. */
const COLUMN = 'mx-auto w-full max-w-[44rem]'

/** Renders **bold** spans inside otherwise plain copy. */
function renderInline(text) {
  return text.split('**').map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-[var(--color-ink)]">{part}</strong>
      : <Fragment key={i}>{part}</Fragment>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="mt-14 scroll-mt-28 border-b border-[var(--color-line)] pb-3 font-display text-[1.375rem] font-semibold leading-tight text-[var(--color-ink)] first:mt-0">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 className="mt-8 font-display text-[1.0625rem] font-semibold text-[var(--color-ink)]">
          {block.text}
        </h3>
      )
    case 'p':
      return <p className="mt-4 leading-[1.8] text-[var(--color-muted)]">{renderInline(block.text)}</p>
    case 'ul':
      return (
        <ul className="mt-4 space-y-2.5">
          {block.items.map((it, i) => {
            const isTerm = typeof it === 'object'
            return (
              <li key={i} className="relative pl-6 leading-[1.8] text-[var(--color-muted)]">
                <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                {isTerm ? (
                  <>
                    <strong className="font-semibold text-[var(--color-ink)]">{it.term}</strong>
                    {it.dash === false ? ' ' : ' — '}
                    {renderInline(it.text)}
                  </>
                ) : renderInline(it)}
              </li>
            )
          })}
        </ul>
      )
    case 'contact':
      return (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-7">
          {block.groups.map((g, i) => (
            <div key={g.label} className={i ? 'mt-6' : ''}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-ink)]">{g.label}</p>
              {g.rows.map((r, j) => r.kind === 'email' ? (
                <a
                  key={j}
                  href={`mailto:${r.value}`}
                  className="mt-2 inline-flex min-h-6 items-center gap-2 py-1 text-[0.9375rem] font-medium text-[var(--color-ink)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-gold-ink)] cursor-pointer break-all"
                >
                  <Icon name="mail" size={16} className="shrink-0 text-[var(--color-gold-ink)]" />
                  {r.value}
                </a>
              ) : (
                <p key={j} className="mt-2 flex items-start gap-2 text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">
                  <Icon name="pin" size={16} className="mt-1 shrink-0 text-[var(--color-gold-ink)]" />
                  <span>{r.value.map((line, k) => <Fragment key={k}>{line}{k < r.value.length - 1 && <br />}</Fragment>)}</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      )
    default:
      return null
  }
}

export default function LegalPage({ doc }) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />

      <main id="main" className="on-light">
        {/* ---- Title band ---- */}
        <section className="surface-hero relative overflow-hidden pt-32 pb-14 md:pt-36 md:pb-16">
          <div className="container-page relative z-10">
            <div className={COLUMN}>
              <SmartLink
                to="/"
                className="flex w-fit min-h-6 items-center gap-2 py-1 text-sm font-medium text-white/70 transition-colors hover:text-[var(--color-gold-soft)] cursor-pointer"
              >
                <span aria-hidden="true" className="inline-block rotate-180"><Icon name="arrow-right" size={16} /></span>
                Back to home
              </SmartLink>
              <div className="mt-6">
                <span className="pill pill-quiet">{doc.eyebrow}</span>
              </div>
              <h1 className="mt-5 font-display text-[clamp(2rem,1.4rem+2vw,2.75rem)] font-semibold leading-[1.1] tracking-display text-white">
                {doc.title}
              </h1>
              <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/72">{doc.sub}</p>
              <p className="mt-5 text-[0.8125rem] text-white/55">Last updated: {doc.updated}</p>
            </div>
          </div>
        </section>

        {/* ---- Document ---- */}
        <section className="bg-[var(--color-canvas)] py-16 md:py-20">
          <div className="container-page">
            {/* No scroll-reveal here: legal copy must render immediately and be
                crawlable, and a document this tall never satisfies whileInView. */}
            <div className={`${COLUMN} text-[1rem]`}>
              {doc.blocks.map((b, i) => <Block key={i} block={b} />)}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
