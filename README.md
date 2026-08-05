# Belium Beauty – Onepage

Konversionsoptimierte Onepage für **Belium Beauty**, Studio für dauerhafte Laser Haarentfernung mit
Diodenlaser in **Gelsenkirchen Buer**. Gebaut mit Astro, Tailwind CSS und Cloudflare Pages.

## Schnellstart

```bash
npm install
npm run dev        # http://localhost:4321
```

## Befehle

| Befehl | Wirkung |
|---|---|
| `npm run dev` | Dev-Server mit Hot Reload |
| `npm run build` | Produktionsbuild nach `dist/` |
| `npm run preview` | `dist/` lokal ansehen |
| `node scripts/gen-assets.mjs` | OG-Bild und Apple-Touch-Icon neu erzeugen |

## Wo pflege ich was?

- **Texte, Adresse, Kontakt, Öffnungszeiten:** `src/data/site.ts`
- **Behandlungszonen & Preise:** `src/data/zonen.ts`
- **FAQ:** `src/data/faq.ts`
- **Vorteile / Ablauf / Ausschlusskriterien:** `src/data/vorteile.ts`, `ablauf.ts`, `inhalt.ts`
- **Design (Farben, Schrift, Buttons):** `src/styles/global.css`

Details, Deploy-Anleitung und offene Punkte stehen in [`CLAUDE.md`](./CLAUDE.md).

## Deployment (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Pages Functions unter `functions/` werden automatisch erkannt (Formularversand `/api/lead`).
- Umgebungsvariablen für Formularzustellung und Spam-Schutz: siehe `CLAUDE.md`.

## Struktur

Onepage mit 14 Ankerabschnitten (Hero, Problem, Vorteile, Zonen & Preise, Ablauf, Technologie,
Ergebnisse, Über Maria, Räumlichkeiten, Bewertungen, FAQ, Sicherheit, Kontakt, Abschluss-CTA) plus
Rechtsseiten `impressum.astro` und `datenschutz.astro`.

## Hinweise

- Schriften sind lokal eingebunden (kein Google Fonts CDN).
- Karten, Bewertungen und Tracking laden erst nach Einwilligung (Consent-Banner).
- Preise, Öffnungszeiten und Vorher-Nachher-Bilder sind aktuell **Platzhalter** – siehe offene Punkte
  in `CLAUDE.md`.
