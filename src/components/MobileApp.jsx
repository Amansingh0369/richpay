import { mobile } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, CountUp } from './motion'

export default function MobileApp() {
  return (
    <section id="mobile" className="section bg-[var(--color-canvas)]">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-16 items-center">
          <Reveal>
            <span className="eyebrow">{mobile.eyebrow}</span>
            <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{mobile.title}</h2>
            <p className="lead mt-5">{mobile.sub}</p>

            <ul className="mt-9 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {mobile.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-[0.9375rem] text-[var(--color-body)]">
                  <span className="mt-0.5 shrink-0 text-[var(--color-gold-ink)]"><Icon name="check" size={17} /></span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              {[['apple', 'App Store'], ['google-play', 'Google Play']].map(([icon, label]) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-3 text-[var(--color-muted)]"
                >
                  <Icon name={icon} size={22} />
                  <span className="text-left leading-tight">
                    <span className="block text-[0.6875rem] uppercase tracking-wider">{mobile.storeNote}</span>
                    <span className="block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
                  </span>
                </span>
              ))}
            </div>
          </Reveal>

          {/* ---- Phone mock ---- */}
          <Reveal delay={120} className="flex justify-center lg:justify-end">
            <div className="w-[290px] rounded-[2.25rem] bg-gradient-to-b from-[var(--color-royal)] to-[var(--color-navy)] p-3 shadow-[var(--shadow-xl)]">
              <div className="rounded-[1.75rem] bg-[var(--color-canvas)] overflow-hidden">
                <div className="bg-gradient-to-b from-[var(--color-royal)] to-[var(--color-navy)] px-5 pb-6 pt-4 text-white">
                  <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/25" aria-hidden="true" />
                  <p className="text-xs text-white/60">Welcome back</p>
                  <p className="text-lg font-semibold">Priya</p>
                </div>

                <div className="p-5">
                  <div className="card-lift p-4">
                    <p className="text-xs text-[var(--color-muted)]">Active loan</p>
                    <p data-numeric className="mt-1 text-2xl font-semibold text-[var(--color-navy)]">₹3,00,000</p>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-[var(--color-muted)]" data-numeric>
                        <span>40% repaid</span><span>₹13,500 / mo</span>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-[var(--color-line)] overflow-hidden" role="img" aria-label="40 percent repaid">
                        <span className="block h-full w-[40%] rounded-full bg-[var(--color-gold)]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <span className="rounded-[var(--radius-sm)] bg-[var(--color-gold)] px-3 py-2.5 text-center text-xs font-semibold text-[var(--color-on-gold)]">Pay EMI</span>
                    <span className="rounded-[var(--radius-sm)] border border-[var(--color-line)] px-3 py-2.5 text-center text-xs font-semibold text-[var(--color-navy)]">Statement</span>
                  </div>

                  <p className="mt-5 text-[0.6875rem] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Recent activity</p>
                  <ul className="mt-2.5 space-y-2.5">
                    {[['Disbursement', '₹3,00,000'], ['EMI payment', '−₹13,500']].map(([k, v]) => (
                      <li key={k} className="flex justify-between text-xs">
                        <span className="text-[var(--color-body)]">{k}</span>
                        <span data-numeric className="font-semibold text-[var(--color-ink)]">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
