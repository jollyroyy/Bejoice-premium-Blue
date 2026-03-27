# Bejoice Premium — Claude Context

## 🎨 STANDING RULE — USE FRONTEND-DESIGN SKILL
**Always consult the `frontend-design` skill for any UI/styling work — new components, layout changes, visual improvements, or design decisions — without being asked.**
- Invoke via `Skill tool: frontend-design` before writing any significant UI code
- The skill ensures distinctive, non-generic aesthetics aligned with the Bejoice premium brand

## 🔴 STANDING RULE — MOBILE-FIRST ALWAYS
**Every single change — new component, style tweak, layout fix, or feature — MUST be mobile-optimized without being asked.**
- Test mentally at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad) before finalising
- Never use fixed `px` widths without a `min()` or `clamp()` guard
- Use `100svh` (with `100vh` fallback) for full-viewport sticky containers
- All tap targets ≥ 44px; input `font-size ≥ 16px` (prevents iOS zoom)
- Overlapping / z-index issues MUST be caught and fixed in the same change
- If a component is hidden on mobile to save space, ensure it is accessible via another path (e.g. hamburger drawer)
- Floating elements (chatbot, FABs) must not block primary content on any screen size

## About Bejoice
- **Company:** Bejoice Group — Saudi Arabia's premier freight forwarding & logistics company
- **Founded:** 2006, Riyadh, KSA
- **Tagline:** "Connecting KSA to the World"
- **Services:** Ocean Freight, Air Freight, Road Transport, Heavy Lift & Project Cargo, Customs Clearance, Warehousing
- **Coverage:** 180+ countries, 25+ years experience, 1500+ heavy lift operations
- **Certifications:** ZATCA, ISO 9001, FIATA, IATA, AEO, SASO
- **Contact:** info@bejoice.com | quotes@bejoice.com | +966 11 XXX XXXX
- **HQ:** King Fahd Road, Al Olaya, Riyadh 11553, Saudi Arabia
- **Cal booking link:** `sudeshna-pal-ruww5f/freight-consultation`

## Project
- **Stack:** React 18 + Vite + GSAP + ScrollTrigger + Lenis + Tailwind CSS 3
- **Dev server:** `npm run dev` → http://localhost:5173
- **GitHub:** https://github.com/jollyroyy/Bejoice-premium
- **Netlify site ID:** `0e479bcc-353e-41bb-bfbd-68ee51a97096` (site: bejoice-premium.netlify.app)
- **Image processing:** `sharp` installed as devDependency — use for PNG bg removal & recoloring
- **Build:** `npm run build` → outputs to `dist/`
- **Deploy:** `npx netlify-cli deploy --prod --dir=dist --site=0e479bcc-353e-41bb-bfbd-68ee51a97096`

## Architecture
- `src/App.jsx` — page composition, section order, Lenis init, scroll-to-top on load
- `src/components/VideoHero.jsx` — scrollytelling hero with globe video bg + JPEG frame scrubbing; chapters defined in `CHAPTERS` array at top of file; TrackCard + CountUp defined inline
- `src/components/FloatingBookCTA.jsx` — Layla AI chatbot (bottom-right corner)
- `src/components/Nav.jsx` — fixed nav with logo, tagline, Book a Call CTA, animated hamburger menu
- `src/index.css` — ALL global CSS classes (section-headline, body-text, card-body, shine-text, shine-gold, shine-ltr, btn-gold, hamburger-btn, etc.)
- `public/` — static assets (logo PNGs, frames, videos)
- `public/bejoice-logo-white.png` — main logo used in Nav (white wings, transparent bg, 1509×839px)
- `public/ai-assistant-female.png` — Layla avatar image
- `public/saudi-connected.mp4` — globe video (intro, slides up at GLOBE_EXIT=0.22)
- `public/frames2/` — 289 JPEGs: ocean/ship footage (videoP 0.00–0.39)
- `public/frames3/` — 169 JPEGs: air freight/plane footage (videoP 0.39–0.62)
- `public/frames4/` — 32 JPEGs: Saudi team discussion/approval (videoP 0.62–0.70)
- `public/frames5/` — 121 JPEGs: air cargo packing (videoP 0.70–0.84)
- `public/frames6/` — 121 JPEGs: road/project cargo (videoP 0.84–1.00)

## Section Order (App.jsx)
VideoHero → OceanFreight → Services → HeavyLift → HeavyCargo → WhyBejoice → KeyMarkets → Certifications → Testimonials → Contact → Footer

> StatsBar removed. QuickQuoteSection removed from page bottom — only accessible via modal.
> QuickQuoteModal opens via `onQuoteClick` prop on VideoHero hero CTA button.

## Brand Identity & Guardrails
- **DO NOT** change brand colors without explicit instruction
- **DO NOT** alter company facts (years, certifications, country count)
- **DO NOT** modify the Bejoice logo image files
- **Brand gold:** `#c8a84e` | **Bright gold:** `#ffe680` | **Dark bg:** `#050508`
- **Fonts:** Bebas Neue (headings) + DM Sans (body/UI)
- **Tone:** Premium, authoritative, Saudi-focused logistics expertise

## Key Patterns

### Hero Chapters
Edit `CHAPTERS` array in `VideoHero.jsx`:
```js
{ range: [0.00, 0.39], eyebrow, headline: ['LINE1','LINE2'], sub, align: 'right'|'left'|'center' }
```
- 5 chapters, each mapped 1:1 to a frame sequence (frames2–frames6)
- Alignment alternates: right → left → center → right → left
- `FADE = 0.022` — tight crossfade, chapter fully gone before next starts
- Last chapter: no fade-out (exit overlay handles at videoP > 0.97)
- `SCROLL_HEIGHT = 1800` vh, `GLOBE_EXIT = 0.22`

### Globe Video (VideoHero.jsx)
- `GLOBE_SRC = '/saudi-connected.mp4'` — served from local `public/` folder (NOT Internet Archive)
- Progressive frame loading: first 80 frames eager, rest via `requestIdleCallback`, scroll-ahead buffer of 80 frames

### Quick Quote Modal
- `src/components/QuickQuoteModal.jsx` — modal wrapper with animated heading
- `src/components/QuickQuoteSection.jsx` — multi-step form (Sea/Air/Land/Customs/Project)
- `inModal={true}` prop suppresses duplicate header inside QuickQuoteSection
- Modal panel: NO maxHeight, NO inner scroll — backdrop scrolls (`alignItems: flex-start`)
- Continue/Submit: full-width gold gradient, `qqm-continue-pulse` glow, `qqm-arrow-nudge` on →
- Back: small secondary text link below Continue — NOT a full button
- Form: input `1.1rem`, label `0.88rem`, input color `#ffffff`
- Keyframes `qqm-continue-pulse` and `qqm-arrow-nudge` live in `src/index.css`
- Air Freight dimensions: `dimUnit` state (`'cm'`|`'mm'`), dropdown shows "Centimeters (cm)" / "Millimeters (mm)" — `minWidth: 140px` ensures full text visible; volWeight divisor = 5000 (cm) or 5,000,000 (mm)

### Cal.com Calendar (index.html)
- Preloaded iframe injected via `DOMContentLoaded` script — zero delay on click
- `window.__showCalModal()` shows the overlay
- Close button is a sibling of iframe inner div (NOT inside it) — avoids pointer interception
- cssText must use kebab-case (`align-items`, not `alignItems`)

### Shine Effects (index.css)
Three shine classes — all use `::after` pseudo-element with `content: attr(data-text)`:

| Class | Behavior | Use on |
|-------|----------|--------|
| `.shine-text` | Auto left-to-right sweep, 4s infinite | White text headings |
| `.shine-gold` | Auto left-to-right sweep, 4s infinite, white flash on gold | Gold accent text |
| `.shine-ltr` | Auto left-to-right sweep, 4s infinite, bright white flash | CTAs, "POWERED BY AI", tagline |

**Rules:**
- Always add `data-text={text}` attribute on the span
- Apply to `<span>` only, NOT block elements
- Do NOT use `background-clip: text` on the main element

### Hamburger Menu Animation
- Class `.hamburger-btn` — gold glow pulse every 2.5s
- Class `.bar-mid` on middle bar — shrinks/grows in sync
- Both animations disabled when menu is open (`className={!menuOpen ? 'hamburger-btn' : ''}`)

### Layla AI Chatbot (FloatingBookCTA.jsx)
- Bottom-right fixed position, zIndex 9999
- Knowledge base in `KB` object, responses in `RESPONSES` object
- Chat panel: `overflowY: 'scroll'`, height 360px — fully scrollable
- Avatar: `public/ai-assistant-female.png`
- Quick replies: Get a Quote, Air Freight, Sea Freight, Heavy Cargo, Saudi Logistics, Market Updates, Talk to Expert
- CTA actions: `"call"` → opens Cal.com popup | `"quote"` → scrolls to contact section

### Logo (Nav.jsx)
- `public/bejoice-logo-white.png` — white wings on transparent bg
- Height: `clamp(36px, 5vw, 56px)`, width: `auto`
- Clicking logo scrolls to top (Lenis or native)
- Two-line tagline: "BEJOICE" (white, 15px) + "Connecting KSA to the World" (gold `#ffe680`, 12px, shine-ltr)
- Gold divider line between logo and tagline: `borderLeft: '2px solid rgba(200,168,78,0.45)'`

### Stat Card (VideoHero.jsx)
- Silver glassmorphism: `rgba(180,190,210,0.08)` bg, `rgba(200,210,230,0.18)` border
- Numbers: 3.2rem, bright white with blue-white glow
- Labels: 13px, `rgba(210,220,240,0.9)`
- Stats: 1500+ Heavy Lift | 120+ Countries | 25+ Years | 24/7 Operations | KSA Specialist
- CountUp: fires 800ms after mount via setTimeout (not IntersectionObserver)

### TrackCard (VideoHero.jsx)
- Silver glassmorphism matching stat card
- Tracks via WhatsApp: `https://wa.me/966550000000`
- Input accepts BL / AWB / Container No.

### Section Padding
- All sections: `pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-14 lg:pb-32`
- Heading blocks inside sections: `mb-20`

### Scroll Behaviour
- Page always scrolls to top on load (`window.scrollTo(0, 0)` in App.jsx useEffect)
- Logo click → scroll to top
- Nav links → `window.__lenis.scrollTo(el, { offset: -80, duration: 1.6 })`
- Lenis initialized in App.jsx, exposed as `window.__lenis`

### Image Background Removal (sharp)
```js
sharp('input.png').resize(w, h, { kernel: sharp.kernel.lanczos3 }).ensureAlpha().raw()
// Threshold: lum > 210 → transparent, 155-210 → feathered, < 155 → solid white
// Sharpen: sigma: 2.2, m1: 2.0 | Contrast: linear(1.25, -20) | Trim: threshold 5
```

### Bejoice-scroll relationship
- Do NOT modify `C:/Users/ASUS/Desktop/Interactive Websit for Bejoice/bejoice-scroll/`
- The two projects are entirely separate

## Auto-Update Rule
**Claude must update CLAUDE.md and MEMORY.md at the end of every session or after any significant architectural change — without being asked.** Update only the changed sections; do not rewrite unrelated content.

## Gotchas
- `pointerEvents: 'none'` on chapter overlays blocks all mouse events — override with `pointerEvents: 'all'` on interactive children including `h1`
- Apostrophes in JS single-quoted strings break JSX — use double quotes for strings containing `'`
- Bebas Neue doesn't respond to `font-weight` — don't set it to change appearance
- `display: inline-block` on `section-headline` h2 breaks full-width layout — keep as block
- `background-clip: text` + `-webkit-text-fill-color: transparent` overrides inline `color` — use `::after` overlay approach instead
- `CountUp` non-numeric values (e.g. '24/7', 'KSA') skip animation and display immediately
- Stat card `overflow: 'hidden'` clips content — use `overflow: 'visible'` on outer panel, scroll on inner messages div
- Globe video crossfade: opacity interpolates over first 10% of scroll progress (`fadeEnd = 0.10`)
- Hero chapter `align: 'right'` sets both `alignItems: 'flex-end'` and `textAlign: 'right'` on the overlay
