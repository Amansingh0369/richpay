# Next-session prompt — RichPay UI pass with 21st.dev

Project: /Users/amansingh/Desktop/freelance/richpay
React 19 + Vite 7 + Tailwind v4 + Motion (Framer Motion). `npm run dev` -> :5173

## Your task

Use the **21st.dev MCP** to upgrade exactly two sections, then re-skin them to our
design tokens:

1. **Hero** (`src/components/Hero.jsx`) — 1 component retrieval
2. **Why RichPay** (`src/components/Why.jsx`) — 1 component retrieval

That is the whole budget: the account is **free tier, 2 `get` retrievals per day**.
`search` is free and unlimited — search widely, retrieve only twice. If you burn a
retrieval on the wrong component you are done for the day, so search and compare
metadata first.

## Read these before touching any UI

1. `.claude/skills/ui-ux-pro-max/SKILL.md` — all design decisions go through this skill
2. `design-system/richpay/MASTER.md` — global source of truth (hand-reconciled
   against the client's official Brand Identity Guidelines v1.0)
3. `design-system/richpay/pages/landing.md` — page overrides; these win over MASTER
4. `README.md` — how the token system works
5. `brand/CONTENT-SPEC.md` — all approved copy

## Non-negotiable: the gold contrast contract

Brand gold `#C69A45` is **2.59:1 on white — it FAILS WCAG as text on light at any size.**

- On light, gold is a **fill** with **navy text** on top (`--color-on-gold`, 6.37:1)
- Gold-coloured **text** on light must use `--color-gold-ink` `#8A6829` (5.13:1)
- On navy, `--color-gold` (6.37:1) and `--color-gold-soft` (9.72:1) are safe for text
- **Never** white text on a gold fill

Verify any new color pairing before shipping it. Do not let a 21st component
introduce its own palette.

## Non-negotiable: re-skin, never paste

21st components ship with their own Tailwind colors, fonts and often shadcn deps.
**Do not paste them in as-is.** Take the structure, layout and interaction ideas,
then rebuild using:

- Tokens from `src/styles/tokens.css` (the ONLY place colors/fonts/spacing live)
- Component classes from `src/styles/global.css` (`.btn`, `.btn-gold`, `.card-lift`,
  `.glass`, `.surface-navy`, `.pill`, `.slider`)
- Motion primitives from `src/components/motion.jsx`
  (`Reveal`, `Group`/`Item`, `WordsUp`, `CountUp`, `Parallax`, `Tilt`, `Float`)
- Official fonts: **Poppins** (display) + **Montserrat** (body). Nothing else.
- Copy from `src/data/content.js` — never hardcode text in components

If a component needs a dependency we don't have, prefer reimplementing over installing.

## 21st.dev access

Configured already:
- `.mcp.json` — remote HTTP server `https://21st.dev/api/mcp`, header
  `x-api-key: ${API_KEY_21ST}` (no secret in this file, safe to commit)
- `.claude/settings.local.json` — holds `API_KEY_21ST`, chmod 600, gitignored

**The MCP tools only load at session start.** If they aren't in your tool list,
use the CLI, which works with the same key:

```bash
export API_KEY_21ST=$(python3 -c "import json;print(json.load(open('.claude/settings.local.json'))['env']['API_KEY_21ST'])")
npx -y @21st-dev/cli@latest usage                       # check remaining quota FIRST
npx -y @21st-dev/cli@latest search "<query>" --limit 8 --json
npx -y @21st-dev/cli@latest get <id> --json             # COSTS 1 of 2 per day
```

Useful starting points already found: hero ids `19056` (Financial Hero Section),
`8763`, `1828`.

## Verify before you claim done

Chrome headless is at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`.

- **Horizontal overflow must be 0** at 375 / 390 / 768 / 1024 / 1440.
  Measure via CDP with real device emulation — a plain `--window-size` headless
  screenshot lays out at ~980px CSS and will lie to you at mobile widths.
- **Screenshots:** `Page.captureScreenshot` over CDP **stalls on `backdrop-filter`**.
  Either inject `*{backdrop-filter:none!important}` before capturing, or use the
  CLI `--screenshot` flag with `--force-prefers-reduced-motion`.
- **Counters:** every `[data-numeric]` node must render its real value. The
  production site ships a bug where Trust shows `0+ / ₹0Cr+ / 0.0★ / <0 min`
  because its count-up never initialises. `CountUp` in this repo is hardened
  (renders the final value by default, hard settle timer) — **do not regress it.**
- **Reduced motion:** every motion primitive must collapse to its final state.
- `npm run build` must pass.

## Do not touch without asking

- **"Our Journey" is intentionally disabled** (`SHOW_JOURNEY = false` in
  `src/data/content.js`). The client's source doc contradicts itself: About says
  the RichPay retail brand launched June 2026; Journey says founded 2021 / 500 loans
  2022 / 34,000+ borrowers 2024. The source doc itself warns against publishing both.
  Leave it off until the client confirms real dates.
- **Support email is a placeholder** — the source PDF redacts it as
  `[email protected]`. Needs client confirmation.
- **Logo rules (Brand Guidelines slide 19):** never recolour, distort, rotate, or
  **add shadows** to the logo; preserve clear space; minimum size 40px. The
  `*-invert.png` variants exist for dark backgrounds — use those on navy.

## Known gap worth raising

There is **no licensed hero photograph**. The brand kit ships only small composited
crops. The live site (richpayfincorp.com) uses a photographic hero; ours uses brand
motifs instead. If the client supplies an image matching the guidelines' photography
direction (real salaried professionals, authentic settings), wire it into the hero's
decorative layer. Also note the live site uses a **green** accent, which contradicts
the navy+gold brand book — brand book governs unless the client says otherwise.
