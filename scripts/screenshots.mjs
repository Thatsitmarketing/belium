import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.BASE || 'http://localhost:4321';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const widths = [375, 768, 1024, 1440, 1920];

const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  // Reveal-Elemente sichtbar machen (falls IntersectionObserver noch nicht ausgelöst hat)
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-visible')));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/home-${w}.png`, fullPage: true });
  // Viewport-Ausschnitt (oberer Bereich) für schnellen Blick
  await page.screenshot({ path: `${OUT}/hero-${w}.png`, fullPage: false });
  console.log('captured', w);
  await ctx.close();
}
await browser.close();
console.log('done');
