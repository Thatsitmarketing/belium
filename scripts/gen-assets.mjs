/**
 * Generiert statische Bildassets:
 *  - public/og-belium-beauty.jpg  (1200x630 Open-Graph-Bild, aus SVG-Vorlage)
 *  - public/favicon.png           (512x512, transparent – Browser-Tab)
 *  - public/favicon-32.png        (32x32, scharf gerechnet für kleine Tabs)
 *  - public/apple-touch-icon.png  (180x180, mit Creme-Fläche – iOS ignoriert Transparenz)
 * Favicon-Quelle: src/assets/brand/belium-favicon-b.png (Marken-„B", schwarz auf transparent).
 * Ausführen mit:  node scripts/gen-assets.mjs
 * (Läuft nicht automatisch im Build – die erzeugten Dateien werden eingecheckt.)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
const markeB = join(root, 'src/assets/brand/belium-favicon-b.png');

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
  <text x="80" y="510" font-family="Arial, sans-serif" font-size="30" fill="#4a4136">Gekühlter Diodenlaser · Gelsenkirchen Buer</text>
</svg>`;

/**
 * Baut ein quadratisches Icon aus dem Marken-„B": freistellen (die Quelle sitzt leicht
 * ausserhalb der Mitte), gleichmässig einbetten und optional hinterlegen.
 * @param {number} groesse Kantenlänge in Pixeln
 * @param {number} luft    Anteil der Kantenlänge, der ringsum frei bleibt (0–0.4)
 * @param {string|null} hintergrund Füllfarbe, oder null für transparent
 */
async function icon(groesse, luft, hintergrund) {
  const innen = Math.round(groesse * (1 - 2 * luft));
  const glyphe = await sharp(markeB)
    .trim({ threshold: 1 })
    .resize(innen, innen, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  return sharp({
    create: {
      width: groesse, height: groesse, channels: 4,
      background: hintergrund ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: glyphe, gravity: 'centre' }])
    .png()
    .toBuffer();
}

await sharp(Buffer.from(og)).jpeg({ quality: 82 }).toFile(join(pub, 'og-belium-beauty.jpg'));
// Tab-Icon transparent, damit es sich in helle wie dunkle Browser-Oberflächen einfügt.
await sharp(await icon(512, 0.06, null)).toFile(join(pub, 'favicon.png'));
await sharp(await icon(32, 0.06, null)).toFile(join(pub, 'favicon-32.png'));
// iOS legt Icons auf Schwarz, wenn sie transparent sind -> feste Creme-Fläche.
await sharp(await icon(180, 0.2, '#f7f0e6')).toFile(join(pub, 'apple-touch-icon.png'));
console.log('Assets erzeugt: og-belium-beauty.jpg, favicon.png, favicon-32.png, apple-touch-icon.png');
