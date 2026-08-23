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

/* Inline markup inside otherwise plain copy: **bold** and [label](href).
   Internal hrefs go through SmartLink so cross-document links stay client-side. */
const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g
const LINK_CLASS = 'font-medium text-[var(--color-ink)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-2 transition-colors hover:text-[var(--color-gold-ink)] cursor-pointer'

function renderInline(text) {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[var(--color-ink)]">{part.slice(2, -2)}</strong>
    }
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (m) {
      const [, label, href] = m
      return /^(mailto:|tel:|https?:)/.test(href)
        ? <a key={i} href={href} className={`${LINK_CLASS} break-all`}>{label}</a>
        : <SmartLink key={i} to={href} className={LINK_CLASS}>{label}</SmartLink>
    }
    return <Fragment key={i}>{part}</Fragment>
  })
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
    case 'ol': {
      const ordered = block.type === 'ol'
      const List = ordered ? 'ol' : 'ul'
      return (
        <List className={`mt-4 space-y-2.5 ${ordered ? 'list-decimal pl-6 marker:font-semibold marker:text-[var(--color-gold-ink)]' : ''}`}>
          {block.items.map((it, i) => {
            const isTerm = typeof it === 'object'
            const body = isTerm ? (
              <>
                <strong className="font-semibold text-[var(--color-ink)]">{it.term}</strong>
                {it.dash === false ? ' ' : ' — '}
                {renderInline(it.text)}
              </>
            ) : renderInline(it)
            return ordered ? (
              <li key={i} className="pl-1 leading-[1.8] text-[var(--color-muted)]">{body}</li>
            ) : (
              <li key={i} className="relative pl-6 leading-[1.8] text-[var(--color-muted)]">
                <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                {body}
              </li>
            )
          })}
        </List>
      )
    }
    case 'faq':
      /* Native <details>/<summary>: keyboard-operable and announces its
         expanded state with no JS and no ARIA wiring of our own. */
      return (
        <section className="mt-14 first:mt-0">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-ink)]">
            {block.category}
          </h2>
          <div className="mt-4 space-y-2.5">
            {block.items.map((it) => (
              <details key={it.q} className="group overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[0.9375rem] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-line)]/50 [&::-webkit-details-marker]:hidden">
                  <span>{it.q}</span>
                  <span aria-hidden="true" className="shrink-0 text-[var(--color-gold-ink)] transition-transform duration-200 group-open:rotate-180">
                    <Icon name="chevron-down" size={18} />
                  </span>
                </summary>
                <div className="px-5 pb-5 [&>*:first-child]:mt-0">
                  {it.a.map((blk, j) => <Block key={j} block={blk} />)}
                </div>
              </details>
            ))}
          </div>
        </section>
      )
    case 'note':
      // Closing acknowledgement — set apart from the numbered clauses above it.
      return (
        <p className="mt-12 border-t border-[var(--color-line)] pt-6 text-[0.9375rem] italic leading-[1.8] text-[var(--color-muted)]">
          {renderInline(block.text)}
        </p>
      )
    case 'contact':
      return (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-line)] bg-[var(--color-surface)] p-6 md:p-7">
          {block.groups.map((g, i) => (
            <div key={g.label} className={i ? 'mt-6' : ''}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-ink)]">{g.label}</p>
              {g.rows.map((r, j) => {
                const link = 'mt-2 flex w-fit min-h-6 items-center gap-2 py-1 text-[0.9375rem] font-medium text-[var(--color-ink)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-gold-ink)] cursor-pointer'
                if (r.kind === 'email') return (
                  <a key={j} href={`mailto:${r.value}`} className={`${link} break-all`}>
                    <Icon name="mail" size={16} className="shrink-0 text-[var(--color-gold-ink)]" />
                    {r.value}
                  </a>
                )
                if (r.kind === 'phone') return (
                  <a key={j} href={`tel:${r.value.replace(/[^+\d]/g, '')}`} className={link}>
                    <Icon name="phone" size={16} className="shrink-0 text-[var(--color-gold-ink)]" />
                    <span data-numeric>{r.value}</span>
                  </a>
                )
                if (r.kind === 'note') return (
                  <p key={j} className="mt-3 text-[0.875rem] leading-relaxed text-[var(--color-muted)]">{renderInline(r.value)}</p>
                )
                return (
                  <p key={j} className="mt-2 flex items-start gap-2 text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">
                    <Icon name="pin" size={16} className="mt-1 shrink-0 text-[var(--color-gold-ink)]" />
                    <span>{r.value.map((line, k) => <Fragment key={k}>{line}{k < r.value.length - 1 && <br />}</Fragment>)}</span>
                  </p>
                )
              })}
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
            <div className={`${COLUMN} text-center`}>
              <span className="pill pill-quiet">{doc.eyebrow}</span>
              <h1 className="mt-6 font-display text-[clamp(2rem,1.4rem+2vw,2.75rem)] font-semibold leading-[1.1] tracking-display text-white">
                {doc.title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/72">{doc.sub}</p>
              {/* The Fair Practice Code carries no revision date; only render one
                  when the source document actually states it. */}
              {doc.updated && (
                <p className="mt-5 text-[0.8125rem] text-white/55">Last updated: {doc.updated}</p>
              )}
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
