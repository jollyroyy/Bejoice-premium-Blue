/**
 * Convert all PNG frame sequences to WebP for ~80% size reduction.
 * Uses sharp (already installed). Replaces PNGs in-place.
 * Run: node scripts/convert-to-webp.js
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC = path.join(__dirname, '..', 'public')

// Active frame folders used by VideoHero
const FOLDERS = ['3d', 'saudi', 'bejoice_truck', 'port', 'frames8', 'tech_enng']

const WEBP_QUALITY = 80   // 80 = excellent visual quality, ~80% smaller than PNG
const CONCURRENCY = 4     // parallel conversions (tune to CPU)

async function convertFolder(folder) {
  const dir = path.join(PUBLIC, folder)
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpe?g)$/i.test(f))

  console.log(`\n[${folder}] Converting ${files.length} files...`)
  let done = 0
  let savedBytes = 0

  // Process in batches of CONCURRENCY
  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map(async (file) => {
      const src = path.join(dir, file)
      const dest = path.join(dir, file.replace(/\.(png|jpe?g)$/i, '.webp'))

      const origSize = fs.statSync(src).size
      await sharp(src)
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(dest)

      const newSize = fs.statSync(dest).size
      savedBytes += origSize - newSize

      // Delete original after successful conversion
      fs.unlinkSync(src)

      done++
      if (done % 20 === 0 || done === files.length) {
        process.stdout.write(`  ${done}/${files.length} (saved ${(savedBytes/1024/1024).toFixed(1)}MB so far)\r`)
      }
    }))
  }

  console.log(`  [${folder}] Done — saved ${(savedBytes/1024/1024).toFixed(0)}MB`)
  return savedBytes
}

async function main() {
  console.log('=== PNG → WebP Conversion (quality=' + WEBP_QUALITY + ') ===')
  console.log('Folders:', FOLDERS.join(', '))

  let total = 0
  for (const folder of FOLDERS) {
    const dir = path.join(PUBLIC, folder)
    if (!fs.existsSync(dir)) {
      console.log(`[${folder}] SKIP — folder not found`)
      continue
    }
    total += await convertFolder(folder)
  }

  console.log(`\n✅ Complete! Total saved: ${(total/1024/1024).toFixed(0)}MB`)
  console.log('Next: update VideoHero.jsx .png → .webp (already done if using convert script)')
}

main().catch(console.error)
