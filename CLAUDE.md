# Bejoice Premium — Claude Context

## Project
- **Stack:** React 18 + Vite + GSAP + ScrollTrigger + Lenis + Tailwind CSS 3
- **Dev server:** `npm run dev` → http://localhost:5173
- **Image processing:** `sharp` installed as devDependency — use for PNG bg removal & recoloring

## Architecture
- `src/App.jsx` — page composition, section order
- `src/components/VideoHero.jsx` — scrollytelling hero with JPEG frame scrubbing; chapters defined in `CHAPTERS` array at top of file
- `src/index.css` — all global CSS classes (section-headline, body-text, card-body, shine-text, btn-gold, etc.)
- `public/` — static assets (logo PNGs, frames)

## Section Order (App.jsx)
VideoHero → StatsBar → OceanFreight → Services → HeavyLift → HeavyCargo → WhyBejoice → KeyMarkets → Certifications → Testimonials → Contact → Footer

## Key Patterns

### Hero Chapters
Edit `CHAPTERS` array in `VideoHero.jsx` — each chapter: `{ range, eyebrow, headline: ['LINE1','LINE2'], sub, showCta?, showStats? }`

### Typography Classes
- `.section-headline` — Bebas Neue `clamp(2.8rem,7vw,6.5rem)`, use on all section h2s
- `.accent` — gold `#c8a84e`, used inside `.section-headline`
- `.body-text` — DM Sans `500` weight, `rgba(255,255,255,0.92)`
- `.card-body` — DM Sans `15px`, `500` weight, `rgba(255,255,255,0.88)`
- `.shine-text` / `.shine-gold` — sweeping shine via `::after` + `content: attr(data-text)` + `background-clip: text`; always add `data-text={value}` attribute

### Shine Effect Rules
- Apply `.shine-text` to a `<span>` wrapping text, NOT to block elements (h1/h2/div)
- Always pass `data-text={text}` on the span — the `::after` uses `content: attr(data-text)`
- White text → `.shine-text`, Gold text → `.shine-text.shine-gold`
- Do NOT use `background-clip: text` on the main element — it removes original color

### Logo
- `public/bejoice-wings-navy.png` — transparent bg, navy blue wings, 1200px wide (processed via sharp)
- `public/bejoice-wings-transparent.png` — original color transparent version
- Logo recoloring: flood-fill white bg removal + pixel recolor loop using `sharp` raw buffer

### Pointer Events
- Hero chapter overlays have `pointerEvents: 'none'` — interactive children need `pointerEvents: 'all'` explicitly

### Fonts
- Headings: `'Bebas Neue', sans-serif`
- Body/UI: `'DM Sans', sans-serif`
- Brand gold: `#c8a84e`, bright gold: `#ffe680`, dark bg: `#050508`

### Image Background Removal (sharp)
```js
// Flood-fill from edges + feather edges
sharp('input.png').resize(w, h, { kernel: sharp.kernel.lanczos3 }).ensureAlpha().raw()...
// Threshold: r > 200 && g > 200 && b > 200 = background
// Feather: whiteness > 185 → alpha = (1 - (whiteness-185)/70) * 255
```

### Hero First Screen Layout
- TrackCard + stats card live inside `VideoHero.jsx` as inline components (not separate files)
- TrackCard is defined as `function TrackCard()` above `VideoHero` in the same file
- Layout: CTA buttons → two-col row (TrackCard left, stats right), centered with `justifyContent: 'center'`, `alignItems: 'stretch'`
- Both cards share identical glassmorphism style: `rgba(10,10,20,0.55)`, `blur(18px)`, `borderRadius: 1.2rem`, gold border `rgba(200,168,78,0.18)`
- Stats card uses `flexWrap: 'nowrap'` to keep all 5 stats on one line
- TrackCard width capped at `maxWidth: 420px` to match hero subheading width

### Bejoice-scroll relationship
- Do NOT modify `C:/Users/ASUS/Desktop/Interactive Websit for Bejoice/bejoice-scroll/` unless user explicitly asks
- The two projects are separate — style changes to premium do not automatically apply to bejoice-scroll

## Gotchas
- `pointerEvents: 'none'` on chapter overlays blocks all mouse events — override on interactive children
- Apostrophes in JS single-quoted strings break JSX — use double quotes for strings containing `'`
- Bebas Neue doesn't respond to `font-weight` — don't set it to change appearance
- `display: inline-block` on `section-headline` h2 breaks full-width layout — keep as block
- `background-clip: text` + `-webkit-text-fill-color: transparent` overrides inline `color` — ruins original text color; use `::after` overlay approach instead
- Lenis smooth scroll: always use `window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 })` for nav links
- `CountUp` component: non-numeric values (e.g. 'FIATA', '24/7') are displayed immediately without animation
