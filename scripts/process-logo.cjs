const sharp = require('sharp');
const path = require('path');

const input  = path.join(__dirname, '../public/bejoice-logo-source.jpg');
const output = path.join(__dirname, '../src/assets/bejoice-logo-group.png');

sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    const out = Buffer.alloc(width * height * 4);

    for (let i = 0; i < width * height; i++) {
      const r = data[i * channels];
      const g = data[i * channels + 1];
      const b = data[i * channels + 2];

      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const sat  = maxC > 0 ? (maxC - minC) / maxC : 0;

      // Red dots (i/o in BEJOICE lettering)
      const isRed = r > 150 && g < 100 && b < 100;
      // White/near-white logo content (wings, text)
      const isLogo = lum > 175 && sat < 0.18;
      // Soft edge feather (anti-aliased boundary)
      const isEdge = lum > 110 && lum <= 175 && sat < 0.18;

      if (isRed) {
        out[i*4]=r; out[i*4+1]=g; out[i*4+2]=b; out[i*4+3]=255;
      } else if (isLogo) {
        out[i*4]=255; out[i*4+1]=255; out[i*4+2]=255; out[i*4+3]=255;
      } else if (isEdge) {
        const a = Math.round(((lum - 110) / 65) * 220);
        out[i*4]=255; out[i*4+1]=255; out[i*4+2]=255; out[i*4+3]=a;
      } else {
        out[i*4]=0; out[i*4+1]=0; out[i*4+2]=0; out[i*4+3]=0;
      }
    }

    return sharp(out, { raw: { width, height, channels: 4 } })
      .png({ compressionLevel: 6, quality: 100 })
      .toFile(output);
  })
  .then(() => console.log('Logo processed →', output))
  .catch(err => { console.error(err); process.exit(1); });
