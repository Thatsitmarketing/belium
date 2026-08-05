/**
 * Kundenstimmen (Abschnitt „Bewertungen").
 *
 * ⚠️ PLATZHALTER: Dies sind BEISPIELHAFTE Stimmen, die ausschliesslich der Gestaltung dienen.
 * Vor dem Live-Gang zwingend durch ECHTE, freigegebene Bewertungen ersetzen – oder das
 * Google-/ProvenExpert-Widget einbinden (siehe Abschnitt-Fuss). Es duerfen KEINE erfundenen
 * Bewertungen veroeffentlicht werden (Irrefuehrung, §5 UWG). Formulierungen bewusst HWG-konform
 * (kein „schmerzfrei", keine Heilversprechen).
 *
 * Sobald echte Bewertungen vorliegen: `reviewsPlatzhalter = false` setzen und `reviews` fuellen.
 */
export const reviewsPlatzhalter = true;

export type Review = {
  name: string;
  /** Zone/Kontext der Behandlung */
  zone: string;
  text: string;
  /** 1–5, fuer die Sternanzeige */
  stars: number;
};

export const reviews: Review[] = [
  {
    name: 'Sabrina K.',
    zone: 'Achseln',
    stars: 5,
    text: 'Von Anfang an ehrlich beraten – kein Verkaufsdruck, sondern ein realistischer Plan. Die gekühlte Behandlung war für mich gut auszuhalten.',
  },
  {
    name: 'Melike D.',
    zone: 'Bikinizone',
    stars: 5,
    text: 'Sehr saubere, ruhige Atmosphäre und ein spürbar professioneller Ablauf. Man merkt, dass hier auf Sicherheit geachtet wird.',
  },
  {
    name: 'Jonas R.',
    zone: 'Rücken',
    stars: 5,
    text: 'Als Mann war ich erst skeptisch. Maria hat alles genau erklärt, die Zonen wurden zügig behandelt. Rundum angenehm.',
  },
  {
    name: 'Aylin T.',
    zone: 'Beine',
    stars: 5,
    text: 'Endlich Schluss mit dem ständigen Rasieren. Nach den ersten Sitzungen wächst deutlich weniger nach – ich bin sehr zufrieden.',
  },
  {
    name: 'Carolin S.',
    zone: 'Gesicht / Oberlippe',
    stars: 5,
    text: 'Feinfühlig und präzise auch im empfindlichen Gesichtsbereich. Die Beratung vorab hat mir jede Unsicherheit genommen.',
  },
  {
    name: 'Deniz A.',
    zone: 'Nacken',
    stars: 5,
    text: 'Termin schnell bekommen, freundlicher Empfang, transparente Preise. Ich fühle mich hier gut aufgehoben.',
  },
];
