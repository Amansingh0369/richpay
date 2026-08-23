# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** RichPay
**Generated:** 2026-08-23 18:39:06
**Category:** Banking/Traditional Finance
**Design Dials:** Variance 3/10 (Centered / Minimal) | Motion 3/10 (Subtle) | Density 4/10 (Standard)

---

## Global Rules

### Color Palette — OFFICIAL (Brand Identity Guidelines v1.0, slide 04)

| Role | Hex | CSS Variable | Notes |
|------|-----|--------------|-------|
| Deep Navy | `#071F3D` | `--color-navy` | Master brand. 16.50:1 on white |
| Royal Blue | `#0A2E5C` | `--color-royal` | Elevated navy surfaces. 13.48:1 on white |
| Gold | `#C69A45` | `--color-gold` | **Fill only on light.** Text OK on navy (6.37:1) |
| Light Gold | `#E6C27A` | `--color-gold-soft` | Text/detail on navy only. 9.72:1 |
| Gold Ink | `#8A6829` | `--color-gold-ink` | Derived. Gold *text* on light. 5.13:1 white / 4.68:1 grey |
| White | `#FFFFFF` | `--color-canvas` | |
| Charcoal | `#1F2328` | `--color-body` | Body copy. 15.80:1 |
| Light Grey | `#F1F5F9` | `--color-surface` | Alternating section bands |
| On Gold | `#071F3D` | `--color-on-gold` | Navy on gold. **Never white (2.59:1 FAIL)** |

**Official gradients:** Navy → Gold (primary) · Blue → Green (secondary/digital only)

#### Secondary digital palette — RESTRICTED
Instagram, campaign art, chart series and UI states only. Never site chrome, nav or primary CTAs.

| Role | Hex |
|------|-----|
| Blue | `#2563EB` |
| Sky Blue | `#38BDF8` |
| Green | `#16A34A` |
| Mint Green | `#22C55E` |

### Typography — OFFICIAL

- **Primary / headings:** **Poppins** (Bold / SemiBold / Medium / Regular / Light)
- **Secondary / body:** **Montserrat** (Bold / SemiBold / Medium / Regular / Light)
- Both are Google Fonts — no substitution needed.

> Supersedes the earlier "Aptos Display" note in the HD Brand Kit deck. The Brand
> Identity Guidelines v1.0 (May 2025) is the governing document.

### Brand Elements (slide 07)

Official graphic motifs, usable as decoration:
- **Growth bars** — ascending bar cluster (from the logo mark)
- **Gold arc / swoosh** — the bridge curve
- **Dot grid** and **line grid** patterns

### Brand Personality & Voice (slide 06)

Trustworthy · Supportive · Reliable · Progressive · Empathetic
**Tone:** Friendly, Professional, Confident, Reassuring
**Tagline:** "Nurturing Trust. Powering Growth."

### Photography Style (slide 08)

Real people, real stories, real support. Salaried professionals in authentic
office/home settings, handshakes, city skylines, families. Aspirational but believable.

### Logo Usage Rules (slide 19) — HARD CONSTRAINTS

- Clear space must be preserved; **minimum size 40px / 15mm**
- **Do not** change the logo colors
- **Do not** distort or stretch
- **Do not** rotate
- **Do not add shadows to the logo**
- Do not integrate the rupee symbol into the logo

### Contrast Rules (non-negotiable)

1. Gold `#C69A45` is **2.59:1 on white** — FAILS as text on light at any size.
   On light it is a *fill* (button, rule, bar, icon shape) with navy on top,
   or use Gold Ink `#8A6829` for gold-coloured text.
2. On navy, gold (6.37:1) and light gold (9.72:1) both pass for text.
3. Never white text on a gold fill.

### Theme Decision

**Light base with navy dark sections** — not a light/dark toggle. Navy hero →
light content bands → navy CTA + footer, per the approved mockup and the
"navy-led institutional finance confidence" direction.

---

#### Skill-generated typography (superseded — kept for reference)

### Typography

- **Heading Font:** IBM Plex Sans
- **Body Font:** IBM Plex Sans
- **Mood:** financial, trustworthy, professional, corporate, banking, serious
- **Google Fonts:** [IBM Plex Sans + IBM Plex Sans](https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

*Density: 4/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #A16207;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #0F172A;
  border: 2px solid #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #0F172A;
  outline: none;
  box-shadow: 0 0 0 3px #0F172A20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Minimalism & Swiss Style

**Keywords:** Clean, simple, spacious, functional, white space, high contrast, geometric, sans-serif, grid-based, essential

**Best For:** Enterprise apps, dashboards, documentation sites, SaaS platforms, professional tools

**Key Effects:** Subtle hover (200-250ms), smooth transitions, sharp shadows if any, clear type hierarchy, fast loading

### Page Pattern

**Pattern Name:** Trust & Authority + Conversion

- **Conversion Strategy:** Security badges. Case studies. Transparent pricing. Low-friction form. Provide pause/stop and stop the logo carousel on focus, hover, and reduced motion. Previous/next controls provide the keyboard equivalent; pause offscreen/hidden and render a static logo set under reduced motion.
- **CTA Placement:** Contact Sales / Get Quote (primary) + Nav
- **Section Order:** Hero (mission/credibility) > Proof (logos, certs, stats) > Solution overview > Clear CTA path

---

## Motion

**Scroll Reveal** (Subtle) — Trigger: scroll (viewport enter) | Duration: 300-400ms | Easing: `power1.out`

```js
gsap.from(el, { opacity: 0, y: 12, duration: 0.35, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' } });
```

**Framework notes:** Requires the ScrollTrigger plugin registered once via gsap.registerPlugin(ScrollTrigger); Use matchMedia('(prefers-reduced-motion: reduce)') to skip non-essential motion and render the final state immediately

- ✅ Keep the y offset small (8-16px) so it reads as a fade, not a slide
- ❌ Don't reveal below-the-fold content needed for SEO/crawlers as invisible-by-default without a no-JS fallback
- ⚡ toggleActions 'play none none reverse' avoids re-triggering on every scroll direction change

---

## Anti-Patterns (Do NOT Use)

- ❌ Playful design
- ❌ Poor security UX
- ❌ AI purple/pink gradients

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
