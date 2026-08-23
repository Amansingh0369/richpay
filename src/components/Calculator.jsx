import { useId, useMemo, useState } from 'react'
import { calculator as c } from '../data/content'
import Icon from './Icons'
import { Reveal, motion, useReducedMotion, WordsUp } from './motion'

const inr = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Calculator() {
  const [amount, setAmount] = useState(c.amount.default)
  const [tenure, setTenure] = useState(c.tenure.default)
  const [rate, setRate] = useState(c.rate.default)
  const id = useId()
  const reduce = useReducedMotion()

  // Flat simple interest, matching the client's stated method.
  const { interest, total, interestPct } = useMemo(() => {
    const interest = Math.round(amount * (rate / 100) * tenure)
    const total = amount + interest
    return { interest, total, interestPct: total ? (interest / total) * 100 : 0 }
  }, [amount, tenure, rate])

  const controls = [
    { key: 'amount', label: 'Loan amount', value: amount, set: setAmount, cfg: c.amount,
      display: inr(amount), min: inr(c.amount.min), max: inr(c.amount.max) },
    { key: 'tenure', label: 'Tenure', value: tenure, set: setTenure, cfg: c.tenure,
      display: `${tenure} days`, min: `${c.tenure.min} days`, max: `${c.tenure.max} days` },
    { key: 'rate', label: 'Interest rate', value: rate, set: setRate, cfg: c.rate,
      display: `${rate.toFixed(2)}% / day`, min: `${c.rate.min}%`, max: `${c.rate.max}%` },
  ]

  return (
    <section id="calculator" className="section bg-[var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]"><WordsUp text={c.title} /></h2>
          <p className="lead mt-5">{c.sub}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
          {/* ---- Controls ---- */}
          <div className="card-lift p-8 md:p-9">
            <div className="space-y-9">
              {controls.map((ctrl) => (
                <div key={ctrl.key}>
                  <div className="flex items-baseline justify-between gap-4">
                    <label htmlFor={`${id}-${ctrl.key}`} className="text-sm font-medium text-[var(--color-body)]">
                      {ctrl.label}
                    </label>
                    <output
                      htmlFor={`${id}-${ctrl.key}`}
                      data-numeric
                      className="text-lg font-semibold text-[var(--color-navy)]"
                    >
                      {ctrl.display}
                    </output>
                  </div>
                  <input
                    id={`${id}-${ctrl.key}`}
                    type="range"
                    className="slider mt-4"
                    min={ctrl.cfg.min}
                    max={ctrl.cfg.max}
                    step={ctrl.cfg.step}
                    value={ctrl.value}
                    onChange={(e) => ctrl.set(Number(e.target.value))}
                  />
                  <div className="mt-2 flex justify-between text-xs text-[var(--color-muted)]" data-numeric>
                    <span>{ctrl.min}</span>
                    <span>{ctrl.max}</span>
                  </div>
                </div>
              ))}
            </div>

            <ul className="mt-9 pt-7 border-t border-[var(--color-line)] grid grid-cols-2 gap-3">
              {c.claims.map((claim) => (
                <li key={claim} className="flex items-center gap-2 text-[0.875rem] text-[var(--color-body)]">
                  <span className="text-[var(--color-gold-ink)] shrink-0"><Icon name="check" size={16} /></span>
                  {claim}
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Result ---- */}
          <div className="surface-navy-soft relative overflow-hidden rounded-[var(--radius-lg)] p-8 text-white shadow-[var(--shadow-xl)] md:p-9">
            <h3 className="text-white text-[1.0625rem] font-semibold">Your repayment summary</h3>

            <dl aria-live="polite" className="mt-7 space-y-5">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-white/70">Principal</dt>
                <dd data-numeric className="text-lg font-semibold text-white">{inr(amount)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm text-white/70">Interest</dt>
                <dd data-numeric className="text-lg font-semibold text-[var(--color-gold-soft)]">{inr(interest)}</dd>
              </div>

              {/* Split bar: principal vs interest */}
              <div>
                <div className="h-2.5 w-full rounded-full overflow-hidden bg-white/15 flex" aria-hidden="true">
                  <motion.span className="h-full bg-white/85" animate={{ width: `${100 - interestPct}%` }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.16,1,0.3,1] }} />
                  <motion.span className="h-full bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-gold-soft)]" animate={{ width: `${interestPct}%` }} transition={{ duration: reduce ? 0 : 0.5, ease: [0.16,1,0.3,1] }} />
                </div>
                <p className="mt-2.5 text-xs text-white/60" data-numeric>
                  Interest is {interestPct.toFixed(1)}% of what you repay
                </p>
              </div>

              <div className="flex items-baseline justify-between gap-4 border-t border-white/12 pt-5">
                <dt className="text-sm font-medium text-white">Total payable</dt>
                <dd data-numeric className="text-[1.75rem] leading-none font-semibold text-[var(--color-gold-soft)]">{inr(total)}</dd>
              </div>
            </dl>

            <a href="#apply" className="btn btn-gold w-full mt-8">
              Check eligibility <Icon name="arrow-right" size={18} />
            </a>

            <p className="mt-6 text-xs leading-relaxed text-white/55">{c.disclosure}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
