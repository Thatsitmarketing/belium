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
| `npm run mail:test` | Testmail über die SMTP-Zugangsdaten aus `.dev.vars` verschicken |
| `node scripts/gen-assets.mjs` | OG-Bild und Apple-Touch-Icon neu erzeugen |
| `npm run design:setup` | Impeccable Design-Skill lokal installieren (siehe unten) |

## Wo pflege ich was?

- **Texte, Adresse, Kontakt, Öffnungszeiten:** `src/data/site.ts`
- **Behandlungszonen (Dropdown im Kontaktformular):** `wunschzonen` in `src/data/inhalt.ts`
  (bewusst ohne Preise – die Seite zeigt keine Preise)
- **FAQ:** `src/data/faq.ts`
- **Vorteile / Ablauf / Ausschlusskriterien:** `src/data/vorteile.ts`, `ablauf.ts`, `inhalt.ts`
- **Design (Farben, Schrift, Buttons):** `src/styles/global.css`

Details, Deploy-Anleitung und offene Punkte stehen in [`CLAUDE.md`](./CLAUDE.md).

## Deployment (Cloudflare Pages)

- Build command: `npm run build`
- Output directory: `dist`
- Pages Functions unter `functions/` werden automatisch erkannt (Formularversand `/api/lead`).
- Compatibility date mindestens `2023-08-01` (der Mailversand nutzt `cloudflare:sockets`).
- Umgebungsvariablen für Formularzustellung und Spam-Schutz: siehe `CLAUDE.md`.

## Mailversand

Anfragen aus dem Kontaktformular gehen per SMTP über das IONOS Postfach an `info@belium.de`.
Einzurichten sind nur die Umgebungsvariablen in Cloudflare Pages, der Code ist fertig.
Schritt für Schritt inklusive Fehlertabelle: **[`docs/mailversand.md`](./docs/mailversand.md)**.

Vor dem Deploy lokal testen:

```bash
cp .dev.vars.example .dev.vars   # echte Zugangsdaten eintragen, Datei ist gitignored
npm run mail:test
```

## Struktur

Onepage mit 14 Ankerabschnitten (Hero, Problem, Vorteile, Zonen & Preise, Ablauf, Technologie,
Ergebnisse, Über Maria, Räumlichkeiten, Bewertungen, FAQ, Sicherheit, Kontakt, Abschluss-CTA) plus
Rechtsseiten `impressum.astro` und `datenschutz.astro`.

## Design-Skill (Impeccable)

Für Frontend-/UI-Arbeit steht der [Impeccable](https://impeccable.style)-Skill für Claude Code
bereit (Design-Kritik, Polish, Anti-Pattern-Erkennung u. a.). Der Skill wird **lokal** installiert
und ist bewusst **nicht Teil des Repos** (`.claude/skills/` ist in `.gitignore`).

```bash
npm run design:setup     # installiert nach .claude/skills/impeccable (Provider: claude, Scope: project)
# danach im Claude-Code-Harness:  /impeccable init
```

Aktualisieren mit `npx impeccable update`. Details unter [impeccable.style](https://impeccable.style).

## Hinweise

- Schriften sind lokal eingebunden (kein Google Fonts CDN).
- Karten, Bewertungen und Tracking laden erst nach Einwilligung (Consent-Banner).
- Preise, Öffnungszeiten und Vorher-Nachher-Bilder sind aktuell **Platzhalter** – siehe offene Punkte
  in `CLAUDE.md`.
