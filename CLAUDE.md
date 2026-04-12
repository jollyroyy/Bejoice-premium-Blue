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
- **GitHub (gold theme):** https://github.com/jollyroyy/Bejoice-premium
- **GitHub (blue theme fork):** https://github.com/jollyroyy/Bejoice-premium-Blue
- **Netlify site ID:** `0e479bcc-353e-41bb-bfbd-68ee51a97096` (site: bejoice-premium.netlify.app)
- **Push to blue repo:** `git push blue-theme master` (remote already configured)
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
- `public/saudi-connected.mp4` — globe video (legacy, no longer used for scrubbing)
- `public/3d/` — 145 PNGs: 3D HDR intro sequence (frameIdx 0–144)
- `public/frames2/` — 246 PNGs: ocean/ship footage (frameIdx 145–390, files 0044–0289)
- `public/frames8/` — 121 PNGs: additional footage (frameIdx 391–511)
- `public/frames6/` — 121 JPEGs: road/project cargo (frameIdx 512–632)
- Total: 633 frames across 4 sequences

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
{ frameRange: [startFrame, endFrame], eyebrow, headline: ['LINE1','LINE2'], sub, align: 'right'|'left'|'center' }
```
- 10 chapters + 1 globe chapter (index 1), all mapped to absolute frame indices
- `FRAME_FADE = 18` — crossfade window in frames
- `SCROLL_HEIGHT = 1800` vh
- Globe chapter: `{ frameRange: [145, 210], headline: [], globeChapter: true }` — no text, shows BejoiceGlobe
- `GLOBE_CHAPTER_START = 145`, `GLOBE_CHAPTER_END = 210`
- Canvas pre-dims 20 frames before globe chapter (`PRE_DIM_START = 125`) for seamless transition
- Exit fade: last 3% of scroll (`smoothP > 0.97`)
- Hero cards (TrackCard + FreightCalcCard + StatBar) fade out at frames 140–185 and 793–813
- `vAlign: 'bottom'` supported on chapters — sets `justifyContent: flex-end`, `paddingBottom: clamp(60px,8vh,100px)`

**Current chapter headlines (as of last session):**
1. Intro 3D (frames 0–144)
2. Globe chapter (145–210)
3. CONNECTED GLOBALLY — bottom center (218–390)
4. FROM BLUE PRINT TO DELIVERY, WE MOVE IT ALL (413–463)
5. NAVIGATING OCEANS. DELIVERING CONFIDENCE — eyebrow: OCEAN FREIGHT (471–541)
6. FROM PORT TO PORT. WORLD-CLASS LOGISTICS — eyebrow: FCL & LCL (621–707)
7. DRIVEN BY TRANSPARENCY. DELIVERED WITH TRUST — eyebrow: CUSTOMS CLEARANCE · PORT OPERATIONS (557–613)
8. SPEED ABOVE ALL. DELIVERED ON TIME — eyebrow: AIR FREIGHT · IATA CERTIFIED (726–780)
9. WORLD CLASS AIR FREIGHT — eyebrow: AIR FREIGHT · IATA CERTIFIED (781–840)
10. PRECISION IN HANDLING. EXCELLENCE IN DELIVERY — eyebrow: HEAVY LIFT · PROJECT CARGO (847–911)

### Globe Chapter (VideoHero.jsx)
- Full-screen `BejoiceGlobe embedded fullscreen` rendered inside `globeChapterRef` div at zIndex 6
- `canvasDimRef` darkens frame canvas during globe chapter (zIndex 2, opacity driven by RAF)
- Pre-dim starts at frame 125 → fully dark by 145 → stays dark through 210 → fades out by frame 232
- Progressive frame loading: first 30 frames eager, rest via `requestIdleCallback`, scroll-ahead 150 frames

### Social Media (Nav.jsx)
- LinkedIn: `https://www.linkedin.com/company/bejoice-shipping-llc/`
- Instagram: `https://www.instagram.com/bejoice_shipping`
- In nav bar: 30×30px app-icon squares to the right of the language toggle
- In Explore drawer: 44×44px squares below the tool cards grid (icon-only, no text labels)
- LinkedIn: official blue gradient `linear-gradient(145deg, #0d7ad6, #0A66C2, #084ea1)` with `in` lettermark
- Instagram: `linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)` with camera SVG

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
- **RAG system**: `src/data/laylaKnowledgeBase.js` — 30 Sea Freight PDF chunks, always consulted first via `retrieveChunks(query, topN=2, threshold=1)` before KB/RESPONSES
- **Session memory**: `_memory` object tracks name, company, origin, destination, cargo type, mode, container type, incoterm, weight, volume, urgency — updated on every message via `updateMemory()`
- **Personalization**: `personalizeOpening()` prepends "Hi [Name]!" when name is known; `buildContextHint()` appends route/cargo context to all logistics responses
- RAG skipped only for social messages (greetings, thanks, goodbye) matched by `isSocial` regex
- Name acknowledgement handler fires when user shares their name — "Nice to meet you, [Name]!"
- Knowledge base covers: B/L types, FCL/LCL, container specs, demurrage rates (KSA/UAE/Oman/Qatar), all 11 INCO Terms, sea import procedure, Letter of Credit, SABER/SASO, customs, CBM calc, transit times, DG cargo, cargo insurance
- Chat panel: `overflowY: 'scroll'`, height `min(360px, 45svh)` — fully scrollable
- Avatar: `public/ai-assistant-female.png`
- Quick replies: Start Shipment, Air Freight, Sea Freight, Heavy Cargo, Saudi Logistics, Market Updates, Talk to Expert
- CTA actions: `"call"` → opens Cal.com popup | `"quote"` → scrolls to contact section
- **Mobile**: CSS class `ca-panel-mobile` (width: calc(100vw - 16px) at ≤480px), `ca-msgs-mobile` (height: min(320px, 42svh)), `ca-bubble-mobile`, `ca-qr-btn-mobile`, `ca-fab-mobile`; input font-size 16px (prevents iOS zoom); all tap targets ≥ 44px; send button 44×44px

### Logo (Nav.jsx)
- `public/bejoice-logo-white.png` — white wings on transparent bg
- Height: `clamp(36px, 5vw, 56px)`, width: `auto`
- Clicking logo scrolls to top (Lenis or native)
- Two-line tagline: "BEJOICE" (white, 15px) + "Connecting KSA to the World" (gold `#ffe680`, 12px, shine-ltr)
- Gold divider line between logo and tagline: `borderLeft: '2px solid rgba(200,168,78,0.45)'`

### Hero Bottom Bar Cards (VideoHero.jsx)
All three cards share identical glassmorphism: `rgba(10,10,14,0.55)` bg, `rgba(255,215,120,0.12)` border, `blur(40px)`, gold top line accent, `borderRadius: 14px`

**StatBar** — `hero-stats-bar` div:
- Stats: 120+ Countries | 25+ Years | 24/7 Operations | KSA Specialist
- Numbers: `1.8rem` Bebas Neue, white with glow
- Labels: `11px` Inter, `rgba(255,215,120,0.85)`, `0.14em` tracking, uppercase
- Cell padding: `1.25rem` vertical — matches SleekCard height naturally
- CountUp: fires 600ms after mount via setTimeout

**TrackCard** — `SleekCard` with `justifyContent: center`, `padding: 1.25rem 1.75rem`:
- Title: `1.8rem` Bebas Neue + `textShadow` white glow
- Subtitle: `11px` Inter, `rgba(255,255,255,0.75)` — "Real-Time Global Visibility"
- Button: `btn-gold`, opens `https://www.track-trace.com/` in new tab

**FreightCalcCard** — same layout as TrackCard:
- Title: `1.8rem` Bebas Neue + `textShadow` white glow — "LOAD CALCULATOR"
- Subtitle: `11px` Inter, `rgba(255,255,255,0.75)` — "Container Volume Advisor"
- Button: `btn-gold`, scrolls to `#tools` section via Lenis

> Hero bottom bar hides on mobile (`.hero-bottom-bar { display: none }`) — cards appear inline below CTA in mobile layout

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
