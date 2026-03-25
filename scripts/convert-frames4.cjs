const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SRC = 'C:/Users/ASUS/Downloads/frames4'
const DST = 'C:/Users/ASUS/Desktop/premium/public/frames4'

fs.mkdirSync(DST, { recursive: true })

const files = fs.readdirSync(SRC).filter(f => f.endsWith('.png')).sort()
console.log(`Converting ${files.length} frames4 at ultra-high quality...`)

let done = 0
async function run() {
  for (const f of files) {
    const name = f.replace('.png', '.jpg')
    await sharp(path.join(SRC, f))
      .sharpen({ sigma: 0.8, m1: 0.5, m2: 3.0 })
      .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(path.join(DST, name))
    done++
    if (done % 10 === 0 || done === files.length) console.log(`  ${done}/${files.length}`)
  }
  console.log('Done! Files in: ' + DST)
}

run().catch(console.error)
