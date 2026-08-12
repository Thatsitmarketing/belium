/**
 * Kundenstimmen (Abschnitt „Bewertungen").
 *
 * Dies sind ECHTE, öffentlich auf dem Google-Unternehmensprofil von Belium Beauty
 * veröffentlichte Rezensionen – wörtlich übernommen, inklusive Schreibweise. Sie dürfen
 * NICHT umformuliert werden: eine geänderte Bewertung ist keine echte Bewertung mehr
 * (Irreführung, §5 UWG).
 *
 * Neue Stimmen bitte ebenfalls nur wörtlich und nur aus dem echten Profil ergänzen.
 * Erfundene oder „geglättete" Texte sind hier nicht zulässig.
 *
 * HINWEIS zur ersten Stimme: Die Kundin schreibt selbst „Schmerzfreie Laserhaarentfernung".
 * Werbung mit „schmerzfrei" ist im HWG-Kontext heikel – der Text steht hier bewusst
 * unverändert als Zitat der Kundin. Wenn die rechtliche Prüfung das anders bewertet,
 * die Stimme bitte KOMPLETT entfernen statt sie umzuschreiben.
 */
export const reviewsPlatzhalter = false;

export type Review = {
  name: string;
  /** Quelle/Einordnung der Stimme, erscheint klein unter dem Namen */
  quelle: string;
  text: string;
  /** 1–5, fuer die Sternanzeige */
  stars: number;
};

export const reviews: Review[] = [
  {
    name: 'Ninethavone Jagusch',
    quelle: 'Rezension auf Google',
    stars: 5,
    text: 'Ich war sehr zufrieden, die Besitzerin ist sehr nett und vorsichtig, Studio ist top und hygienisch sauber! Alles professionell und mit gutem Gewissen empfehlenswert!!!',
  },
  {
    name: 'Puri Feria',
    quelle: 'Rezension auf Google',
    stars: 5,
    text: 'Sehr nette und kompetente Beratung! Sicherlich die beste Methode für eine schnelle und nachhaltige Haarentfernung.',
  },
  {
    name: 'Nadi My',
    quelle: 'Rezension auf Google',
    stars: 5,
    text: 'Schmerzfreie Laserhaarentfernung in wirklich gemütlichen und sauber gepflegten Studio. Die Besitzerin ist sehr freundlich und sorgt gut für das Wohl ihrer Kunden.',
  },
  {
    name: 'Manoli Espejo Jimenez',
    quelle: 'Rezension auf Google',
    stars: 5,
    text: 'Sehr professionell, Top zufrieden, freundlich, empfehlenswert.',
  },
];
