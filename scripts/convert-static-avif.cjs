/**
 * Converts static site images to WebP + AVIF for <picture> tag fallback chain.
 * Run: node scripts/convert-static-avif.cjs
 */
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const PUBLIC = path.join(__dirname, '..', 'public')

const IMAGES = [
  'bejoice-logo-new.png',
  'bejoice-logo-white.png',
  'bejoice-wings-gold.png',
  'ai-assistant-female.png',
]

async function main() {
  for (const file of IMAGES) {
    const src = path.join(PUBLIC, file)
    if (!fs.existsSync(src)) { console.log(`SKIP ${file} — not found`); continue }
    const base = file.replace(/\.png$/i, '')
    const webp = path.join(PUBLIC, base + '.webp')
    const avif = path.join(PUBLIC, base + '.avif')

    await sharp(src).webp({ quality: 85 }).toFile(webp)
    const ws = fs.statSync(webp).size
    console.log(`  ${base}.webp — ${(ws/1024).toFixed(0)}KB`)

    await sharp(src).avif({ quality: 70, effort: 6 }).toFile(avif)
    const as = fs.statSync(avif).size
    console.log(`  ${base}.avif — ${(as/1024).toFixed(0)}KB`)
  }
  console.log('Done.')
}

main().catch(console.error)
