import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT = path.join(__dirname, '../public/bejoice-logo-white.png');
const OUTPUT = path.join(__dirname, '../public/bejoice-logo-white.png');

const meta = await sharp(INPUT).metadata();
const { width, height } = meta;

// Crop bottom ~22% to remove "GROUP OF COMPANIES" text
const cropHeight = Math.round(height * 0.78);

await sharp(INPUT)
  .extract({ left: 0, top: 0, width, height: cropHeight })
  .png({ compressionLevel: 8 })
  .toFile(OUTPUT + '.tmp.png');

// Overwrite original
import { rename } from 'fs/promises';
await rename(OUTPUT + '.tmp.png', OUTPUT);

console.log(`Cropped to ${width}×${cropHeight} (was ${width}×${height})`);
