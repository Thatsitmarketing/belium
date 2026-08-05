/**
 * Generiert statische Bildassets aus SVG-Vorlagen:
 *  - public/og-belium-beauty.jpg  (1200x630 Open-Graph-Bild)
 *  - public/apple-touch-icon.png  (180x180)
 * Ausführen mit:  node scripts/gen-assets.mjs
 * (Läuft nicht automatisch im Build – die erzeugten Dateien werden eingecheckt.)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f0e6"/>
      <stop offset="1" stop-color="#e9ddc9"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.15" cy="0.1" r="0.9">
      <stop offset="0" stop-color="#cbb583" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#cbb583" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="1200" height="12" fill="#b3934f"/>
  <text x="80" y="200" font-family="Georgia, serif" font-size="64" font-weight="700" fill="#2c261f">Belium</text>
  <text x="82" y="240" font-family="Arial, sans-serif" font-size="24" font-weight="700" letter-spacing="8" fill="#997c3f">B E A U T Y</text>
  <text x="80" y="360" font-family="Georgia, serif" font-size="58" font-weight="700" fill="#2c261f">Dauerhaft glatte Haut.</text>
  <text x="80" y="430" font-family="Georgia, serif" font-size="58" font-weight="700" fill="#b3934f">Laser Haarentfernung.</text>
  <text x="80" y="510" font-family="Arial, sans-serif" font-size="30" fill="#4a4136">Gekühlter VIKINI Diodenlaser · Gelsenkirchen Buer</text>
</svg>`;

const icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="40" fill="#2c261f"/>
  <text x="90" y="126" font-family="Georgia, serif" font-size="112" font-weight="700" text-anchor="middle" fill="#cbb583">B</text>
</svg>`;

await sharp(Buffer.from(og)).jpeg({ quality: 82 }).toFile(join(pub, 'og-belium-beauty.jpg'));
await sharp(Buffer.from(icon)).png().toFile(join(pub, 'apple-touch-icon.png'));
console.log('Assets erzeugt: og-belium-beauty.jpg, apple-touch-icon.png');
