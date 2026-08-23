# RichPay Fincorp — Marketing Site

React + Vite + Tailwind v4 + Motion (Framer Motion). Landing page for RichPay
Fincorp Private Limited, an RBI-registered NBFC-ICC.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Changing the design — read this first

Everything visual is driven from **one file**:

### `src/styles/tokens.css`
The single source of truth. Colors, fonts, type scale, spacing, radii, shadows,
gradients and motion timings all live here as CSS variables inside Tailwind's
`@theme` block. Change a value here and it propagates everywhere — no component
edits needed. Tailwind auto-generates utilities from these (`--color-navy`
becomes `bg-navy`, `text-navy`, `border-navy`, …).

### `src/styles/global.css`
Base element styles plus reusable component classes (`.btn`, `.card-lift`,
`.glass`, `.surface-navy`, `.pill`, `.slider`) — all built only from tokens.

### `src/data/content.js`
Every piece of copy on the page. Edit text here, not in components.

## The gold contrast rule — do not break this

Brand gold `#C69A45` is **2.59:1 on white**. It fails WCAG as text on light
backgrounds at any size. The tokens encode the safe usage:

| Need | Token | Ratio |
|---|---|---|
| Gold as a button/fill on light | `--color-gold` + `--color-on-gold` (navy text) | 6.37:1 ✓ |
| Gold-coloured **text** on light | `--color-gold-ink` `#8A6829` | 5.13:1 ✓ |
| Gold text on navy | `--color-gold` / `--color-gold-soft` | 6.37:1 / 9.72:1 ✓ |
| ❌ White text on gold | — | 2.59:1 ✗ never |

The brand guidelines independently say "keep gold limited and premium."

## Design system

Generated and maintained with the `ui-ux-pro-max` skill.

- `design-system/richpay/MASTER.md` — global source of truth
- `design-system/richpay/pages/landing.md` — page-level overrides (read first,
  fall back to MASTER)

Regenerate or add a page override:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<query>" \
  --design-system --persist -p "RichPay" \
  --output-dir "$(pwd)" --page "<page-name>"
```

Note: `--persist` skips existing files. MASTER.md has been hand-reconciled
against the official brand guidelines — use `--force` only deliberately.

## Brand assets

`brand/` holds the client's source material and the extracted spec:

- `brand/CONTENT-SPEC.md` — full page copy, extracted from the client PDF
- `brand/source/` — original brand kit (.pptx) and content deck (.pdf)
- `brand/logo/` — logo lockups. `*-invert.png` variants are recoloured for dark
  backgrounds (navy → white, gold preserved); the header, hero and footer use them.
- `brand/reference/approved-landing-mockup.png` — the approved visual direction

**Logo rules from the guidelines (slide 19):** do not recolour, distort, rotate,
or add shadows; preserve clear space; minimum size 40px.

## Motion

`src/components/motion.jsx` holds the primitives: `Reveal`, `Group`/`Item`
(staggered), `WordsUp` (headline reveal), `CountUp`, `Parallax`, `Tilt`, `Float`.

Two rules they all follow:

1. **Every primitive collapses to its final state under
   `prefers-reduced-motion`.** Required by the design system.
2. **`CountUp` renders the real number by default** and only drops to zero once
   it has committed to animating, with a hard settle timer as a backstop. A
   stalled tween can therefore never leave "0+" on screen — which is the bug
   currently visible in the Trust section of the production site.

## Known gaps

- **"Our Journey" is disabled** (`SHOW_JOURNEY = false` in `src/data/content.js`).
  The client's source document contradicts itself: the About section says the
  RichPay retail brand launched June 2026, while the Journey section says founded
  2021 / 500 loans 2022 / 34,000+ borrowers 2024. The source document itself warns
  against publishing both. Needs a client answer, then flip the flag.
- **Support email is a placeholder** — the source PDF redacts it as
  `[email protected]`. Confirm before launch (`src/data/content.js`).
- **No hero photograph.** The brand kit ships only small composited crops, not a
  licensed high-resolution image. The hero currently uses the official brand
  motifs (navy→gold gradient, dot grid, bridge arc, growth-bar mark). To match the
  production site's photographic hero, supply a licensed image matching the
  guidelines' photography direction (real salaried professionals, authentic
  settings) and drop it into the hero's decorative layer.
