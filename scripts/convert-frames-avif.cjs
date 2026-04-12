/**
 * Converts all frame sequences to AVIF (alongside existing WebP).
 * AVIF = ~20% smaller than WebP, ~97% browser support when combined with WebP fallback.
 * SLOW: ~1-3s per frame. Run overnight or in background.
 * Run: node scripts/convert-frames-avif.cjs
 */
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC = path.join(__dirname, '..', 'public')
const FOLDERS = ['3d', 'saudi', 'bejoice_truck', 'port', 'frames8', 'tech_enng']
const AVIF_QUALITY = 60   // 60 = visually lossless for photographic sequences
const CONCURRENCY = 2     // AVIF is CPU-heavy — keep low to avoid freezing

async function convertFolder(folder) {
  const dir = path.join(PUBLIC, folder)
  // Source from WebP files (already converted)
  const files = fs.readdirSync(dir).filter(f => /\.webp$/i.test(f))
  console.log(`\n[${folder}] Converting ${files.length} WebP → AVIF...`)

  let done = 0
  let savedBytes = 0

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY)
    await Promise.all(batch.map(async (file) => {
      const src = path.join(dir, file)
      const dest = path.join(dir, file.replace(/\.webp$/i, '.avif'))
      if (fs.existsSync(dest)) { done++; return } // skip if already done

      const origSize = fs.statSync(src).size
      await sharp(src).avif({ quality: AVIF_QUALITY, effort: 4 }).toFile(dest)
      const newSize = fs.statSync(dest).size
      savedBytes += origSize - newSize
      done++

      if (done % 10 === 0 || done === files.length) {
        const pct = ((done / files.length) * 100).toFixed(0)
        process.stdout.write(`  ${done}/${files.length} (${pct}%, saved ${(savedBytes/1024/1024).toFixed(1)}MB)\r`)
      }
    }))
  }

  const totalSaved = savedBytes / 1024 / 1024
  console.log(`  [${folder}] Done — saved ${totalSaved.toFixed(0)}MB vs WebP`)
  return savedBytes
}

async function main() {
  console.log('=== WebP → AVIF Frame Conversion (quality=' + AVIF_QUALITY + ') ===')
  let total = 0
  for (const folder of FOLDERS) {
    const dir = path.join(PUBLIC, folder)
    if (!fs.existsSync(dir)) { console.log(`[${folder}] SKIP`); continue }
    total += await convertFolder(folder)
  }
  console.log(`\n✅ Complete! Total saved vs WebP: ${(total/1024/1024).toFixed(0)}MB`)
}

main().catch(console.error)
