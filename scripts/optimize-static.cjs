const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const tasks = [
  { src: 'public/bejoice-logo-white.webp', width: 800, format: 'webp', quality: 82 },
  { src: 'public/bejoice-logo-white.avif', width: 800, format: 'avif', quality: 65 },
  { src: 'public/bejoice-logo-new.webp', width: 1200, format: 'webp', quality: 82 },
  { src: 'public/bejoice-logo-new.avif', width: 1200, format: 'avif', quality: 65 },
  { src: 'public/ai-assistant-female.webp', width: 400, format: 'webp', quality: 82 },
  { src: 'public/ai-assistant-female.avif', width: 400, format: 'avif', quality: 65 },
];

(async () => {
  for (const t of tasks) {
    if (!fs.existsSync(t.src)) { console.log('skip ' + t.src); continue; }
    const before = fs.statSync(t.src).size;
    const ext = path.extname(t.src);
    const base = t.src.slice(0, -ext.length);
    const tmpOut = base + '_optimized' + ext;
    const buf = await sharp(t.src)
      .resize(t.width, null, { withoutEnlargement: true, kernel: 'lanczos3' })
      [t.format]({ quality: t.quality, effort: 6 })
      .toBuffer();
    fs.writeFileSync(tmpOut, buf);
    const after = buf.length;
    const saved = Math.round((1 - after / before) * 100);
    console.log(t.src + ': ' + Math.round(before/1024) + 'KB -> ' + Math.round(after/1024) + 'KB (' + saved + '% saved) => ' + tmpOut);
  }
  console.log('Done. Replace originals with _optimized versions after review.');
})();
