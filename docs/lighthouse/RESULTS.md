# Lighthouse Ergebnisse

Gemessen lokal gegen den Produktionsbuild (`npm run build` + `astro preview`) mit Lighthouse 12,
Startseite `/`. Stand: August 2026.

| Kategorie | Mobil | Desktop |
|---|---|---|
| Performance | 99 | 100 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

## Core Web Vitals (Mobil)
- **LCP:** 1.8 s
- **CLS:** 0.001
- **TBT:** 0 ms
- **FCP:** 1.7 s

## Core Web Vitals (Desktop)
- **LCP:** 0.4 s
- **CLS:** 0.004
- **TBT:** 0 ms

Ziel laut Briefing (mobil >= 90 in Performance und SEO) ist deutlich erfuellt. Die Werte koennen
je nach Hosting-Umgebung leicht schwanken; auf Cloudflares CDN sind vergleichbare oder bessere
Ergebnisse zu erwarten.

> Reproduzieren: `npm run build && npm run preview`, dann in einem zweiten Terminal
> `CHROME_PATH=<chrome> npx lighthouse http://localhost:4321/ --view`.
