import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { mobile } from '../data/content'
import Icon from './Icons'
import { Reveal, Group, Item, motion, useReducedMotion } from './motion'

/* ============================================================================
   Mobile first — copy on the left, a working iOS device mock on the right.

   The frame is built to iPhone proportions rather than "a rounded rectangle":
   a titanium-ish bezel ring, a black cushion inside it, the screen inset from
   that, a Dynamic Island floating over the top of the content, a status bar
   with the canonical 9:41, and a home indicator at the foot. The nesting is
   what sells it — a single rounded div with a notch drawn on top always reads
   as a drawing of a phone rather than a phone.

   The screen is a fixed height because a real device is, so every sub-screen
   has to fit above the tab bar. That is measured, not eyeballed.

   ACCESSIBILITY: this used to be one aria-hidden picture. It now contains real
   buttons, so it cannot be hidden — a control a sighted user can operate and a
   keyboard user cannot reach is worse than a static image. Instead the device
   is a labelled group, every control is a real <button> with an explicit name,
   and a live region announces which example screen is showing. The decorative
   chrome (island, status bar, home indicator, pulsing dots) stays aria-hidden.
   Every figure inside is fictional and the group's label says so.

   The ambient loops are all transform/opacity and all off under
   prefers-reduced-motion.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1]
const { app } = mobile
const SC = app.screens

/* Device chrome and in-app glyphs. Local on purpose: they are parts of a mock,
   not part of the shared icon vocabulary the rest of the site uses. */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
const Bell = (p) => <svg viewBox="0 0 24 24" width="16" height="16" {...S} {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
const HomeI = (p) => <svg viewBox="0 0 24 24" width="19" height="19" {...S} {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5.5 9.5V21h13V9.5" /></svg>
const ChartI = (p) => <svg viewBox="0 0 24 24" width="19" height="19" {...S} {...p}><path d="M6 20V10M12 20V4M18 20v-6" /></svg>
const PersonI = (p) => <svg viewBox="0 0 24 24" width="19" height="19" {...S} {...p}><circle cx="12" cy="8" r="3.4" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>
const ChatI = (p) => <svg viewBox="0 0 24 24" width="17" height="17" {...S} {...p}><path d="M21 12a8 8 0 0 1-8 8H4l2-3.2A8 8 0 1 1 21 12Z" /></svg>
const BackI = () => <svg viewBox="0 0 24 24" width="18" height="18" {...S} aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
const Wifi = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M2 8.5a15 15 0 0 1 20 0" /><path d="M5.5 12.5a10 10 0 0 1 13 0" /><path d="M9 16.5a5 5 0 0 1 6 0" /><circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
  </svg>
)
const Battery = () => (
  <svg viewBox="0 0 28 13" width="25" height="12" aria-hidden="true">
    <rect x="0.6" y="0.6" width="23" height="11.8" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
    <rect x="2.2" y="2.2" width="16" height="8.6" rx="2.2" fill="currentColor" />
    <path d="M25.4 4.4v4.2a2.3 2.3 0 0 0 0-4.2Z" fill="currentColor" opacity="0.45" />
  </svg>
)
const SUPPORT_ICONS = { chat: ChatI }

/* The Google Play mark in its real four colours. Drawn here rather than fetched:
   an external asset would be a network request and a CSP surface for one 22px
   logo, and it would break the moment the host moved it. Apple's mark stays
   monochrome because that is how Apple's own guidelines specify it. */
const PlayStore = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="gp-body" x1="46" y1="30" x2="256" y2="240" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#00A0FF" /><stop offset=".26" stopColor="#00BEFF" />
        <stop offset=".51" stopColor="#00D2FF" /><stop offset="1" stopColor="#00E3FF" />
      </linearGradient>
      <linearGradient id="gp-wedge" x1="452" y1="259" x2="272" y2="259" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FFE000" /><stop offset=".41" stopColor="#FFBD00" />
        <stop offset=".78" stopColor="#FFA500" /><stop offset="1" stopColor="#FF9C00" />
      </linearGradient>
      <linearGradient id="gp-red" x1="378" y1="342" x2="48" y2="488" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#FF3A44" /><stop offset="1" stopColor="#C31162" />
      </linearGradient>
      <linearGradient id="gp-green" x1="48" y1="30" x2="378" y2="176" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#32A071" /><stop offset=".07" stopColor="#2DA771" />
        <stop offset=".48" stopColor="#15CF74" /><stop offset="1" stopColor="#00F076" />
      </linearGradient>
    </defs>
    <path fill="url(#gp-body)" d="M47.6 24.3C41.4 30.8 38 40.8 38 53.9v404.2c0 13.1 3.4 23.1 9.6 29.6l1.4 1.3 226.4-226.4v-5.3L49 30.9l-1.4-1.3z" />
    <path fill="url(#gp-wedge)" d="M350.7 337.3l-75.3-75.4v-5.3l75.4-75.4 1.7 1 89.3 50.7c25.5 14.5 25.5 38.2 0 52.7l-89.3 50.7-1.8 1z" />
    <path fill="url(#gp-red)" d="M352.4 336.3L275.4 259.3 47.6 487.1c8.4 8.9 22.3 10 38 1.1l266.8-151.9z" />
    <path fill="url(#gp-green)" d="M352.4 182.3L85.6 30.4c-15.7-8.9-29.6-7.8-38 1.1l227.8 227.8 77-77z" />
  </svg>
)

const TILE = 'rounded-[var(--radius-md)] bg-[var(--color-canvas)] ring-1 ring-inset ring-[var(--color-line)]'
const ROW = 'flex items-center justify-between gap-3 text-[0.8125rem]'

function ScreenHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onBack}
        className="-ml-1.5 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-body)] transition-colors hover:bg-[var(--color-canvas)]"
        aria-label="Back to the example home screen"
      >
        <BackI />
      </button>
      <h4 className="font-display text-[1.0625rem] font-semibold tracking-display text-[var(--color-ink)]">{title}</h4>
    </div>
  )
}

export default function MobileApp() {
  const reduce = useReducedMotion()
  const loop = (o) => (reduce ? undefined : o)
  const [screen, setScreen] = useState('home')

  const TABS = [
    { key: 'home', Ico: HomeI, label: 'Home' },
    { key: 'statement', Ico: ChartI, label: 'Statement' },
    { key: 'profile', Ico: PersonI, label: 'Profile' },
  ]
  const ACTION_TO_SCREEN = { 'Pay EMI': 'pay', Statement: 'statement', Support: 'support' }
  // A circle with a centred glyph, rather than a dot nudged into place with a
  // hard-coded top margin — that only ever looks right at one font size.
  const ACTION_GLYPH = {
    'Pay EMI': <Icon name="rupee" size={16} />,
    Statement: <Icon name="receipt" size={16} />,
    Support: <ChatI width="16" height="16" />,
  }
  const currentName = screen === 'home' ? 'Home' : SC[screen].title

  /* Slide direction: away from home goes forward, back to home goes back. */
  const slide = (dir) => ({
    initial: reduce ? false : { opacity: 0, x: dir * 26 },
    animate: reduce ? false : { opacity: 1, x: 0 },
    exit: reduce ? undefined : { opacity: 0, x: dir * -26 },
    transition: { duration: 0.32, ease: EASE },
  })

  return (
    <section id="mobile" className="section overflow-hidden bg-[var(--color-canvas)]">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">

          {/* ================= Copy ================= */}
          <div>
            <Reveal>
              <span className="eyebrow">{mobile.eyebrow}</span>
              <h2 className="mt-4 text-[clamp(2rem,1.5rem+2vw,3.125rem)] leading-[1.08]">{mobile.title}</h2>
              <p className="lead mt-5 max-w-lg">{mobile.sub}</p>
            </Reveal>

            <Group as="ul" className="mt-10 space-y-6" gap={0.09}>
              {mobile.features.map((f) => (
                <Item as="li" key={f.title} className="flex gap-3.5">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-ink)]">
                    <Icon name="check" size={14} />
                  </span>
                  <span>
                    <span className="block text-[1.0625rem] font-semibold text-[var(--color-ink)]">{f.title}</span>
                    <span className="mt-1 block text-[0.9375rem] leading-relaxed text-[var(--color-muted)]">{f.body}</span>
                  </span>
                </Item>
              ))}
            </Group>

            <Reveal className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                {[['apple', 'App Store'], ['play', 'Google Play']].map(([icon, label]) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-3 text-[var(--color-muted)]"
                  >
                    {icon === 'play' ? <PlayStore size={22} /> : <Icon name={icon} size={22} />}
                    <span className="text-left leading-tight">
                      <span className="block text-[0.6875rem] uppercase tracking-wider">{mobile.storeNote}</span>
                      <span className="block text-sm font-semibold text-[var(--color-ink)]">{label}</span>
                    </span>
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ================= Device ================= */}
          <Reveal delay={120} className="flex justify-center lg:justify-end">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(circle,rgba(198,154,69,0.20),transparent_68%)] blur-2xl"
              />

              <motion.div
                role="group"
                aria-label="Interactive example of the RichPay app. All figures shown are fictional."
                className="relative w-[300px]"
                animate={loop({ y: [0, -8, 0] })}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="sr-only" role="status">Example screen: {currentName}</p>

                <div className="rounded-[3.2rem] bg-[linear-gradient(155deg,#3a4450_0%,#12181f_38%,#0b0f14_62%,#39434f_100%)] p-[3px] shadow-[0_40px_90px_-20px_rgba(7,31,61,0.55),0_10px_30px_-10px_rgba(7,31,61,0.35)]">
                  <div className="rounded-[3.05rem] bg-black p-[9px]">
                    <div className="relative h-[624px] overflow-hidden rounded-[2.6rem] bg-[var(--color-surface)]">

                      <div aria-hidden="true" className="absolute left-1/2 top-[11px] z-30 h-[27px] w-[92px] -translate-x-1/2 rounded-full bg-black" />

                      <div aria-hidden="true" className="relative z-20 flex items-center justify-between px-7 pt-[15px] text-[var(--color-ink)]">
                        <span data-numeric className="text-[13px] font-semibold tracking-tight">9:41</span>
                        <span className="flex items-center gap-1.5"><Wifi /><Battery /></span>
                      </div>

                      {/* ---------- Screens ---------- */}
                      <div className="px-5 pt-5">
                        <AnimatePresence mode="wait" initial={false}>

                          {screen === 'home' && (
                            <motion.div key="home" {...slide(-1)}>
                              <div className="flex items-center justify-between">
                                <span className="font-display text-[1.0625rem] font-semibold tracking-display text-[var(--color-gold-ink)]">
                                  {app.brand}
                                </span>
                                <motion.span
                                  aria-hidden="true"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-canvas)] text-[var(--color-muted)] ring-1 ring-inset ring-[var(--color-line)]"
                                  animate={loop({ rotate: [0, 0, 14, -12, 9, -6, 0, 0] })}
                                  transition={{ duration: 5.5, repeat: Infinity, times: [0, 0.62, 0.68, 0.74, 0.8, 0.86, 0.92, 1], ease: 'easeInOut' }}
                                  style={{ transformOrigin: '50% 22%' }}
                                >
                                  <Bell />
                                </motion.span>
                              </div>

                              <p className="mt-2.5 text-[0.9375rem] text-[var(--color-body)]">{app.greeting}</p>

                              <div className="relative mt-3 overflow-hidden rounded-[var(--radius-lg)] bg-[linear-gradient(150deg,var(--color-gold-soft)_0%,var(--color-gold)_100%)] p-4 text-[var(--color-on-gold)]">
                                <motion.span
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)]"
                                  initial={{ x: '-140%' }}
                                  animate={loop({ x: ['-140%', '420%'] })}
                                  transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.6, ease: 'easeInOut' }}
                                />
                                <p className="relative text-[0.625rem] font-semibold uppercase tracking-[0.14em] opacity-80">{app.loanLabel}</p>
                                <p data-numeric className="relative mt-1.5 font-display text-[1.75rem] font-semibold leading-none tracking-display">{app.amount}</p>
                                <p data-numeric className="relative mt-2 text-[0.8125rem] opacity-85">{app.emiLabel}: {app.emi}</p>

                                <div className="relative mt-4">
                                  <div className="flex items-center justify-between text-[0.75rem]">
                                    <span className="opacity-85">{app.repaidLabel}</span>
                                    <span data-numeric className="font-semibold">{app.repaidPct}%</span>
                                  </div>
                                  <div className="mt-1.5 h-[7px] w-full overflow-hidden rounded-full bg-[var(--color-on-gold)]/20">
                                    {/* Fills to its real value once. It never
                                        re-fills — that would animate a number
                                        that is not actually changing. */}
                                    <motion.span
                                      className="relative block h-full rounded-full bg-[var(--color-on-gold)]"
                                      initial={reduce ? false : { width: 0 }}
                                      animate={reduce ? false : { width: `${app.repaidPct}%` }}
                                      transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
                                      style={reduce ? { width: `${app.repaidPct}%` } : undefined}
                                    >
                                      <motion.span
                                        aria-hidden="true"
                                        className="absolute inset-y-0 -left-1/2 w-1/2 rounded-full bg-white/45"
                                        animate={loop({ x: ['0%', '400%'] })}
                                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
                                      />
                                    </motion.span>
                                  </div>
                                </div>
                              </div>

                              {/* Quick actions — real buttons. */}
                              <div className="mt-3 grid grid-cols-3 gap-2.5">
                                {app.actions.map((a, i) => (
                                  <button
                                    key={a}
                                    type="button"
                                    onClick={() => setScreen(ACTION_TO_SCREEN[a])}
                                    aria-label={`Open the example ${a} screen`}
                                    className={`${TILE} cursor-pointer px-2 py-2 text-center transition-colors hover:bg-[var(--color-gold)]/10`}
                                  >
                                    <motion.span
                                      aria-hidden="true"
                                      className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-ink)]"
                                      animate={loop({ scale: [1, 1.12, 1] })}
                                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.55 }}
                                    >
                                      {ACTION_GLYPH[a]}
                                    </motion.span>
                                    <span className="mt-1.5 block text-[0.6875rem] font-medium text-[var(--color-body)]">{a}</span>
                                  </button>
                                ))}
                              </div>

                              <p className="mt-3 text-[0.8125rem] font-semibold text-[var(--color-ink)]">{app.activityTitle}</p>
                              <ul className="mt-2 space-y-2">
                                {app.activity.map((row, i) => (
                                  <li key={row.title} className={`${TILE} relative overflow-hidden px-3.5 py-2`}>
                                    <motion.span
                                      aria-hidden="true"
                                      className="pointer-events-none absolute inset-0 bg-[var(--color-gold)]/12"
                                      initial={{ opacity: 0 }}
                                      animate={loop({ opacity: [0, 1, 0] })}
                                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut', delay: i * 0.5 }}
                                    />
                                    <span className={`relative ${ROW}`}>
                                      <span className="min-w-0">
                                        <span className="block truncate text-[0.8125rem] font-medium text-[var(--color-ink)]">{row.title}</span>
                                        <span data-numeric className="block text-[0.6875rem] text-[var(--color-muted)]">{row.date}</span>
                                      </span>
                                      <span data-numeric className={`shrink-0 font-semibold ${row.kind === 'in' ? 'text-[var(--color-gold-ink)]' : 'text-[var(--color-navy)]'}`}>
                                        {row.amount}
                                      </span>
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          {screen === 'pay' && (
                            <motion.div key="pay" {...slide(1)}>
                              <ScreenHeader title={SC.pay.title} onBack={() => setScreen('home')} />
                              <div className="mt-4 rounded-[var(--radius-lg)] bg-[linear-gradient(150deg,var(--color-gold-soft)_0%,var(--color-gold)_100%)] p-4 text-[var(--color-on-gold)]">
                                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] opacity-80">{SC.pay.headline}</p>
                                <p data-numeric className="mt-1.5 font-display text-[1.75rem] font-semibold leading-none tracking-display">{SC.pay.amount}</p>
                                <p data-numeric className="mt-2 text-[0.8125rem] opacity-85">{SC.pay.due}</p>
                              </div>
                              <ul className="mt-3 space-y-2">
                                {SC.pay.rows.map(([k, v]) => (
                                  <li key={k} className={`${TILE} ${ROW} px-3.5 py-2`}>
                                    <span className="text-[var(--color-muted)]">{k}</span>
                                    <span data-numeric className="font-semibold text-[var(--color-ink)]">{v}</span>
                                  </li>
                                ))}
                              </ul>
                              <p className="mt-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{SC.pay.methodLabel}</p>
                              <div className={`${TILE} ${ROW} mt-2 px-3.5 py-2`}>
                                <span data-numeric className="text-[var(--color-ink)]">{SC.pay.method}</span>
                                <span className="text-[var(--color-gold-ink)]"><Icon name="check" size={15} /></span>
                              </div>
                              {/* Deliberately NOT a button: nothing here takes a
                                  payment, and a control that looks live but is
                                  inert is a worse lie than a label. */}
                              <span className="mt-4 block rounded-[var(--radius-md)] bg-[var(--color-navy)]/8 py-3 text-center text-[0.875rem] font-semibold text-[var(--color-navy)]">
                                {SC.pay.cta}
                              </span>
                              <p className="mt-2.5 text-center text-[0.6875rem] text-[var(--color-muted)]">{SC.pay.note}</p>
                            </motion.div>
                          )}

                          {screen === 'statement' && (
                            <motion.div key="statement" {...slide(1)}>
                              <ScreenHeader title={SC.statement.title} onBack={() => setScreen('home')} />
                              <span data-numeric className="mt-4 inline-flex rounded-full bg-[var(--color-gold)]/15 px-3 py-1 text-[0.75rem] font-semibold text-[var(--color-gold-ink)]">
                                {SC.statement.period}
                              </span>
                              <ul className="mt-3 space-y-2">
                                {SC.statement.rows.map(([date, title, amount]) => (
                                  <li key={date + title} className={`${TILE} ${ROW} px-3.5 py-2`}>
                                    <span className="min-w-0">
                                      <span className="block truncate font-medium text-[var(--color-ink)]">{title}</span>
                                      <span data-numeric className="block text-[0.6875rem] text-[var(--color-muted)]">{date}</span>
                                    </span>
                                    <span data-numeric className={`shrink-0 font-semibold ${amount.startsWith('+') ? 'text-[var(--color-gold-ink)]' : 'text-[var(--color-navy)]'}`}>
                                      {amount}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <dl className="mt-3 space-y-2">
                                {SC.statement.summary.map(([k, v]) => (
                                  <div key={k} className={`${ROW} px-1`}>
                                    <dt className="text-[var(--color-muted)]">{k}</dt>
                                    <dd data-numeric className="font-semibold text-[var(--color-ink)]">{v}</dd>
                                  </div>
                                ))}
                              </dl>
                            </motion.div>
                          )}

                          {screen === 'support' && (
                            <motion.div key="support" {...slide(1)}>
                              <ScreenHeader title={SC.support.title} onBack={() => setScreen('home')} />
                              <ul className="mt-4 space-y-2.5">
                                {SC.support.options.map((o) => {
                                  const Glyph = SUPPORT_ICONS[o.icon]
                                  return (
                                    <li key={o.title} className={`${TILE} flex items-center gap-3 px-3.5 py-3`}>
                                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-ink)]">
                                        {Glyph ? <Glyph /> : <Icon name={o.icon} size={17} />}
                                      </span>
                                      <span className="min-w-0">
                                        <span className="block truncate text-[0.8125rem] font-semibold text-[var(--color-ink)]">{o.title}</span>
                                        <span className="block truncate text-[0.6875rem] text-[var(--color-muted)]">{o.body}</span>
                                      </span>
                                    </li>
                                  )
                                })}
                              </ul>
                              <p className="mt-4 text-[0.6875rem] leading-relaxed text-[var(--color-muted)]">{SC.support.note}</p>
                            </motion.div>
                          )}

                          {screen === 'profile' && (
                            <motion.div key="profile" {...slide(1)}>
                              <ScreenHeader title={SC.profile.title} onBack={() => setScreen('home')} />
                              <div className="mt-4 flex items-center gap-3.5">
                                <span aria-hidden="true" className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-navy)] font-semibold text-[var(--color-gold-soft)]">
                                  {SC.profile.initials}
                                </span>
                                <span>
                                  <span className="block text-[1rem] font-semibold text-[var(--color-ink)]">{SC.profile.name}</span>
                                  <span className="block text-[0.75rem] text-[var(--color-muted)]">{SC.profile.member}</span>
                                </span>
                              </div>
                              <ul className="mt-4 space-y-2">
                                {SC.profile.rows.map(([k, v]) => (
                                  <li key={k} className={`${TILE} ${ROW} px-3.5 py-2`}>
                                    <span className="text-[var(--color-muted)]">{k}</span>
                                    <span data-numeric className="font-semibold text-[var(--color-ink)]">{v}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* ---------- Tab bar ---------- */}
                      <div className="absolute inset-x-0 bottom-0 border-t border-[var(--color-line)] bg-[var(--color-surface)]/95 pb-1.5 pt-2.5 backdrop-blur">
                        <div className="flex items-center justify-around px-10">
                          {TABS.map(({ key, Ico, label }) => {
                            const active = screen === key
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setScreen(key)}
                                aria-label={`Open the example ${label} screen`}
                                aria-current={active ? 'true' : undefined}
                                className={`cursor-pointer rounded-full p-1.5 transition-colors ${
                                  active ? 'text-[var(--color-gold-ink)]' : 'text-[var(--color-muted)]/70 hover:text-[var(--color-body)]'
                                }`}
                              >
                                <Ico />
                              </button>
                            )
                          })}
                        </div>
                        <span aria-hidden="true" className="mx-auto mt-1.5 block h-[5px] w-[110px] rounded-full bg-[var(--color-ink)]/25" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
