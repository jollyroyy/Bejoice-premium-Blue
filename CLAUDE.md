# Bejoice Premium — Claude Context

## Core Rules
- **Only modify what was explicitly requested.** Do not add extra changes, resize fonts, refactor styles, or "improve" things that weren't asked about. If you think something else should change, ASK first.
- **When a fix attempt fails or the user asks to revert, do NOT retry the same approach.** Step back, explain what went wrong, and propose a fundamentally different strategy before proceeding.

## Before Editing
- Before editing a file, verify it's the **correct file** that renders the component in question. Use Grep to confirm which file is actually imported/used before making changes.
- For complex changes, run this investigation first:
  > "Before making any edits, use a task agent to find exactly which file renders the [component name] that's visible on the page. Check imports, not just filenames. Report back which file to edit."

## Debugging
- When debugging, start with the **simplest possible causes first** (CSS visibility, z-index, pointer-events, opacity) before investigating complex scenarios. Spend no more than 2 minutes on exploratory investigation before checking the obvious.

## After Changes
- After making changes to the site, run `npm run build` to verify the build succeeds before moving on. **Never leave broken syntax behind.**

---

## 🎨 STANDING RULE — USE FRONTEND-DESIGN SKILL
**Always consult the `frontend-design` skill for any UI/styling work — new components, layout changes, visual improvements, or design decisions — without being asked.**
- Invoke via `Skill tool: frontend-design` before writing any significant UI code
- The skill ensures distinctive, non-generic aesthetics aligned with the Bejoice premium brand

## 🔴 STANDING RULE — MOBILE-FIRST ALWAYS
**Every single change — new component, style tweak, layout fix, or feature — MUST be mobile-optimized without being asked.**
- Test mentally at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad), 912px (Surface Pro) before finalising
- Never use fixed `px` widths without a `min()` or `clamp()` guard
- Use `100svh` (with `100vh` fallback) for full-viewport sticky containers
- All tap targets ≥ 44px; input `font-size ≥ 16px` (prevents iOS zoom)
- Overlapping / z-index issues MUST be caught and fixed in the same change
- If a component is hidden on mobile to save space, ensure it is accessible via another path (e.g. hamburger drawer)
- Floating elements (chatbot, FABs) must not block primary content on any screen size

## 🚀 STANDING RULE — ALWAYS PUSH TO MAIN
**After every change, always push to the `main` branch on the blue repo:**
```bash
git push origin main
```
- Active working branch is `feature/blue-theme-183650` locally
- Remote `origin` = `https://github.com/jollyroyy/Bejoice-premium-Blue`
- The `.claude/skills/audit-website` path is a **symlink** locally — `git reset --hard` and `git merge` will fail with "cannot create directory" error. Use `git push origin main` directly after committing on any branch, or use `git push origin feature/blue-theme-183650:main --force` as fallback.
- Frame folders are gitignored — code-only pushes work fine

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
- **GitHub (gold theme):** https://github.com/jollyroyy/Bejoice-premium — remote `origin` on gold project
- **GitHub (blue theme fork):** https://github.com/jollyroyy/Bejoice-premium-Blue — remote `origin` in this working dir
- **Netlify site ID:** `0e479bcc-353e-41bb-bfbd-68ee51a97096` (site: bejoice-premium.netlify.app)
- **Image processing:** `sharp` installed as devDependency — use for PNG bg removal & recoloring
- **Build:** `npm run build` → outputs to `dist/`
- **Deploy:** `npx netlify-cli deploy --prod --dir=dist --site=0e479bcc-353e-41bb-bfbd-68ee51a97096`

## Architecture
- `src/App.jsx` — page composition, section order, Lenis init, scroll-to-top on load
- `src/components/VideoHero.jsx` — scrollytelling hero with frame scrubbing; chapters defined in `CHAPTERS` array at top of file; TrackCard + FreightCalcCard + CountUp defined inline
- `src/components/BejoiceGlobe.jsx` — 3D Three.js globe shown during globe chapter; branch offices, HQ, arcs; text panel right side
- `src/components/FloatingBookCTA.jsx` — Layla AI chatbot (bottom-right, moves to bottom-left on mobile)
- `src/components/Nav.jsx` — fixed nav with logo, Book a Call CTA, hamburger menu
- `src/index.css` — ALL global CSS classes (section-headline, body-text, card-body, shine-text, shine-gold, shine-ltr, btn-gold, hamburger-btn, etc.)
- `public/` — static assets
- `public/bejoice-logo-white.webp` — main logo used in Nav (white wings, transparent bg). **Note: `.png` does NOT exist in public/ — use `.webp`**
- `public/ai-assistant-female.png` — Layla avatar image
- `public/bic/` — 145 WebPs: BIC zoomout intro sequence (frameIdx 0–144)
- Frame folders are gitignored and served from S3/CloudFront CDN

## Section Order (App.jsx)
VideoHero → Contact → LogisticsTools → Services → Certifications → Footer

> HeavyLift, HeavyCargo, WhyBejoice, KeyMarkets, Testimonials files exist but are NOT rendered.
> StatsBar removed. QuickQuoteSection only accessible via modal.
> QuickQuoteModal opens via `onQuoteClick` prop on VideoHero hero CTA button.

## Brand Identity & Guardrails
- **DO NOT** change brand colors without explicit instruction
- **DO NOT** alter company facts (years, certifications, country count)
- **DO NOT** modify the Bejoice logo image files
- **Blue theme brand color:** `#183650` (navy blue) | **Accent blue:** `#5BC2E7` | **Dark bg:** `#050508`
- **Gold theme brand color:** `#c8a84e` | **Bright gold:** `#ffe680`
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
- `SCROLL_HEIGHT = 2000` vh
- Globe chapter: `{ frameRange: [145, 210], headline: [], globeChapter: true }` — no text, shows BejoiceGlobe
- `GLOBE_CHAPTER_START = 145`, `GLOBE_CHAPTER_END = 210`
- Canvas dims behind globe chapter; exit fade at `smoothP > 0.97`
- Hero cards (TrackCard + FreightCalcCard + StatBar) fade out at frames 100–145 and 683–703
- `vAlign: 'bottom'` supported on chapters — sets `justifyContent: flex-end`, `paddingBottom: clamp(60px,8vh,100px)`
- Last chapter (index 9 — TECHNICAL ENGINEERING): CSS transition delay **9s** on fade-in (`opacity 0.6s ease 9s`)

**Current chapter headlines (CHAPTERS array, 10 entries, indices 0–9):**
0. Intro BIC zoomout (frames 0–144) — eyebrow: CONNECTING KSA TO THE WORLD; headline: SMART FREIGHT / POWERED BY AI
1. Globe chapter (frames 145–210) — no text, globeChapter: true
2. (frames 211–285) — eyebrow: PROJECTS & HEAVY LIFT; headline: FROM BLUE PRINT TO DELIVERY, / WE MOVE IT ALL; align: right
3. (frames 296–385) — eyebrow: FCL · LCL · BREAKBULK · REEFER · DG · OOG; headline: NAVIGATING OCEANS. / DELIVERING CONFIDENCE; align: left
4. (frames 390–476) — eyebrow: PORT OPERATIONS; headline: DRIVEN BY TRANSPARENCY. / DELIVERED WITH TRUST; align: right
5. (frames 481–524) — eyebrow: POWERING SAUDI PROJECTS THROUGH EVERY STORM; headline: FROM PORT TO PORT. / WORLD-CLASS LOGISTICS; align: left
6. (frames 525–590) — eyebrow: AIR FREIGHT; headline: SPEED ABOVE ALL. / DELIVERED ON TIME; align: right
7. (frames 595–645) — headline: WORLD CLASS / AIR FREIGHT; align: right
8. (frames 646–720) — headline: PRECISION IN HANDLING. / EXCELLENCE IN DELIVERY; align: right
9. (frames 720–790) — headline: TECHNICAL / ENGINEERING; align: center, vAlign: bottom; **fade-in delay: 9s**

### Globe Chapter (VideoHero.jsx)
- Full-screen `BejoiceGlobe embedded fullscreen` rendered inside `globeChapterRef` div at zIndex 6
- `canvasDimRef` darkens frame canvas during globe chapter (zIndex 2, opacity driven by RAF)
- Pre-dim starts at frame 125 → fully dark by 145 → stays dark through 210 → fades out by frame 232
- Progressive frame loading: first 30 frames eager, rest via `requestIdleCallback`, scroll-ahead 150 frames

### BejoiceGlobe (BejoiceGlobe.jsx)
- Three.js globe with office markers: Dubai HQ, Riyadh/Jeddah/Dammam offices, Mumbai/Shanghai partners
- Branch offices displayed as: `SAUDI ARABIA · UAE · INDIA · CHINA` — Bebas Neue, uppercase, dot-separated, `clamp(1.1rem,2.8vw,1.5rem)`
- Right-panel text layout: eyebrow → headline → HQ line → separator → branch offices → tagline
- Gap between elements: `clamp(1.5rem,3.5vw,3rem)` on right column flex container
- OFFICES array at top of file — edit to add/remove markers

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
- Fixed position, zIndex 9999; moves to **bottom-left** on mobile (≤767px via `.layla-fab-wrap` CSS)
- **RAG system**: `src/data/laylaKnowledgeBase.js` — 30 Sea Freight PDF chunks, always consulted first via `retrieveChunks(query, topN=2, threshold=1)` before KB/RESPONSES
- **Session memory**: `_memory` object tracks name, company, origin, destination, cargo type, mode, container type, incoterm, weight, volume, urgency — updated on every message via `updateMemory()`
- Chat panel: `ca-panel-mobile` class; max-height `calc(100svh - 120px)` on mobile; `padding-bottom: env(safe-area-inset-bottom)` for iPhone notch
- Avatar: `public/ai-assistant-female.png`
- CTA actions: `"call"` → opens Cal.com popup | `"quote"` → scrolls to contact section
- **Mobile**: CSS class `ca-panel-mobile` (width: `min(380px, calc(100vw - 16px))`), `ca-msgs-mobile`, `ca-fab-mobile`; input font-size 16px (prevents iOS zoom); all tap targets ≥ 44px

### Logo (Nav.jsx)
- `public/bejoice-logo-white.webp` — white wings on transparent bg (`.png` does NOT exist)
- Height: `clamp(108px, 5vw, 128px)` (increased across sessions), width: `auto`
- Nav negative margins reset at ≤1280px via `.nav-logo-wrap` and `.nav-right-wrap` CSS classes
- Clicking logo scrolls to top (Lenis or native)

### Hero Bottom Bar Cards (VideoHero.jsx)
All three cards share glassmorphism styling.

**StatBar** — `hero-stats-bar` div:
- Stats: 120+ Countries | 25+ Years | 24/7 Operations | KSA Specialist

**TrackCard** — `SleekCard`:
- Title: `1.8rem` Bebas Neue — "WHERE IS YOUR SHIPMENT?"
- Button: `btn-gold`, opens `https://www.track-trace.com/` in new tab

**FreightCalcCard** — `SleekCard`:
- Title: `1.8rem` Bebas Neue — "LOAD CALCULATION" (renamed from LOAD CALCULATOR)
- No subtitle (subtitle removed per user request)
- Button: `btn-gold`, scrolls to `#tools` section via Lenis

> Hero bottom bar hides on mobile (`.hero-bottom-bar { display: none }`) — TrackCard + stats rendered inline below CTA via `.hero-mobile-cards` div (only visible at ≤767px via CSS)

### Responsive Breakpoints (index.css)
- `≤479px` — very small phones (nav book-call icon-only)
- `≤480px` — small mobile
- `≤767px` — mobile (hero overlay padding-top: 114px to clear nav; Layla moves left)
- `≤768px` → `≤912px` — tablet / Surface Pro (LogisticsTools grids collapse at 912px)
- `768px–1024px` — tablet/Surface Pro section padding: `clamp(1.5rem,4vw,3rem)`
- `≤1280px` — nav negative margins reset, overflow-x hidden

### LogisticsTools Grids (LogisticsTools.jsx)
- Row grids collapse at **912px** (covers Surface Pro), not 768px
- AI results panel uses `repeat(auto-fit, minmax(min(160px,100%), 1fr))` for single-column on mobile
- Breakpoints: 912px → 3–4 col, 480px → 2 col

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

### WhyBejoice (WhyBejoice.jsx)
- **Not rendered** in current App.jsx (file exists but is unused)
- Founders: Mohammed Ashraful Althaf (COO), Preetham Canute Pinto (CEO), **Ibrahim Shahil** (Managing Partner)
- Founder cards: spring pop-in `scale: 0.82 → 1, y: 40 → 0`; portrait circle has its own separate spring `scale: 0.55 → 1` with extra delay
- Capability cards: `y: 36 → 0, opacity: 0 → 1` slide-in (no scale — avoids grid bleed); hover tints background only
- Capability desc font: `clamp(16px,1.6vw,18.5px)`
- **Framer Motion gotcha**: never put two `transition` props on the same `motion.div` — last one silently wins

### Arabic i18n (`src/i18n/ar.js`)
- `ar.hero.chapters` must have **exactly 10 entries** matching `CHAPTERS` array (indices 0–9); index 1 = `null` (globe)
- Arabic eyebrows must match English eyebrows per chapter index — mismatches cause wrong text on Arabic page
- `ar.nav.bejoiceWings` = `'أجنحة بيجويس'` — used in Footer for the "Bejoice Wings" link
- Certifications: Arabic cert names shown; **English codes NOT shown below** (removed `{isAr && <div>{c.code}</div>}` block)

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
- Hero chapter `align: 'right'` sets both `alignItems: 'flex-end'` and `textAlign: 'right'` on the overlay
- **Logo file**: `bejoice-logo-white.png` does NOT exist in `public/` — always use `bejoice-logo-white.webp`
- **Git symlink conflict**: `.claude/skills/audit-website` is a symlink locally. `git reset --hard origin/main` and `git merge` will fail with "cannot create directory". Use `git checkout origin/main -- src/ public/` to pull specific folders, or just `git push origin main` to push.
- **Nav negative margins**: `marginLeft: '-173px'` on logo wrap causes overflow at ≤1280px — reset via CSS `.nav-logo-wrap { margin-left: 0 !important }` at that breakpoint
- **Hero chapter textBlock**: use `maxWidth: 'min(calc(100vw - 2rem), max-content)'` — never a bare `px` value or it overflows on 375px
- **Mobile hero cards**: `.hero-mobile-cards` must exist as JSX (inside `ch.showCTA` block) AND have `display: none` by default in CSS — only shown at ≤767px

### Animation Architecture
- **Pattern**: IO for detection, GSAP for animation execution — never CSS `transition` on GSAP-animated elements
- **`useFadeUpBatch(sectionRef)`** hook (`src/hooks/useFadeUpBatch.js`) — use this in any section component that has `.fade-up` children. Replaces the old IO-on-section + `setTimeout` + `classList.add('visible')` pattern.
- **`data-animation` attribute** — add `data-animation="fade-up|fade-left|fade-right|scale-in|fade-down"` to any element for automatic IO+GSAP entrance via ScrollReveal.jsx. Only works for elements in the initial DOM (not lazy-loaded sections — use hook for those).
- **`.fade-up` CSS**: initial state only (`opacity:0; transform:translateY(28px)`). NO transition — GSAP owns it. `.visible` class added by hook's `onComplete` as marker only.
- **`will-change`**: only on constantly-animating elements (cursor, hero canvas, chapter overlays). Hover-only: use `:hover` state. Never static on cards.
- **`content-visibility: auto`**: Contact (800px), Certifications (560px), Footer (420px). Skip canvas/interactive sections.
- **GSAP plugins**: core + ScrollTrigger only. `registerPlugin` only in App.jsx. Do not add other plugins.
