import { Link, useLocation, useNavigate } from 'react-router-dom'

/* ============================================================================
   The site mixes three kinds of link and they need different handling once
   routing is client-side:

   · in-page hash ('#calculator')  — a plain anchor while we're already on the
     landing page; from any other route it becomes a router Link to '/#calculator'
     so we navigate first and ScrollManager does the scrolling.
   · route ('/privacy-policy')   — a router Link, so no full page reload.
   · external / protocol         — plain anchor, untouched.
   · bare '#' placeholder        — stays inert; never rewritten to '/#'.
   ========================================================================== */

const EXTERNAL = /^(https?:|mailto:|tel:|\/\/)/i

export default function SmartLink({ to, children, onClick, ...rest }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (!to || to === '#') return <a href="#" onClick={onClick} {...rest}>{children}</a>
  if (EXTERNAL.test(to)) return <a href={to} onClick={onClick} {...rest}>{children}</a>

  if (to.startsWith('#')) {
    if (pathname !== '/') return <Link to={`/${to}`} onClick={onClick} {...rest}>{children}</Link>
    /* Already on the landing page. Let the router own the hash instead of the
       browser: with Lenis driving the scroll, a native anchor jump lands
       instantly and skips the smoothing entirely. Going through navigate()
       hands it to ScrollManager, which scrolls via Lenis. */
    return (
      <a
        href={to}
        onClick={(e) => {
          onClick?.(e)
          if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          navigate({ hash: to })
        }}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return <Link to={to} onClick={onClick} {...rest}>{children}</Link>
}
