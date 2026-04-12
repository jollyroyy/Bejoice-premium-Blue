/**
 * upload-to-s3.cjs
 * Uploads all frame folders and static assets to S3.
 * Run AFTER: aws configure (with your credentials)
 * Usage: node scripts/upload-to-s3.cjs
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const BUCKET = 'bejoice-premium-assets'
const REGION = 'ap-southeast-2'
const PUBLIC_DIR = path.join(__dirname, '..', 'public')

// Folders to upload (frame sequences)
const FRAME_FOLDERS = ['3d', 'saudi', 'bejoice_truck', 'port', 'frames8', 'tech_enng']

// Individual static asset files to upload
const STATIC_FILES = [
  'bejoice-logo-new.webp',
  'bejoice-logo-new.avif',
  'bejoice-logo-white.webp',
  'bejoice-logo-white.avif',
  'bejoice-wings-gold.webp',
  'bejoice-wings-gold.avif',
  'ai-assistant-female.webp',
  'ai-assistant-female.avif',
  'favicon.svg',
  'bejoice-wings.svg',
]

function run(cmd) {
  console.log(`\n> ${cmd}`)
  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (e) {
    console.error(`ERROR: ${e.message}`)
    process.exit(1)
  }
}

console.log('=== Bejoice S3 Asset Upload ===')
console.log(`Bucket: s3://${BUCKET}`)
console.log(`Region: ${REGION}\n`)

// Upload frame folders with sync (skips already-uploaded files)
for (const folder of FRAME_FOLDERS) {
  const localPath = path.join(PUBLIC_DIR, folder)
  if (!fs.existsSync(localPath)) {
    console.log(`⚠  Skipping ${folder} — folder not found locally`)
    continue
  }
  const fileCount = fs.readdirSync(localPath).length
  console.log(`📦 Uploading ${folder}/ (${fileCount} files)...`)
  run(
    `aws s3 sync "${localPath}" s3://${BUCKET}/${folder}/ --region ${REGION} --no-progress --content-type image/webp --cache-control "public, max-age=31536000, immutable"`
  )
}

// Upload static files
console.log('\n📁 Uploading static assets...')
for (const file of STATIC_FILES) {
  const localPath = path.join(PUBLIC_DIR, file)
  if (!fs.existsSync(localPath)) {
    console.log(`⚠  Skipping ${file} — not found`)
    continue
  }
  const ext = path.extname(file).toLowerCase()
  const contentType =
    ext === '.webp' ? 'image/webp' :
    ext === '.avif' ? 'image/avif' :
    ext === '.svg'  ? 'image/svg+xml' :
    ext === '.png'  ? 'image/png' :
    'application/octet-stream'

  run(
    `aws s3 cp "${localPath}" s3://${BUCKET}/${file} --region ${REGION} --content-type "${contentType}" --cache-control "public, max-age=31536000, immutable"`
  )
}

console.log('\n✅ Upload complete!')
console.log(`\nBase URL: https://${BUCKET}.s3.${REGION}.amazonaws.com/`)
console.log('Next step: run "node scripts/update-asset-urls.cjs" to update source code references.')
