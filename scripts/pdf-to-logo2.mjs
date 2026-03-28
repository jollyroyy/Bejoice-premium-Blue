import { pdf } from 'pdf-to-img';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = 'C:/Users/ASUS/Downloads/BEJOICE GROUP OF COMPANIES LOGO.pdf';
const OUTPUT   = path.join(__dirname, '../public/bejoice-logo-white.png');

// Render PDF page at high scale
const doc = await pdf(PDF_PATH, { scale: 8 });
let pageBuffer;
for await (const page of doc) {
  pageBuffer = page;
  break; // only first page
}

console.log(`Got page buffer: ${pageBuffer.length} bytes`);

// Check what we have
const rawMeta = await sharp(pageBuffer).metadata();
console.log(`Raw render: ${rawMeta.width}×${rawMeta.height}`);

// Find bounding box of non-white content
const { data, info } = await sharp(pageBuffer)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const r = data[i], g = data[i+1], b = data[i+2];
    if (r < 240 || g < 240 || b < 240) {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
  }
}
console.log(`Content bbox: (${minX},${minY}) → (${maxX},${maxY})`);
console.log(`Content size: ${maxX-minX}×${maxY-minY}`);

if (maxX <= minX || maxY <= minY) {
  console.error('No content found! Saving raw to debug...');
  await sharp(pageBuffer).toFile('public/debug-raw.png');
  process.exit(1);
}

// Crop to content + small padding
const pad = 40;
const cropLeft   = Math.max(0, minX - pad);
const cropTop    = Math.max(0, minY - pad);
const cropWidth  = Math.min(width  - cropLeft, maxX - minX + pad * 2);
const cropHeight = Math.min(height - cropTop,  maxY - minY + pad * 2);

const cropped = await sharp(pageBuffer)
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .toBuffer();

const croppedMeta = await sharp(cropped).metadata();
console.log(`Cropped: ${croppedMeta.width}×${croppedMeta.height}`);

// Upscale for HDR quality if needed
const TARGET_WIDTH = 4500;
const scale = TARGET_WIDTH / croppedMeta.width;
const upW = Math.round(croppedMeta.width * scale);
const upH = Math.round(croppedMeta.height * scale);

const upscaled = await sharp(cropped)
  .resize(upW, upH, { kernel: sharp.kernel.lanczos3 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Process: remove white bg, recolor to white
const { data: ud, info: ui } = upscaled;
const out = Buffer.alloc(ui.width * ui.height * 4);

for (let i = 0; i < ui.width * ui.height; i++) {
  const r = ud[i * ui.channels];
  const g = ud[i * ui.channels + 1];
  const b = ud[i * ui.channels + 2];

  const isWhiteBg = r > 235 && g > 235 && b > 235;

  if (isWhiteBg) {
    out[i * 4 + 3] = 0; // transparent
  } else {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const darkness = 1 - lum / 255;
    const alpha = Math.min(255, Math.round(darkness * 350));
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = Math.max(0, Math.min(255, alpha));
  }
}

await sharp(out, { raw: { width: ui.width, height: ui.height, channels: 4 } })
  .sharpen({ sigma: 1.0 })
  .png({ compressionLevel: 8 })
  .toFile(OUTPUT);

const finalMeta = await sharp(OUTPUT).metadata();
console.log(`\nDone → ${OUTPUT}`);
console.log(`Final: ${finalMeta.width}×${finalMeta.height}`);
