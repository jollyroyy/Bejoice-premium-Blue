# Bejoice Premium — Claude Context

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
- `public/globe-trade.mp4` — globe video (hero background, crossfades into JPEG scrubbing)
- `public/frames-hero/` — JPEG frames for hero video scrubbing

## Section Order (App.jsx)
VideoHero → OceanFreight → Services → HeavyLift → HeavyCargo → WhyBejoice → KeyMarkets → Certifications → Testimonials → Contact → Footer

> StatsBar was removed — stats are shown inside VideoHero's stat card

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
{ range: [0.0, 0.15], eyebrow, headline: ['LINE1','LINE2'], sub, showCta?, showStats?, align? }
```
- `align: 'right'` → right-aligns the chapter (used for "THE WORLD'S OCEANS" and "CERTIFIED TO DELIVER")
- All other chapters default to left-aligned
- Chapter overlays use `justifyContent: 'center'` (vertical center of viewport)
- h1 elements need `pointerEvents: 'all'` to receive hover events through the overlay

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
