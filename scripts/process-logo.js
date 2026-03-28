import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = 'C:/Users/ASUS/Downloads/bejoice_logo.png';
const OUTPUT = path.join(__dirname, '../public/bejoice-logo-white.png');

const { data, info } = await sharp(INPUT)
  .resize(3000, null, { kernel: sharp.kernel.lanczos3 }) // upscale to 3000px wide
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  const a = channels === 4 ? data[i * channels + 3] : 255;

  const lum = 0.299 * r + 0.587 * g + 0.114 * b;

  // Detect white/near-white background → transparent
  const isWhiteBg = r > 230 && g > 230 && b > 230;

  if (isWhiteBg) {
    // fully transparent
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = 0;
  } else {
    // Recolor any colored pixel to white (preserve alpha from darkness)
    const darkness = 1 - lum / 255;
    const alpha = Math.min(255, Math.round(darkness * 320));
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = Math.max(0, Math.min(255, alpha));
  }
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .sharpen({ sigma: 1.5 })
  .png({ compressionLevel: 8, quality: 100 })
  .toFile(OUTPUT);

console.log(`Done → ${OUTPUT}  (${width}×${height})`);
