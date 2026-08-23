import { footer, company, social } from '../data/content'
import Icon from './Icons'
import SmartLink from './SmartLink'
import logo from '../assets/logo-richpay-invert.png'

export default function Footer() {
  return (
    <footer id="contact" className="surface-navy-soft relative border-t border-white/10">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'var(--gradient-gold-line)' }} />
      <div className="container-page py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)]">
          {/* ---- Brand + contact ---- */}
          <div>
            <img src={logo} alt="RichPay Fincorp" className="h-12 w-auto" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Bridging the gap between paychecks with quick, transparent and trusted credit.
            </p>

            <address className="mt-7 space-y-3.5 not-italic">
              <a href={company.phoneHref} className="flex items-start gap-3 min-h-6 py-1 text-sm text-white/75 hover:text-[var(--color-gold-soft)] transition-colors cursor-pointer">
                <span className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]"><Icon name="phone" size={17} /></span>
                <span data-numeric>{company.phone}</span>
              </a>
              <a href={`mailto:${company.email}`} className="flex items-start gap-3 min-h-6 py-1 text-sm text-white/75 hover:text-[var(--color-gold-soft)] transition-colors cursor-pointer break-all">
                <span className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]"><Icon name="mail" size={17} /></span>
                {company.email}
              </a>
              <p className="flex items-start gap-3 text-sm text-white/75">
                <span className="mt-0.5 shrink-0 text-[var(--color-gold-soft)]"><Icon name="pin" size={17} /></span>
                {company.address}
              </p>
            </address>

            <ul className="mt-7 flex gap-3">
              {social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    aria-label={`${s.name} — opens in a new tab`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-white/12 text-white/75 hover:text-[var(--color-gold-soft)] hover:border-[var(--color-gold)] transition-colors cursor-pointer"
                  >
                    <Icon name={s.icon} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ---- Link columns ---- */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-soft)]">{col.title}</h2>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <SmartLink
                        to={l.href}
                        className="inline-flex items-center min-h-6 py-1 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        {l.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-white/50">{footer.disclaimer}</p>
          <p className="mt-4 text-xs text-white/50">
            © {new Date().getFullYear()} {company.name} — formerly {company.formerName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
