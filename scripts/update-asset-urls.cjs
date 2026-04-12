/**
 * update-asset-urls.cjs
 * Patches VideoHero.jsx FRAME_URLS and other component asset refs to use S3 URLs.
 * Run AFTER upload-to-s3.cjs completes successfully.
 * Usage: node scripts/update-asset-urls.cjs
 */

const fs = require('fs')
const path = require('path')

const S3_BASE = 'https://bejoice-premium-assets.s3.ap-southeast-2.amazonaws.com'
const SRC_DIR = path.join(__dirname, '..', 'src')

// ─── 1. Patch VideoHero.jsx FRAME_URLS ───────────────────────────────────────
const heroPath = path.join(SRC_DIR, 'components', 'VideoHero.jsx')
let hero = fs.readFileSync(heroPath, 'utf-8')

const oldUrls = `const FRAME_URLS = [
  // 3d intro sequence (idx 0–144) — hero
  ...Array.from({ length: FRAMES3D_COUNT }, (_, i) =>
    \`/3d/\${String(i + 1).padStart(4, '0')}.webp\`),
  // globe bridge (idx 145–210) — repeats last 3d frame; invisible behind globe dim
  ...Array.from({ length: GLOBE_BRIDGE_COUNT }, () => \`/3d/0145.webp\`),
  // saudi seg (idx 211–403) — 3rd segment, plays right after globe
  ...Array.from({ length: FRAMES_SAUDI_COUNT }, (_, i) =>
    \`/saudi/\${String(i + 1).padStart(4, '0')}.webp\`),
  // bejoice_truck seg (idx 404–548) — starts from frame 1 after globe ends
  ...Array.from({ length: FRAMES_TRUCK_COUNT }, (_, i) =>
    \`/bejoice_truck/\${String(i + 1).padStart(4, '0')}.webp\`),
  // port seg (idx 549–717)
  ...Array.from({ length: FRAMES_PORT_COUNT }, (_, i) =>
    \`/port/\${String(i + 1).padStart(4, '0')}.webp\`),
  // frames8 seg (idx 718–838)
  ...Array.from({ length: FRAMES8_COUNT }, (_, i) =>
    \`/frames8/\${String(i + 1).padStart(4, '0')}.webp\`),
  // tech_enng seg (idx 839–983)
  ...Array.from({ length: FRAMES_TECH_COUNT }, (_, i) =>
    \`/tech_enng/\${String(i + 1).padStart(4, '0')}.webp\`),
]`

const newUrls = `const S3 = '${S3_BASE}'
const FRAME_URLS = [
  // 3d intro sequence (idx 0–144) — hero
  ...Array.from({ length: FRAMES3D_COUNT }, (_, i) =>
    \`\${S3}/3d/\${String(i + 1).padStart(4, '0')}.webp\`),
  // globe bridge (idx 145–210) — repeats last 3d frame; invisible behind globe dim
  ...Array.from({ length: GLOBE_BRIDGE_COUNT }, () => \`\${S3}/3d/0145.webp\`),
  // saudi seg (idx 211–403) — 3rd segment, plays right after globe
  ...Array.from({ length: FRAMES_SAUDI_COUNT }, (_, i) =>
    \`\${S3}/saudi/\${String(i + 1).padStart(4, '0')}.webp\`),
  // bejoice_truck seg (idx 404–548) — starts from frame 1 after globe ends
  ...Array.from({ length: FRAMES_TRUCK_COUNT }, (_, i) =>
    \`\${S3}/bejoice_truck/\${String(i + 1).padStart(4, '0')}.webp\`),
  // port seg (idx 549–717)
  ...Array.from({ length: FRAMES_PORT_COUNT }, (_, i) =>
    \`\${S3}/port/\${String(i + 1).padStart(4, '0')}.webp\`),
  // frames8 seg (idx 718–838)
  ...Array.from({ length: FRAMES8_COUNT }, (_, i) =>
    \`\${S3}/frames8/\${String(i + 1).padStart(4, '0')}.webp\`),
  // tech_enng seg (idx 839–983)
  ...Array.from({ length: FRAMES_TECH_COUNT }, (_, i) =>
    \`\${S3}/tech_enng/\${String(i + 1).padStart(4, '0')}.webp\`),
]`

if (hero.includes('const FRAME_URLS')) {
  // Replace old FRAME_URLS block
  const start = hero.indexOf('const FRAME_URLS')
  const end = hero.indexOf(']', hero.indexOf('tech_enng')) + 1
  const before = hero.slice(0, start)
  const after = hero.slice(end)
  fs.writeFileSync(heroPath, before + newUrls + after)
  console.log('✅ VideoHero.jsx — FRAME_URLS updated to S3 URLs')
} else {
  console.log('⚠  VideoHero.jsx — FRAME_URLS block not found (already updated?)')
}

// ─── 2. Patch static asset refs in components ──────────────────────────────
const patches = [
  {
    file: path.join(SRC_DIR, 'components', 'FloatingBookCTA.jsx'),
    replacements: [
      ['/ai-assistant-female.webp', `${S3_BASE}/ai-assistant-female.webp`],
      ['/ai-assistant-female.png', `${S3_BASE}/ai-assistant-female.webp`],
    ]
  },
  {
    file: path.join(SRC_DIR, 'components', 'Nav.jsx'),
    replacements: [
      ['/bejoice-logo-new.webp', `${S3_BASE}/bejoice-logo-new.webp`],
      ['/bejoice-logo-new.png', `${S3_BASE}/bejoice-logo-new.webp`],
    ]
  },
  {
    file: path.join(SRC_DIR, 'components', 'Footer.jsx'),
    replacements: [
      ['/bejoice-logo-white.webp', `${S3_BASE}/bejoice-logo-white.webp`],
      ['/bejoice-logo-white.png', `${S3_BASE}/bejoice-logo-white.webp`],
    ]
  },
  {
    file: path.join(SRC_DIR, 'components', 'GlobeVideo.jsx'),
    replacements: [
      ['/bejoice-wings-gold.webp', `${S3_BASE}/bejoice-wings-gold.webp`],
      ['/bejoice-wings-gold.png', `${S3_BASE}/bejoice-wings-gold.webp`],
    ]
  },
]

for (const { file, replacements } of patches) {
  if (!fs.existsSync(file)) {
    console.log(`⚠  Skipping ${path.basename(file)} — not found`)
    continue
  }
  let content = fs.readFileSync(file, 'utf-8')
  let changed = false
  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.split(from).join(to)
      changed = true
    }
  }
  if (changed) {
    fs.writeFileSync(file, content)
    console.log(`✅ ${path.basename(file)} — asset URLs updated`)
  } else {
    console.log(`⏭  ${path.basename(file)} — no changes needed`)
  }
}

console.log('\n✅ All source files updated.')
console.log('Run "npm run build" then deploy to Netlify.')
