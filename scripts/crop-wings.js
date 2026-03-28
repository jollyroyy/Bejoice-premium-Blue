import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = 'C:/Users/ASUS/Downloads/bejoice_logo.png';
const OUTPUT = path.join(__dirname, '../public/bejoice-logo-white.png');

// Get original dims
const meta = await sharp(INPUT).metadata();
const origW = meta.width;
const origH = meta.height;

// Crop 22% from left and right sides → wings shorter, BEJOICE text proportionally bigger
const cropX = Math.round(origW * 0.22);
const newW = origW - cropX * 2;

const cropped = await sharp(INPUT)
  .extract({ left: cropX, top: 0, width: newW, height: origH })
  .toBuffer();

// Upscale 4x for crisp rendering
const scale = 4;
const { data, info } = await sharp(cropped)
  .resize(newW * scale, origH * scale, { kernel: sharp.kernel.lanczos3 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];

  const isWhiteBg = r > 230 && g > 230 && b > 230;

  if (isWhiteBg) {
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = 0;
  } else {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const darkness = 1 - lum / 255;
    const alpha = Math.min(255, Math.round(darkness * 320));
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = Math.max(0, Math.min(255, alpha));
  }
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .sharpen({ sigma: 1.2 })
  .png({ compressionLevel: 8 })
  .toFile(OUTPUT);

console.log(`Done → ${OUTPUT}  (${width}×${height})`);
