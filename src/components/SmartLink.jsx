import { Link, useLocation } from 'react-router-dom'

/* ============================================================================
   The site mixes three kinds of link and they need different handling once
   routing is client-side:

   · in-page hash ('#products')  — a plain anchor while we're already on the
     landing page; from any other route it becomes a router Link to '/#products'
     so we navigate first and ScrollManager does the scrolling.
   · route ('/privacy-policy')   — a router Link, so no full page reload.
   · external / protocol         — plain anchor, untouched.
   · bare '#' placeholder        — stays inert; never rewritten to '/#'.
   ========================================================================== */

const EXTERNAL = /^(https?:|mailto:|tel:|\/\/)/i

export default function SmartLink({ to, children, ...rest }) {
  const { pathname } = useLocation()

  if (!to || to === '#') return <a href="#" {...rest}>{children}</a>
  if (EXTERNAL.test(to)) return <a href={to} {...rest}>{children}</a>

  if (to.startsWith('#')) {
    return pathname === '/'
      ? <a href={to} {...rest}>{children}</a>
      : <Link to={`/${to}`} {...rest}>{children}</Link>
  }

  return <Link to={to} {...rest}>{children}</Link>
}
