# CLAUDE.md – Belium Beauty Onepage

Kontext und Arbeitsanweisungen für dieses Repository.

## Projektziel
Konversionsoptimierte Onepage für **Belium Beauty**, ein Studio für dauerhafte Laser Haarentfernung
mit Diodenlaser in **Gelsenkirchen Buer**. Ziel der Seite: Termine erzeugen (Leads), nicht nur
informieren. Sie ersetzt die alte, reine Info-Seite (belium.de) mit klaren CTAs, dem
Kontaktformular als einzigem Conversion-Punkt, lokalem SEO und rechtlicher Absicherung.
**Es gibt bewusst keinen Preisrechner und keine Preisangaben auf der Seite** – Preise werden
ausschließlich persönlich in der kostenlosen Beratung genannt.

## Tech Stack
- **Astro 5** (statischer Output), **Tailwind CSS v4** (über `@tailwindcss/vite`)
- **@astrojs/sitemap** für `sitemap-index.xml`
- Bildoptimierung via Astros `<Image>` (Sharp) → AVIF, responsive `srcset`
- Schriften **lokal** über `@fontsource` (Cormorant Garamond Display, Mulish Body) – **kein Google CDN**
- Interaktivität als leichtgewichtiges Vanilla JS in `<script>`-Blöcken (kein React, keine Islands-Frameworks)
- **Cloudflare Pages** Hosting; Formularversand über eine **Pages Function** unter `functions/api/lead.ts`

## Verzeichnisstruktur
```
├── astro.config.mjs          # Astro-Konfig (site-URL, sitemap, tailwind)
├── functions/api/lead.ts     # Cloudflare Pages Function: Formular-/Lead-Verarbeitung + Mailversand
├── .dev.vars.example         # Vorlage für lokale Mail-Zugangsdaten (.dev.vars ist gitignored)
├── public/                   # statische Assets (robots.txt, favicon, og-image, apple-touch-icon)
├── scripts/
│   ├── gen-assets.mjs        # erzeugt OG-Bild + apple-touch-icon (manuell auszuführen)
│   ├── screenshots.mjs       # Playwright-Screenshots der Breakpoints
│   ├── smtp-test.mjs         # Testmail verschicken (npm run mail:test)
│   └── _cf-sockets-*.mjs     # Node-Nachbau von cloudflare:sockets, nur für den Mailtest
├── docs/
│   ├── keyword-research.md   # Ergebnis der Keyword-Recherche
│   ├── mailversand.md        # >>> Anleitung: Mailversand über IONOS einrichten <<<
│   └── screenshots/          # Responsive-Screenshots (375/768/1024/1440/1920)
└── src/
    ├── assets/images/        # Quellbilder (werden zur Build-Zeit optimiert)
    ├── components/
    │   ├── Icon.astro         # Inline-SVG-Icons (kein Icon-Font)
    │   ├── BaseHead.astro     # SEO-Meta, OG, Twitter, Canonical
    │   ├── JsonLd.astro       # LocalBusiness/HealthAndBeautyBusiness, FAQPage, BreadcrumbList
    │   ├── Header.astro, Footer.astro, StickyCta.astro, ConsentBanner.astro, LeadForm.astro
    │   └── sections/          # die 14 Seitenabschnitte
    ├── data/                  # >>> HIER werden Inhalte & Preise gepflegt <<<
    ├── layouts/               # Layout.astro (Basis), LegalLayout.astro (Rechtsseiten)
    ├── pages/                 # index.astro, impressum.astro, datenschutz.astro
    ├── server/smtp.ts         # SMTP-Client für die Cloudflare-Laufzeit (nur serverseitig)
    └── styles/global.css      # Design-System (Farben, Typo, Buttons) via Tailwind @theme
```

## Inhalte & Preise pflegen (ohne Codeeingriff)
Alle redaktionellen Inhalte liegen in **`src/data/`**:
- `site.ts` – Stammdaten: Adresse, Telefon, WhatsApp, E-Mail, Öffnungszeiten, Social, Buchungs-URL, Turnstile-Key
- `faq.ts` – FAQ (wird auch im FAQPage-Schema gespiegelt)
- `vorteile.ts`, `ablauf.ts`, `inhalt.ts` – Vorteile, Ablaufschritte, Ausschlusskriterien, Technik,
  Navigation und die Zonenliste (`wunschzonen`) für das Dropdown im Kontaktformular

## Build & Deploy
```bash
npm install         # Abhängigkeiten
npm run dev         # lokaler Dev-Server (http://localhost:4321)
npm run build       # Produktionsbuild nach dist/
npm run preview     # dist/ lokal ansehen
npm run mail:test   # Testmail über die SMTP-Zugangsdaten aus .dev.vars verschicken
node scripts/gen-assets.mjs   # OG-Bild + Icon neu erzeugen (nur bei Bedarf)
npm run design:setup          # Impeccable Design-Skill lokal installieren (nach .claude/skills/)
```

### Design-Skill (Impeccable)
Für UI-/Frontend-Aufgaben ist der [Impeccable](https://impeccable.style)-Skill vorgesehen
(Design-Kritik, Polish, Anti-Pattern-Erkennung, Live-Iteration). Er wird **lokal** installiert und
ist **nicht Teil des Repos** – `.claude/skills/` bleibt bewusst in `.gitignore`. Einrichten mit
`npm run design:setup` (bzw. `npx impeccable install --providers=claude --scope=project`), danach
`/impeccable init` im Harness ausführen. Aktualisieren: `npx impeccable update`.

### Cloudflare Pages
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Functions:** werden automatisch aus `functions/` erkannt (kein Adapter nötig).
- **Compatibility date:** mindestens `2023-08-01` (der Mailversand nutzt `cloudflare:sockets`).
- **Environment variables** (im Pages-Dashboard setzen, für Formularzustellung):
  - `TURNSTILE_SECRET_KEY` – Cloudflare-Turnstile Secret (Site-Key zusätzlich in `src/data/site.ts`)
  - Zustellung, eine der drei Varianten (die erste vollständig konfigurierte gewinnt):
    1. **SMTP (aktiv, IONOS):** `SMTP_HOST` = `smtp.ionos.de`, `SMTP_PORT` = `587`,
       `SMTP_USER` = `info@belium.de`, `SMTP_PASS` (als **Secret**), dazu `LEAD_TO_EMAIL`,
       `LEAD_FROM_EMAIL`, `LEAD_FROM_NAME`. Optional `SMTP_SECURE=tls` für Port 465.
    2. `RESEND_API_KEY` + `LEAD_TO_EMAIL` + `LEAD_FROM_EMAIL` (E-Mail via Resend)
    3. `LEAD_WEBHOOK_URL` (POST als JSON, z. B. Make/Zapier)
  - Ohne Zustellkanal läuft die Function im **Demo-Modus** (Anfrage wird angenommen, aber nicht zugestellt).

### Mailversand
Vollständige Anleitung inklusive IONOS-Werten, Fehlertabelle und lokalem Test:
**[`docs/mailversand.md`](./docs/mailversand.md)**. Kurzfassung:
- Der SMTP-Dialog läuft in `src/server/smtp.ts` direkt über `cloudflare:sockets`
  (STARTTLS auf 587, direktes TLS auf 465). In Workers gibt es kein `nodemailer`.
- Absender muss das authentifizierte IONOS-Postfach sein, die Adresse der Interessentin steht
  im `Reply-To`. Betreff: `Neue Anfrage über belium.de: <Name>`.
- Vor dem Deploy testen: `.dev.vars` aus `.dev.vars.example` anlegen, dann `npm run mail:test`.
  Der Test fährt denselben Client unter Node, `.dev.vars` gehört nie ins Repo.

## Conversion & Tracking
- Primär-CTA: Terminanfrage über `LeadForm` (→ `/api/lead`). Sekundär: WhatsApp mit vorbelegtem Text.
- Buchungssystem ist austauschbar: `site.bookingUrl` setzen, um später Calendly/Shore/Treatwell einzuhängen.
- Tracking ist **vorbereitet, nicht scharf**: `window.trackEvent(name, detail)` schreibt in `window.dataLayer`.
  Events: `formular_absenden`, `whatsapp_klick`,
  `telefon_klick` (+ CTA-Klicks). Es werden **keine** externen Pixel automatisch geladen.
- Consent-Banner (`ConsentBanner.astro`) lädt vor Einwilligung nichts Externes. Karte & Bewertungen
  hören auf das Event `belium:consent`.
- **Kein dauerhaft sichtbares Cookie-Widget** auf der Seite: Es gibt ausschließlich den
  Consent-Dialog beim Seitenaufruf (mit Skriptblockierung). Der Widerruf läuft über den Link
  „Cookie-Einstellungen" im Footer, der `window.openConsent()` aufruft.

## Wichtige Regeln
- **HWG-konform:** „schmerzarm" statt „schmerzfrei", „dauerhafte Haarreduktion" statt Erfolgsgarantien.
- **Genau ein H1** pro Seite; Abschnitte starten mit H2, Unterpunkte H3.
- Keine erfundenen Preise, Bewertungszahlen oder Erfahrungsberichte – Platzhalter sind markiert (siehe unten).
- Bild-Dateinamen ohne Umlaute/Leerzeichen; Alt-Texte mit echten Umlauten.
- **Kein Herstellername** für das Gerät (kein „VIKINI") – nur „Diodenlaser" schreiben.
- Sitzungsanzahl einheitlich: **in der Regel 7–10 Behandlungen**.
- **Keine Preise auf der Seite** und kein Preisrechner. Einziger Conversion-Punkt ist das
  Kontaktformular im Abschnitt `#kontakt`.

## Offene Punkte / vom Kunden nachzureichen
- [ ] **Öffnungszeiten** in `src/data/site.ts` (aktuell „nach Vereinbarung", Platzhalter). Auch für Schema.
- [ ] **WhatsApp-Nummer** bestätigen (aktuell Mobil 0178 1592194 aus Alt-Impressum).
- [ ] **Steuernummer vs. USt-IdNr** klären: 319/5148/5608 ist dem Format nach eine **Steuernummer**,
      auf der Altseite fälschlich als „USt-IdNr" geführt. Im Impressum als Steuernummer ausgewiesen.
- [ ] **Vorher-Nachher-Fotos** (mit Zone + Sitzungsanzahl) liefern → `inhalt.ts` `ergebnisseVorhanden = true`.
- [ ] **Google-/ProvenExpert-Widget-IDs** für den Bewertungsabschnitt (optional – der Abschnitt
      zeigt inzwischen echte, wörtlich übernommene Google-Rezensionen aus `src/data/reviews.ts`).
- [ ] **SMTP-Zugangsdaten** (IONOS-Postfach `info@belium.de`) als Umgebungsvariablen in Cloudflare
      Pages hinterlegen, `SMTP_PASS` als Secret. Code ist fertig, siehe `docs/mailversand.md`.
      Danach einmal neu deployen und eine Testanfrage über das Formular schicken.
- [ ] **Turnstile-Key** (Site-Key in `src/data/site.ts`, Secret in Cloudflare) setzen.
- [ ] **Geokoordinaten** im `site.ts` final verifizieren (aktuell Näherung).
- [ ] Datenschutzerklärung & Impressum rechtlich final prüfen lassen.
- [ ] Finale **Domain** in `astro.config.mjs` (`SITE`) bestätigen.
