/* Inline SVG icon set (Lucide-derived geometry).
   Design system rule: never use emoji as icons.
   Decorative by default — aria-hidden + focusable=false. */
const base = {
  width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.75,
  strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': 'true', focusable: 'false',
}

export const Icon = ({ name, className = '', size = 24 }) => {
  const p = { ...base, width: size, height: size, className }
  switch (name) {
    case 'receipt': return <svg {...p}><path d="M4 2v20l2-1.5L8 22l2-1.5L12 22l2-1.5L16 22l2-1.5L20 22V2l-2 1.5L16 2l-2 1.5L12 2l-2 1.5L8 2 6 3.5 4 2Z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
    case 'clock': return <svg {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>
    case 'calendar': return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>
    case 'shield': return <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
    case 'lock': return <svg {...p}><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></svg>
    case 'bank': return <svg {...p}><path d="M3 10h18L12 3 3 10Z"/><path d="M5 10v9M10 10v9M14 10v9M19 10v9M3 21h18"/></svg>
    case 'eye': return <svg {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
    case 'arrow-right': return <svg {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    case 'check': return <svg {...p}><path d="m5 12 5 5L20 7"/></svg>
    case 'star': return <svg {...p} fill="currentColor" stroke="none"><path d="m12 2 2.9 6.1 6.6.9-4.8 4.7 1.2 6.6L12 17.2 6.1 20.3l1.2-6.6L2.5 9l6.6-.9L12 2Z"/></svg>
    case 'quote': return <svg {...p} fill="currentColor" stroke="none"><path d="M9 7c-2.8 0-5 2.2-5 5 0 2.5 1.8 4.5 4.2 4.9-.2 1.3-1 2.3-2.2 2.8l.7 1.3c2.6-.9 4.3-3.3 4.3-6.5V7H9Zm11 0c-2.8 0-5 2.2-5 5 0 2.5 1.8 4.5 4.2 4.9-.2 1.3-1 2.3-2.2 2.8l.7 1.3c2.6-.9 4.3-3.3 4.3-6.5V7h-2Z"/></svg>
    case 'phone': return <svg {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>
    case 'mail': return <svg {...p}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
    case 'pin': return <svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    case 'zap': return <svg {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>
    case 'rupee': return <svg {...p}><path d="M6 3h12M6 8h12m-12 5 8.5 8M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/></svg>
    case 'menu': return <svg {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    case 'close': return <svg {...p}><path d="M6 6l12 12M18 6 6 18"/></svg>
    case 'chevron-left': return <svg {...p}><path d="m15 6-6 6 6 6"/></svg>
    case 'chevron-right': return <svg {...p}><path d="m9 6 6 6-6 6"/></svg>
    case 'pause': return <svg {...p}><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
    case 'play': return <svg {...p}><path d="M7 4v16l13-8L7 4Z"/></svg>
    case 'apple': return <svg {...p} fill="currentColor" stroke="none"><path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7 2-1.1 2.8-2.2c.9-1.2 1.2-2.4 1.2-2.5 0 0-2.4-.9-2.4-3.7ZM14.2 5.9c.6-.8 1-1.9.9-3-.9 0-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3Z"/></svg>
    case 'google-play': return <svg {...p} fill="currentColor" stroke="none"><path d="M3.6 2.4c-.3.3-.5.8-.5 1.4v16.4c0 .6.2 1.1.5 1.4l.1.1 9.2-9.2v-.2L3.6 2.4Zm12.3 6.1L13 11.4v.2l2.9 2.9 3.5-2c1-.6 1-1.5 0-2.1l-3.5-1.9ZM3.7 21.7c.3.4.9.4 1.5.1l10.7-6.1-2.9-2.9-9.3 8.9Zm11.2-9.6L4.2 6c-.6-.3-1.2-.3-1.5.1l9.3 8.9 2.9-2.9Z"/></svg>
    case 'linkedin': return <svg {...p} fill="currentColor" stroke="none"><path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9.5h4V21H3V9.5Zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.5 4.7 5.8V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9.5Z"/></svg>
    case 'instagram': return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
    case 'x': return <svg {...p} fill="currentColor" stroke="none"><path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21H2.5l7-8L2.3 3h6.2l4.2 5.6L17.5 3Zm-1.1 16.1h1.7L7.7 4.8H5.9l10.5 14.3Z"/></svg>
    default: return null
  }
}
export default Icon
