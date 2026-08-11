# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primär **Frauen** aus Gelsenkirchen Buer und dem näheren Umland (Ruhrgebiet),
die dauerhaft störende Körperbehaarung reduzieren möchten und eine seriöse,
gut erreichbare Anlaufstelle vor Ort suchen. Sie informieren sich meist mobil,
vergleichen Studios und wollen vor der Buchung Vertrauen fassen (Ablauf,
Eignung, Preisrahmen, Ansprechpartnerin). Männer sind ausdrückliche
Nebenzielgruppe – der Zonenwähler führt Damen- und Herrenzonen.

## Product Purpose

Konversionsoptimierte Onepage für **Belium Beauty**, ein Studio für dauerhafte
Laser-Haarentfernung mit Diodenlaser in Gelsenkirchen Buer. Die Seite ersetzt
die alte, reine Info-Seite und hat ein klares Ziel: **Terminanfragen (Leads)
erzeugen**, nicht nur informieren. Erfolg = qualifizierte Beratungsanfragen über
Formular, WhatsApp und Telefon.

## Positioning

**Persönliche Behandlung durch die Inhaberin Maria Espejo Jimenez.** Kein
anonymes Kettenstudio: eine feste, fachkundige Ansprechpartnerin, die persönlich
behandelt und individuell betreut. Verstärkt durch einen bewusst ehrlichen,
HWG-konformen Auftritt (keine Erfolgsgarantien, offen kommunizierte
Ausschlusskriterien) – Vertrauen statt Marketing-Versprechen.

## Operating Context

Nutzer landen überwiegend mobil über Suche/Social auf der Onepage, scrollen
durch 14 Ankerabschnitte (Hero, Problem, Vorteile, Zonen & Preise, Ablauf,
Technologie, Ergebnisse, Über Maria, Räumlichkeiten, Bewertungen, FAQ,
Sicherheit, Kontakt, Abschluss-CTA) und lösen eine Anfrage aus. Termine laufen
ausschließlich nach Vereinbarung. Primär-CTA ist das Lead-Formular
(`/api/lead`), sekundär WhatsApp mit vorbelegtem Text sowie Telefon.

## Capabilities and Constraints

- **Tech:** Astro 5 (statischer Output), Tailwind CSS v4, Bildoptimierung via
  Astro `<Image>` (AVIF/srcset), lokale Schriften über `@fontsource`
  (kein Google-CDN), leichte Vanilla-JS-Interaktivität (kein React/Islands).
- **Hosting/Formular:** Cloudflare Pages; Leadversand über Pages Function
  `functions/api/lead.ts` (Resend **oder** Webhook; ohne Kanal Demo-Modus).
  Spam-Schutz via Cloudflare Turnstile + Honeypot.
- **SEO/Recht:** genau **ein H1** pro Seite, Abschnitte ab H2; JSON-LD
  (LocalBusiness/HealthAndBeautyBusiness, FAQPage, BreadcrumbList); Rechtsseiten
  Impressum & Datenschutz.
- **Consent:** Karte, Bewertungen und Tracking laden erst nach Einwilligung
  (Consent-Banner, Event `belium:consent`); vor Einwilligung nichts Externes.
- **Tracking:** vorbereitet, nicht scharf (`window.trackEvent` → `dataLayer`),
  keine automatisch geladenen Pixel.
- **Inhaltspflege:** redaktionelle Inhalte & Preise in `src/data/` ohne
  Codeeingriff (`site.ts`, `zonen.ts`, `faq.ts`, `vorteile.ts`, `ablauf.ts`,
  `inhalt.ts`).

## Brand Commitments

- **Name/Marke:** Belium Beauty; Inhaberin Maria Espejo Jimenez; Social
  „beliumbeautybymaria" (Instagram/Facebook).
- **HWG-Konformität ist bindend:** „schmerzarm" statt „schmerzfrei",
  „dauerhafte Haarreduktion" statt Erfolgsgarantien.
- **Keine erfundenen Fakten:** keine erfundenen Preise, Bewertungszahlen oder
  Erfahrungsberichte – Platzhalter bleiben als solche markiert.
- **Bildkonvention:** Datei­namen ohne Umlaute/Leerzeichen; Alt-Texte mit echten
  Umlauten.

## Evidence on Hand

- **Gerät/Technik (real):** Diodenlaser, 808 nm (940 nm optional),
  Saphir-Kontaktkühlung, Spotgröße 12 × 11 mm, bis 10 Hz.
  **Kundenvorgabe:** Der Herstellername (VIKINI) wird auf der Seite nicht genannt –
  nur „Diodenlaser" schreiben.
- **Standort (real):** Beckeradstraße 111, 45897 Gelsenkirchen (Buer).
- **Kontakt (real):** Festnetz 0209 36667488, E-Mail info@belium.de.
- **Noch ausstehend – NICHT erfinden:** echte Preise (aktuell `placeholder: true`
  in `zonen.ts`), verbindliche Öffnungszeiten, WhatsApp-Nummer-Bestätigung,
  Vorher-Nachher-Fotos (`ergebnisseVorhanden = false`), Google-/ProvenExpert-
  Bewertungs-Widget-IDs und -Zahlen, finale Geokoordinaten, finale Domain.

## Product Principles

1. **Termin vor Information:** jeder Abschnitt zahlt auf eine Anfrage ein; CTAs
   (Formular, WhatsApp, Telefon) sind nie weit entfernt.
2. **Vertrauen durch Ehrlichkeit:** Eignung, Grenzen und Ausschlusskriterien
   offen benennen – das ist Verkaufsargument, kein Kleingedrucktes.
3. **Maria ist das Gesicht:** persönliche, fachkundige Betreuung sichtbar machen.
4. **Lokal verankert:** Gelsenkirchen Buer als klares Signal für Nähe und
   Erreichbarkeit.
5. **Nur echte Aussagen:** Platzhalter bleiben markiert, bis der Kunde reale
   Daten liefert.

## Accessibility & Inclusion

Semantische Überschriftenhierarchie (ein H1, dann H2/H3), aussagekräftige
Alt-Texte mit echten Umlauten, Consent-first (kein externes Laden ohne
Einwilligung). Zielbild: gut bedienbar auf Mobilgeräten, ausreichende Kontraste
und Fokuszustände für Formular und Navigation.
