import { useEffect, useId, useMemo, useState } from 'react'
import { AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react'
import NumberFlow from '@number-flow/react'
import { calculator as c } from '../data/content'
import Icon from './Icons'
import { Reveal, motion, useReducedMotion, WordsUp } from './motion'

/* ============================================================================
   Loan calculator — two products behind one switch.

   The switch is not cosmetic. The two products are priced by different methods
   and the arithmetic differs accordingly:

     · Short-Term Loan — FLAT simple interest, charged per day:
         interest = principal x rate x days
       Every day of the tenure is charged on the full principal, so there is no
       EMI to speak of; the borrower repays one lump sum.

     · Personal Loan — REDUCING-BALANCE EMI, charged per month:
         EMI = P x r x (1+r)^n / ((1+r)^n - 1)
       Interest is charged on the outstanding balance, which falls with every
       instalment. Quoting a flat-interest total here would overstate the cost
       materially, so the two paths never share a formula.

   Both panels are the same component; `key={product.id}` remounts it on switch
   so the sliders pick up the new product's defaults rather than carrying over
   values from a range that no longer exists.
   ========================================================================== */

const INR = { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }

const inr = (n) => new Intl.NumberFormat('en-IN', INR).format(n)

/* Every figure that changes as the sliders move animates digit by digit rather
   than snapping. NumberFlow honours prefers-reduced-motion on its own, so it
   renders the value plainly when the reader has asked for less movement.
   The wrapping span carries data-numeric so the figures stay tabular.

   The animated element is hidden from assistive tech and the plain formatted
   string is supplied beside it. NumberFlow splits a number into per-digit nodes
   inside a shadow root and sets no aria-label, so the results panel — which is
   an aria-live region — otherwise announced its labels with no figures attached
   to them. This way the visual rolls and the announcement stays a whole
   number. */
function Num({ value, format, className = '' }) {
  const text = new Intl.NumberFormat('en-IN', format).format(value)
  return (
    <span data-numeric className={className}>
      <span aria-hidden="true">
        <NumberFlow value={value} locales="en-IN" format={format} />
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

/* Text that changes when the product switches. Keyed on the product id so
   AnimatePresence sees a new child and can move the old one out before the new
   one arrives — a plain re-render would just substitute the string with no
   transition at all. Springs, to match the pill sliding under the tabs. */
const SWAP = { type: 'spring', stiffness: 420, damping: 34, mass: 0.6 }

function Swap({ swapKey, children, className = '', as = 'span' }) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.span
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Tag
        key={swapKey}
        className={className}
        initial={{ opacity: 0, y: 9 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -9 }}
        transition={SWAP}
      >
        {children}
      </Tag>
    </AnimatePresence>
  )
}

const Money = ({ value, className }) => <Num value={value} format={INR} className={className} />
const Pct = ({ value, digits = 2, className }) => (
  <Num value={value / 100} format={{ style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits }} className={className} />
)

const EASE = [0.16, 1, 0.3, 1]

function compute(product, amount, tenure, rate) {
  if (product.method === 'emi') {
    const r = rate / 100
    const n = tenure
    const pow = Math.pow(1 + r, n)
    // r === 0 would divide by zero; the range never reaches it, but the guard
    // costs nothing and keeps the function total.
    const emi = r === 0 ? amount / n : (amount * r * pow) / (pow - 1)
    const total = Math.round(emi * n)
    return { emi: Math.round(emi), total, interest: total - amount }
  }
  const interest = Math.round(amount * (rate / 100) * tenure)
  return { emi: null, total: amount + interest, interest }
}

/* ---- Donut ------------------------------------------------------------- */
/* pathLength={1} puts stroke-dasharray into fractions of the circumference, so
   the arcs are just the two shares and no geometry maths leaks into the JSX. */
function Donut({ interestFraction, label, labelKey, value, reduce }) {
  /* THE FIX: useSpring(number) only reads that number once — it does not
     retarget when the prop changes, so the arcs stayed frozen at whatever the
     first render produced while the percentage text beside them moved. Driving
     the spring from a MotionValue we set in an effect is what makes it track. */
  const target = useMotionValue(interestFraction)
  useEffect(() => { target.set(interestFraction) }, [interestFraction, target])
  const spring = useSpring(target, reduce ? { stiffness: 2000, damping: 120 } : { stiffness: 120, damping: 20 })

  // pathLength={1} puts stroke-dasharray into fractions of the circumference,
  // so the arcs are just the two shares — no geometry maths in the JSX.
  const interestDash = useTransform(spring, (v) => `${Math.min(1, Math.max(0, v))} 1`)
  const principalDash = useTransform(spring, (v) => `${Math.min(1, Math.max(0, 1 - v))} 1`)
  const interestOffset = useTransform(spring, (v) => -(1 - v))

  return (
    <div className="relative shrink-0">
      {/* A thinner ring on a larger circle: the centre label has to hold up to
          eight glyphs of currency, and the old 15px stroke on a 9.5rem circle
          left it crowding the ring. */}
      <svg viewBox="0 0 160 160" className="h-44 w-44" aria-hidden="true" focusable="false">
        <circle cx="80" cy="80" r="58" fill="rgba(255,255,255,0.04)" />
        <g transform="rotate(-90 80 80)">
          <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="12" />
          <motion.circle
            cx="80" cy="80" r="64" pathLength={1} fill="none"
            stroke="rgba(255,255,255,0.92)" strokeWidth="12" strokeLinecap="round"
            style={{ strokeDasharray: principalDash }}
          />
          <motion.circle
            cx="80" cy="80" r="64" pathLength={1} fill="none"
            stroke="var(--color-gold)" strokeWidth="12" strokeLinecap="round"
            style={{ strokeDasharray: interestDash, strokeDashoffset: interestOffset }}
          />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <Swap swapKey={labelKey} className="block text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white/75">{label}</Swap>
        <Money
          value={value}
          className="mt-1.5 block font-display text-[1.5rem] font-semibold leading-none tracking-display text-white"
        />
      </div>
    </div>
  )
}

/* ---- One product's panel ----------------------------------------------- */
/* CONTROLLED, and deliberately NOT remounted on switch. Each product's slider
   values live in the parent, so this component instance survives the change and
   every figure animates from the old product's number to the new one. Remounting
   it (the obvious `key={product.id}`) resets NumberFlow, and the switch snaps. */
function Panel({ product: p, values, onChange }) {
  const id = useId()
  const reduce = useReducedMotion()
  const { amount, tenure, rate, unit } = values
  const patch = (next) => onChange({ ...values, ...next })
  // Months-or-years only exists for the monthly product; days have no second unit.
  const monthly = p.tenure.unit === 'months'
  const years = monthly && unit === 'yr'

  const { emi, total, interest } = useMemo(() => compute(p, amount, tenure, rate), [p, amount, tenure, rate])
  const interestPct = total ? (interest / total) * 100 : 0

  const tenureText = years ? `${tenure / 12} yr` : monthly ? `${tenure} mo` : `${tenure} days`
  const tenureNode = (
    <>
      <Num value={years ? tenure / 12 : tenure} /> {years ? 'yr' : monthly ? 'mo' : 'days'}
    </>
  )

  const switchUnit = (next) => {
    // Years snap to whole multiples of 12, and never below one full year.
    const snapped = next === 'yr' ? Math.min(p.tenure.max, Math.max(12, Math.round(tenure / 12) * 12)) : tenure
    patch({ unit: next, tenure: snapped })
  }

  const controls = [
    {
      key: 'amount', label: 'Loan Amount', value: amount, set: (v) => patch({ amount: v }),
      min: p.amount.min, max: p.amount.max, step: p.amount.step,
      display: <Money value={amount} />, minText: inr(p.amount.min), maxText: inr(p.amount.max),
    },
    {
      key: 'tenure', label: p.tenure.label, value: tenure, set: (v) => patch({ tenure: v }),
      min: years ? 12 : p.tenure.min, max: p.tenure.max, step: years ? 12 : p.tenure.step,
      display: tenureNode,
      minText: years ? '1 yr' : monthly ? `${p.tenure.min} mo` : `${p.tenure.min} days`,
      maxText: years ? `${p.tenure.max / 12} yr` : monthly ? `${p.tenure.max} mo` : `${p.tenure.max} days`,
    },
    {
      key: 'rate', label: p.rate.label, value: rate, set: (v) => patch({ rate: v }),
      min: p.rate.min, max: p.rate.max, step: p.rate.step,
      display: <Pct value={rate} />, minText: `${p.rate.min}%`, maxText: `${p.rate.max}%`,
    },
  ]

  const methodNote = p.method === 'emi'
    ? `Reducing balance EMI at ${rate.toFixed(2)}%/month (${(rate * 12).toFixed(2)}% p.a.). Range: ${p.rate.min}%–${p.rate.max}%/month (${p.rate.min * 12}%–${p.rate.max * 12}% p.a.). Final rate based on credit profile.`
    : `Flat simple interest at ${rate.toFixed(2)}%/day × ${tenure} days.`

  const stats = [
    { label: 'Principal', value: <Money value={amount} />, tone: 'text-white' },
    { label: 'Interest', value: <Money value={interest} />, tone: 'text-[var(--color-gold-soft)]' },
    { label: 'Tenure', value: tenureNode, tone: 'text-white/85' },
  ]

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      {/* ---- Controls ---- */}
      <div className="card-lift p-7 md:p-9">
        <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-ink)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-gold)]" />
          <Swap swapKey={p.id}>{p.label}</Swap>
        </span>

        <div className="mt-8 space-y-8">
          {controls.map((ctrl) => {
            const fill = ((ctrl.value - ctrl.min) / (ctrl.max - ctrl.min)) * 100
            return (
              <div key={ctrl.key}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <label htmlFor={`${id}-${ctrl.key}`} className="text-[0.9375rem] font-medium text-[var(--color-ink)]">
                      <Swap swapKey={`${p.id}-${ctrl.key}`} className="block">{ctrl.label}</Swap>
                    </label>

                    {/* Months / years, on the monthly product only. */}
                    {ctrl.key === 'tenure' && monthly && (
                      <span role="group" aria-label="Tenure unit" className="inline-flex rounded-full bg-[var(--color-canvas)] p-0.5 ring-1 ring-inset ring-[var(--color-line)]">
                        {[['mo', 'Mo'], ['yr', 'Yr']].map(([key, text]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => switchUnit(key)}
                            aria-pressed={unit === key}
                            className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                              unit === key
                                ? 'bg-[var(--color-gold)] text-[var(--color-on-gold)]'
                                : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                            }`}
                          >
                            {text}
                          </button>
                        ))}
                      </span>
                    )}
                  </div>

                  <output
                    htmlFor={`${id}-${ctrl.key}`}
                    data-numeric
                    className="rounded-[var(--radius-md)] border border-[var(--color-gold)]/35 bg-[var(--color-gold)]/10 px-3.5 py-1.5 text-[1.0625rem] font-semibold text-[var(--color-navy)]"
                  >
                    {ctrl.display}
                  </output>
                </div>

                <input
                  id={`${id}-${ctrl.key}`}
                  type="range"
                  className="slider mt-4"
                  style={{ '--fill': `${fill}%` }}
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={ctrl.value}
                  onChange={(e) => ctrl.set(Number(e.target.value))}
                />
                <div className="mt-2 flex justify-between text-xs text-[var(--color-muted)]" data-numeric>
                  <span>{ctrl.minText}</span>
                  <span>{ctrl.maxText}</span>
                </div>
              </div>
            )
          })}
        </div>

        <Swap
          as="p"
          swapKey={p.id}
          className="mt-8 border-t border-[var(--color-line)] pt-6 text-xs leading-relaxed text-[var(--color-muted)]"
        >
          * {methodNote} {c.disclosure}
        </Swap>
      </div>

      {/* ---- Result ---- */}
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-navy)] p-7 text-white shadow-[var(--shadow-xl)] md:p-8">
        {/* Three at-a-glance chips. */}
        <dl className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[var(--radius-md)] bg-white/[0.06] px-3 py-3 text-center ring-1 ring-inset ring-white/10">
              <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-white/55">{s.label}</dt>
              <dd className={`mt-1.5 text-[0.9375rem] font-semibold ${s.tone}`}>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div aria-live="polite" className="mt-7 flex flex-wrap items-center gap-6 sm:flex-nowrap">
          <Donut
            interestFraction={interestPct / 100}
            label={p.headline}
            labelKey={p.id}
            value={p.method === 'emi' ? emi : total}
            reduce={reduce}
          />

          {/* The donut is aria-hidden; this legend is what actually carries the
              two numbers to assistive tech. */}
          <dl className="min-w-0 space-y-4">
            <div>
              <dt className="flex items-center gap-2 text-[0.8125rem] text-white/65">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-white/92" />
                Principal
              </dt>
              <dd><Money value={amount} className="mt-1 block text-[1.0625rem] font-semibold text-white" /></dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-[0.8125rem] text-white/65">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-[3px] bg-[var(--color-gold)]" />
                Total Interest
              </dt>
              <dd><Money value={interest} className="mt-1 block text-[1.0625rem] font-semibold text-[var(--color-gold-soft)]" /></dd>
            </div>
            <p className="inline-flex items-center gap-2 rounded-full bg-[var(--color-gold)]/18 px-3 py-1.5 text-xs font-semibold text-[var(--color-gold-soft)] ring-1 ring-inset ring-[var(--color-gold)]/30">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
              <span><Pct value={interestPct} digits={1} /> of total</span>
            </p>
          </dl>
        </div>

        <div className="mt-7 rounded-[var(--radius-md)] bg-white/[0.06] p-5 ring-1 ring-inset ring-white/10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/60">Total repayment</p>
              <AnimatePresence initial={false}>
                {emi !== null && (
                  <motion.p
                    key="emi"
                    className="overflow-hidden text-[0.8125rem] text-white/70"
                    initial={reduce ? false : { opacity: 0, height: 0, marginTop: 0 }}
                    animate={reduce ? false : { opacity: 1, height: 'auto', marginTop: 4 }}
                    exit={reduce ? undefined : { opacity: 0, height: 0, marginTop: 0 }}
                    transition={SWAP}
                  >
                    EMI: <Money value={emi} className="font-semibold text-white" />
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <Money
              value={total}
              className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2rem)] font-semibold leading-none tracking-display text-[var(--color-gold-soft)]"
            />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={p.id}
            className="mt-7 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2"
            initial={reduce ? false : 'hidden'}
            animate={reduce ? false : 'show'}
            exit={reduce ? undefined : 'hidden'}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
          >
            {p.claims.map((claim) => (
              <motion.li
                key={claim}
                className="flex items-center gap-2 text-[0.875rem] text-white/85"
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={SWAP}
              >
                <span className="shrink-0 text-[var(--color-gold-soft)]"><Icon name="check" size={16} /></span>
                {claim}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>

        <a href="#apply" className="btn btn-gold mt-7 w-full">
          Check eligibility <Icon name="arrow-right" size={18} />
        </a>
      </div>
    </div>
  )
}

export default function Calculator() {
  const [active, setActive] = useState('personal')
  /* Both products' slider values are held here at once. Keeping them in the
     parent is what lets one Panel instance serve both — switching changes its
     props rather than replacing it, so the figures animate across. */
  const [values, setValues] = useState(() =>
    Object.fromEntries(c.products.map((p) => [p.id, {
      amount: p.amount.default, tenure: p.tenure.default, rate: p.rate.default, unit: 'mo',
    }])),
  )
  const reduce = useReducedMotion()
  const product = c.products.find((p) => p.id === active) || c.products[0]
  const tabId = useId()

  /* Proper tab semantics, including the arrow-key movement a tablist is
     expected to support — without it the switch is a mouse-only control. */
  const onKeyDown = (e) => {
    const i = c.products.findIndex((p) => p.id === active)
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(c.products[(i + 1) % c.products.length].id)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(c.products[(i - 1 + c.products.length) % c.products.length].id)
    }
  }

  return (
    <section id="calculator" className="section bg-[var(--color-surface)]">
      <div className="container-page">
        <Reveal className="mx-auto max-w-5xl text-center">
          <span className="eyebrow">{c.eyebrow}</span>
          {/* One line from md up; the wrapper has to widen with it, since
              max-w-2xl is narrower than this title at full size. Still wraps on
              a phone rather than shrinking below readable. */}
          <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08] md:whitespace-nowrap">
            <WordsUp text={c.title} />
          </h2>
          <p className="lead mx-auto mt-5 max-w-2xl">{c.sub}</p>
        </Reveal>

        {/* ---- Product switch ---- */}
        <div className="mt-10 flex justify-center">
          <div
            role="tablist"
            aria-label="Loan product"
            onKeyDown={onKeyDown}
            className="relative inline-flex rounded-full border border-[var(--color-line)] bg-[var(--color-card)] p-1.5 shadow-[var(--shadow-md)]"
          >
            {c.products.map((p) => {
              const on = p.id === active
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  id={`${tabId}-${p.id}`}
                  aria-selected={on}
                  aria-controls={`${tabId}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(p.id)}
                  className="relative cursor-pointer rounded-full px-5 py-2.5 text-center transition-colors sm:px-7"
                >
                  {/* One shared layoutId, so the gold pill slides between tabs
                      instead of one fading out while another fades in. */}
                  {on && (
                    <motion.span
                      layoutId={`${tabId}-pill`}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[var(--color-gold)]"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="relative block">
                    <span className={`block text-[0.9375rem] font-semibold ${on ? 'text-[var(--color-on-gold)]' : 'text-[var(--color-ink)]'}`}>
                      {p.label}
                    </span>
                    <span className={`mt-0.5 block text-[0.75rem] ${on ? 'text-[var(--color-on-gold)]/75' : 'text-[var(--color-muted)]'}`}>
                      {p.caption}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div id={`${tabId}-panel`} role="tabpanel" aria-labelledby={`${tabId}-${active}`} className="mt-10">
          <Panel
            product={product}
            values={values[active]}
            onChange={(next) => setValues((v) => ({ ...v, [active]: next }))}
          />
        </div>
      </div>
    </section>
  )
}
