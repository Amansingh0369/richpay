import { useEffect, useState } from 'react'
import { nav } from '../data/content'
import Icon from './Icons'
import SmartLink from './SmartLink'
import logo from '../assets/logo-richpay-invert.png'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Escape closes the drawer
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? 'bg-[var(--color-navy)]/88 backdrop-blur-xl shadow-[var(--shadow-lg)] border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-page flex items-center justify-between h-20 gap-4">
        <SmartLink to="#top" className="flex items-center shrink-0" aria-label="RichPay Fincorp — home">
          <img src={logo} alt="RichPay Fincorp" className="h-11 w-auto md:h-12" />
        </SmartLink>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              to={item.href}
              className="inline-flex items-center min-h-6 py-1 text-sm font-medium text-white/85 hover:text-[var(--color-gold-soft)] transition-colors duration-200 cursor-pointer"
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <SmartLink to="#login" className="btn btn-outline-invert !min-h-11 !py-2.5 !px-5 text-sm">Login</SmartLink>
          <SmartLink to="#apply" className="btn btn-gold !min-h-11 !py-2.5 !px-5 text-sm">Apply now</SmartLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="lg:hidden inline-flex items-center justify-center w-12 h-12 -mr-2 rounded-[var(--radius-md)] text-white cursor-pointer hover:bg-white/10 transition-colors"
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-white/10 bg-[var(--color-navy)]/97 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-6 flex flex-col gap-1">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              to={item.href}
              onClick={() => setOpen(false)}
              className="py-3.5 text-base font-medium text-white/90 hover:text-[var(--color-gold-soft)] border-b border-white/8 transition-colors cursor-pointer"
            >
              {item.label}
            </SmartLink>
          ))}
          <div className="flex flex-col gap-3 pt-5">
            <SmartLink to="#login" className="btn btn-outline-invert w-full">Login</SmartLink>
            <SmartLink to="#apply" className="btn btn-gold w-full">Apply now</SmartLink>
          </div>
        </nav>
      </div>
    </header>
  )
}
