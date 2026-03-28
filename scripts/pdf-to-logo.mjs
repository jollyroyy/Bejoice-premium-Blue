import { createCanvas } from 'canvas';
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_PATH = 'C:/Users/ASUS/Downloads/BEJOICE GROUP OF COMPANIES LOGO.pdf';
const OUTPUT   = path.join(__dirname, '../public/bejoice-logo-white.png');

// Load pdfjs
const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

const pdfData = new Uint8Array(await readFile(PDF_PATH));
const loadingTask = pdfjsLib.getDocument({ data: pdfData, useSystemFonts: true });
const pdf = await loadingTask.promise;
const page = await pdf.getPage(1);

// Render at 8x scale for HDR quality
const SCALE = 8;
const viewport = page.getViewport({ scale: SCALE });
const canvas = createCanvas(viewport.width, viewport.height);
const ctx = canvas.getContext('2d');

// White background fill
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

await page.render({
  canvasContext: ctx,
  viewport,
  // node-canvas doesn't support NodeCanvasFactory but defaults work
}).promise;

const pngBuffer = canvas.toBuffer('image/png');
console.log(`Rendered PDF at ${canvas.width}×${canvas.height}`);

// Now process: remove white bg, recolor to white, keep full image
const { data, info } = await sharp(pngBuffer)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const out = Buffer.alloc(width * height * 4);

for (let i = 0; i < width * height; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];

  // White/near-white → transparent
  const isWhiteBg = r > 235 && g > 235 && b > 235;

  if (isWhiteBg) {
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = 0;
  } else {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const darkness = 1 - lum / 255;
    const alpha = Math.min(255, Math.round(darkness * 340));
    out[i * 4]     = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = Math.max(0, Math.min(255, alpha));
  }
}

// Trim transparent border, then save
await sharp(out, { raw: { width, height, channels: 4 } })
  .trim({ threshold: 2 })   // remove empty transparent edges
  .sharpen({ sigma: 1.0 })
  .png({ compressionLevel: 8 })
  .toFile(OUTPUT);

const meta = await sharp(OUTPUT).metadata();
console.log(`Done → ${OUTPUT}  (${meta.width}×${meta.height})`);
