/**
 * compress-frames.cjs
 * Re-encodes all local WebP frames at quality=75, effort=6
 * Overwrites in-place. Reports before/after sizes.
 *
 * Usage: node scripts/compress-frames.cjs
 */

const sharp  = require('sharp')
const fs     = require('fs')
const path   = require('path')

const FOLDERS = ['bic', 'bejoice_truck', 'port', 'frames8', 'tech_enng', 'saudi']
const PUBLIC  = path.join(__dirname, '..', 'public')

const QUALITY = 75   // 75 is visually lossless for video-frame stills
const EFFORT  = 6    // 0–6; higher = better compression, slower encode

async function compressFolder(folder) {
  const dir   = path.join(PUBLIC, folder)
  if (!fs.existsSync(dir)) { console.log(`  skipping ${folder} (not found locally)`); return { saved: 0, files: 0 } }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'))
  let totalBefore = 0, totalAfter = 0

  for (let i = 0; i < files.length; i++) {
    const fp     = path.join(dir, files[i])
    const before = fs.statSync(fp).size

    const compressed = await sharp(fp)
      .webp({ quality: QUALITY, effort: EFFORT, smartSubsample: true })
      .toBuffer()

    // Write compressed to a sibling output dir, overwrite original later via shell
    const outDir = path.join(dir, '..', folder + '_compressed')
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
    if (compressed.length < before) {
      fs.writeFileSync(path.join(outDir, files[i]), compressed)
      totalAfter += compressed.length
    } else {
      // Copy original as-is (already optimal)
      fs.copyFileSync(fp, path.join(outDir, files[i]))
      totalAfter += before
    }
    totalBefore += before

    if ((i + 1) % 30 === 0 || i === files.length - 1) {
      process.stdout.write(`\r  ${folder}: ${i + 1}/${files.length} files processed`)
    }
  }

  console.log('')
  const savedMB  = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)
  const savedPct = ((1 - totalAfter / totalBefore) * 100).toFixed(1)
  console.log(`  ${folder}: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (saved ${savedMB}MB / ${savedPct}%)`)
  return { saved: totalBefore - totalAfter, files: files.length }
}

;(async () => {
  console.log(`\nCompressing frames at quality=${QUALITY}, effort=${EFFORT}...\n`)
  let totalSaved = 0, totalFiles = 0

  for (const folder of FOLDERS) {
    const result = await compressFolder(folder)
    totalSaved += result.saved
    totalFiles += result.files
  }

  console.log(`\n✓ Compression done — ${totalFiles} files, ${(totalSaved/1024/1024).toFixed(1)}MB saved total`)
  console.log('\nSwapping compressed files into place...')

  const { execSync } = require('child_process')
  for (const folder of FOLDERS) {
    const src  = path.join(PUBLIC, folder + '_compressed')
    const dest = path.join(PUBLIC, folder)
    if (!fs.existsSync(src)) continue
    // Use PowerShell to force-copy (bypasses Windows file locks from Explorer)
    execSync(`powershell.exe -Command "Copy-Item '${src}\\*' '${dest}\\' -Force"`)
    fs.rmSync(src, { recursive: true, force: true })
    console.log(`  replaced ${folder}/`)
  }
  console.log('\n✓ All done!\n')
})()
