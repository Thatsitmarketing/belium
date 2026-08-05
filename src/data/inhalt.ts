/**
 * Weitere Textbausteine (Ausschlusskriterien, Technologie, Ergebnisse, Navigation).
 * Zentrale Pflege ohne Codeeingriff.
 */

/** Ausschlusskriterien (Abschnitt 12): Wann eine Behandlung nicht sinnvoll ist. Baut Vertrauen. */
export const ausschlussKriterien: { titel: string; text: string }[] = [
  {
    titel: 'Blonde, graue und weiße Haare',
    text: 'Ohne Farbpigment findet der Laser kein Ziel. Bei diesen Haarfarben verzichten wir auf ein Versprechen, das wir nicht halten können.',
  },
  {
    titel: 'Schwangerschaft und Stillzeit',
    text: 'In dieser Zeit behandeln wir nicht. Die Haut reagiert hormonbedingt anders und die Datenlage ist nicht ausreichend.',
  },
  {
    titel: 'Frische Bräune oder Sonnenbrand',
    text: 'Stark gebräunte oder gereizte Haut wird nicht behandelt. Wir warten, bis die Haut ihren natürlichen Zustand zurück hat.',
  },
  {
    titel: 'Bestimmte Hauterkrankungen und Medikamente',
    text: 'Akute Hautprobleme in der Zone, lichtempfindliche Medikamente oder bestimmte Vorerkrankungen können gegen eine Behandlung sprechen. Das klären wir vorher offen im Gespräch.',
  },
  {
    titel: 'Tattoos in der Behandlungszone',
    text: 'Über tätowierte Haut lasern wir nicht. Wir sparen den Bereich aus oder finden gemeinsam eine Alternative.',
  },
  {
    titel: 'Frische Reizungen, offene Stellen, Muttermale',
    text: 'Verletzte Haut und auffällige Muttermale werden ausgespart. Deine Hautgesundheit hat Vorrang vor dem Ergebnis.',
  },
];

/** Technologie-Fakten (Abschnitt 6), kurz als Beweis positioniert. */
export const technikFakten: { label: string; wert: string }[] = [
  { label: 'Gerät', wert: 'VIKINI Multiplus Diodenlaser' },
  { label: 'Wellenlänge', wert: '808 nm (940 nm optional)' },
  { label: 'Kühlung', wert: 'Saphir-Kontaktkühlung' },
  { label: 'Spotgröße', wert: '12 × 11 mm' },
  { label: 'Taktfrequenz', wert: 'bis 10 Hz' },
];

/**
 * Vorher-Nachher-Ergebnisse (Abschnitt 7).
 * PLATZHALTER: Es liegt noch kein echtes Bildmaterial mit Zone/Sitzungsangabe vor.
 * Sobald echte Fotos vorhanden sind, hier eintragen und in der Galerie einbinden.
 */
export const ergebnisseVorhanden = false;
export const ergebnissePlatzhalter: { zone: string; sitzungen: string }[] = [
  { zone: 'Achseln', sitzungen: 'z. B. nach 6 Sitzungen' },
  { zone: 'Bikinizone', sitzungen: 'z. B. nach 8 Sitzungen' },
  { zone: 'Rücken (Herren)', sitzungen: 'z. B. nach 6 Sitzungen' },
];

/** Ankernavigation (Abschnitt-IDs müssen mit den Sektionen übereinstimmen). */
export const navItems: { href: string; label: string }[] = [
  { href: '#vorteile', label: 'Vorteile' },
  { href: '#ueber-maria', label: 'Über Maria' },
  { href: '#ablauf', label: 'Ablauf' },
  { href: '#preise', label: 'Preise' },
  { href: '#faq', label: 'FAQ' },
  { href: '#kontakt', label: 'Kontakt' },
];
