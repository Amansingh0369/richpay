import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { nav, portal } from '../data/content'
import SmartLink from './SmartLink'
import { motion, useReducedMotion } from './motion'
import { getLenis } from './SmoothScroll'
import logo from '../assets/logo-richpay-invert.png'

/* ============================================================================
   Header.

   Layout: logo hard left, actions hard right, nav optically centred. The bar
   runs wider than the 1200px page container so the logo and buttons sit near the
   viewport corners; the nav is absolutely centred rather than being the middle
   child of a flex row, because otherwise its position drifts with the width of
   the logo and the buttons either side of it.

   Apply and Repay are external links to the loan portal, so both open in a new
   tab and say so in their accessible name.

   The mobile menu is a full-screen translucent overlay. Three things it has to
   get right beyond looking correct:
   · Lenis has to be stopped, not just `body { overflow: hidden }` — Lenis runs
     its own wheel handling and would keep scrolling the page underneath.
   · Focus moves into the panel on open and returns to the toggle on close,
     otherwise a keyboard user is left tabbing through the page behind it.
   · The bars morph into an X rather than swapping icons, so the control reads
     as one object changing state.
   ========================================================================== */

const PORTAL_PROPS = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

const EASE = [0.22, 0.61, 0.36, 1]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const toggleRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Freeze the page behind the panel. Lenis owns the scroll when it is running,
     so overflow:hidden alone leaves the page scrolling under the overlay. */
  useEffect(() => {
    const lenis = getLenis()
    if (open) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    return () => { document.body.style.overflow = ''; getLenis()?.start() }
  }, [open])

  /* Move focus into the panel on open, hand it back to the toggle on close. */
  useEffect(() => {
    if (open) {
      const first = panelRef.current?.querySelector('a, button')
      first?.focus()
    } else if (document.activeElement === document.body) {
      toggleRef.current?.focus()
    }
  }, [open])

  // Escape closes the drawer
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? 'bg-[var(--color-navy)] shadow-[var(--shadow-lg)] border-b border-white/10'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="relative z-50 mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between gap-4 px-5 md:px-8 lg:px-12">
          {/* ---- Logo, hard left ---- */}
          <SmartLink to="#top" className="flex shrink-0 items-center" aria-label="RichPay Fincorp — home">
            <img src={logo} alt="RichPay Fincorp" className="h-11 w-auto md:h-12" />
          </SmartLink>

          {/* ---- Nav, optically centred in the viewport ---- */}
          <nav
            aria-label="Primary"
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex"
          >
            {nav.map((item) => (
              <SmartLink key={item.href} to={item.href} aria-label={item.aria} className="nav-link">
                {item.label}
              </SmartLink>
            ))}
          </nav>

          {/* ---- Actions, hard right ---- */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">
            <a
              href={portal.url}
              {...PORTAL_PROPS}
              aria-label={`${portal.repay} — opens the loan portal in a new tab`}
              className="btn btn-outline-invert !min-h-11 !px-5 !py-2.5 text-sm"
            >
              {portal.repay}
            </a>
            <a
              href={portal.url}
              {...PORTAL_PROPS}
              aria-label={`${portal.apply} — opens the loan portal in a new tab`}
              className="btn btn-gold !min-h-11 !px-5 !py-2.5 text-sm"
            >
              {portal.apply}
            </a>
          </div>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="-mr-2 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-[var(--radius-md)] text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {/* Two bars rotate into the X and the middle one fades, so the control
                reads as one object changing state rather than two swapped icons. */}
            <span aria-hidden="true" className="relative block h-4 w-6">
              {[
                { top: 0, openTo: { y: 7, rotate: 45 } },
                { top: 7, openTo: { opacity: 0 } },
                { top: 14, openTo: { y: -7, rotate: -45 } },
              ].map((bar, i) => (
                <motion.span
                  key={i}
                  className="absolute left-0 block h-0.5 w-6 rounded-full bg-current"
                  style={{ top: bar.top }}
                  animate={open ? bar.openTo : { y: 0, rotate: 0, opacity: 1 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
                />
              ))}
            </span>
          </button>
        </div>

      </header>

      {/* ---- Full-screen menu ---- */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            /* Rendered OUTSIDE <header> on purpose. This panel uses
               backdrop-filter, and backdrop-filter makes an element a
               containing block for its position:fixed descendants — nested in
               a header that also filtered, `inset-0` resolved against the 80px
               bar and the menu collapsed to an invisible sliver. The header is
               opaque now, but the placement stays deliberate. */
            className="fixed inset-0 z-40 bg-[var(--color-navy)]/70 backdrop-blur-2xl lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={reduce ? false : { opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            <nav
              aria-label="Mobile"
              className="flex h-full flex-col justify-center gap-1 overflow-y-auto px-6 pb-10 pt-24"
            >
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  animate={reduce ? false : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, ease: EASE, delay: reduce ? 0 : 0.08 + i * 0.055 }}
                >
                  <SmartLink
                    to={item.href}
                    aria-label={item.aria}
                    onClick={() => setOpen(false)}
                    className="block cursor-pointer py-2.5 font-display text-[clamp(1.75rem,8vw,2.5rem)] font-semibold leading-tight tracking-display text-white transition-colors hover:text-[var(--color-gold-soft)]"
                  >
                    {item.label}
                  </SmartLink>
                </motion.div>
              ))}

              <motion.div
                className="mt-10 flex flex-col gap-3"
                initial={reduce ? false : { opacity: 0, y: 22 }}
                animate={reduce ? false : { opacity: 1, y: 0 }}
                transition={{ duration: 0.42, ease: EASE, delay: reduce ? 0 : 0.08 + nav.length * 0.055 }}
              >
                <a
                  href={portal.url}
                  {...PORTAL_PROPS}
                  aria-label={`${portal.repay} — opens the loan portal in a new tab`}
                  className="btn btn-outline-invert w-full"
                >
                  {portal.repay}
                </a>
                <a
                  href={portal.url}
                  {...PORTAL_PROPS}
                  aria-label={`${portal.apply} — opens the loan portal in a new tab`}
                  className="btn btn-gold w-full"
                >
                  {portal.apply}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
