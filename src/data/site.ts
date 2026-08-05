/**
 * Zentrale Stammdaten für Belium Beauty.
 * Alle Kontakt-, Standort- und Metadaten werden hier gepflegt – kein Codeeingriff in Komponenten nötig.
 *
 * HINWEIS: Mit "PLATZHALTER" markierte Werte müssen vom Kunden bestätigt/nachgereicht werden.
 */

export const site = {
  name: 'Belium Beauty',
  legalName: 'Belium',
  owner: 'Maria Espejo Jimenez',
  tagline: 'Dauerhafte Laser Haarentfernung in Gelsenkirchen Buer',

  // Produktions-Domain – bei finalem Deployment prüfen
  url: 'https://www.belium.de',

  contact: {
    phone: '0209 36667488',
    phoneIntl: '+4920936667488', // für tel:-Links (Festnetz)
    mobile: '0178 1592194', // laut Altseite-Impressum
    fax: '0209 93890694',
    // WhatsApp läuft über die Mobilnummer (0178 1592194). Falls nicht WhatsApp-fähig, bitte korrigieren.
    whatsapp: '491781592194',
    email: 'info@belium.de', // auf der Altseite bestätigt
  },

  address: {
    street: 'Beckeradstraße 111',
    zip: '45897',
    city: 'Gelsenkirchen',
    district: 'Buer',
    country: 'DE',
    // Geokoordinaten Beckeradstraße 111, Gelsenkirchen (Näherung – vor Go-live final verifizieren)
    geo: { lat: 51.5776, lng: 7.0558 },
    // Google-Maps-Link (Adresssuche, wird erst nach Einwilligung geladen)
    mapsQuery: 'Belium+Beauty+Beckeradstra%C3%9Fe+111+45897+Gelsenkirchen',
  },

  // Öffnungszeiten: PLATZHALTER – von der Altseite nicht eindeutig übernehmbar.
  // Bitte echte Zeiten bestätigen. Struktur für JSON-LD (openingHoursSpecification) vorbereitet.
  openingHours: [
    { day: 'Montag', short: 'Mo', hours: 'nach Vereinbarung', from: null, to: null },
    { day: 'Dienstag', short: 'Di', hours: 'nach Vereinbarung', from: null, to: null },
    { day: 'Mittwoch', short: 'Mi', hours: 'nach Vereinbarung', from: null, to: null },
    { day: 'Donnerstag', short: 'Do', hours: 'nach Vereinbarung', from: null, to: null },
    { day: 'Freitag', short: 'Fr', hours: 'nach Vereinbarung', from: null, to: null },
    { day: 'Samstag', short: 'Sa', hours: 'nach Vereinbarung', from: null, to: null },
    { day: 'Sonntag', short: 'So', hours: 'geschlossen', from: null, to: null },
  ],
  openingHoursNote: 'Termine ausschließlich nach Vereinbarung. (Öffnungszeiten sind Platzhalter – bitte bestätigen.)',

  social: {
    facebook: 'https://facebook.com/Beliumbeautybymaria/',
    instagram: 'https://instagram.com/beliumbeautybymaria/',
  },

  // Link zum Google-Unternehmensprofil / zu den Google-Bewertungen (für den Trust-Effekt im Hero).
  // TODO: Sobald das Profil final steht, hier die direkte Profil-URL eintragen. Bewusst OHNE
  // erfundene Sternebewertung/Anzahl – erst mit echten, freigegebenen Zahlen ergänzen.
  googleReviewUrl: 'https://www.google.com/maps/search/?api=1&query=Belium+Beauty+Gelsenkirchen+Buer',

  // Preisspanne für JSON-LD priceRange (grobe Einordnung, keine konkreten Preise)
  priceRange: '€€',

  // Buchungssystem: austauschbar. Sobald ein Tool (Shore, Treatwell, Calendly) eingehängt wird,
  // hier die URL eintragen; ist sie leer, greift das interne Kontaktformular.
  bookingUrl: '', // PLATZHALTER – z. B. Calendly/Shore/Treatwell-Link

  // Cloudflare Turnstile Site-Key (öffentlich). Leer lassen => Widget wird nicht gerendert,
  // nur Honeypot ist aktiv. Secret-Key gehört in die Pages-Function-Umgebungsvariable.
  turnstileSiteKey: '', // PLATZHALTER
} as const;

// Vorbelegter WhatsApp-Text (URL-encodiert im Link zusammengesetzt)
export const whatsappDefaultText =
  'Hallo Belium Beauty, ich interessiere mich für eine dauerhafte Laser Haarentfernung und hätte gerne einen Beratungstermin.';

export function whatsappLink(text: string = whatsappDefaultText): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function telLink(): string {
  return `tel:${site.contact.phoneIntl}`;
}
