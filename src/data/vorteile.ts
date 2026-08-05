/**
 * Vorteile (Abschnitt 3). Die sechs Punkte der Altseite, in konkreten Nutzen übersetzt.
 * HWG-konform formuliert: "schmerzarm" statt "schmerzfrei", keine Heilversprechen.
 */

export type Vorteil = {
  /** Name eines Icons aus src/components/Icon.astro */
  icon: string;
  titel: string;
  text: string;
};

export const vorteile: Vorteil[] = [
  {
    icon: 'shield',
    titel: 'Zertifizierte Sicherheit',
    text: 'Behandelt wird von einer zertifizierten Laserschutzbeauftragten nach den geltenden Normen für Lasersicherheit. Deine Haut wird vorher eingeschätzt, die Geräteeinstellung individuell gewählt.',
  },
  {
    icon: 'snowflake',
    titel: 'Gekühlter Laserkopf',
    text: 'Die Saphirspitze kühlt die Haut im selben Moment, in dem der Laserimpuls wirkt. Statt Hitze spürst du meist nur ein kurzes, leichtes Zwicken.',
  },
  {
    icon: 'feather',
    titel: 'Schmerzarm statt Prozedur',
    text: 'Kein Wachs, kein Reißen, kein tagelanges Nachziehen. Viele empfinden die Sitzung als gut auszuhalten und deutlich angenehmer als Waxing.',
  },
  {
    icon: 'target',
    titel: 'Präzise auf jede Zone',
    text: 'Vom feinen Bereich an der Oberlippe bis zum großflächigen Rücken. Der Laserkopf wird für jede Körperregion passend eingestellt.',
  },
  {
    icon: 'leaf',
    titel: 'Schonend zur Haut',
    text: 'Die Energie zielt auf die Haarwurzel, nicht auf die Hautoberfläche. Nach der Sitzung kannst du in der Regel direkt in deinen Alltag zurück.',
  },
  {
    icon: 'sparkle',
    titel: 'Dauerhafte Haarreduktion',
    text: 'Nach einer abgeschlossenen Behandlungsreihe wächst deutlich weniger Haar nach. Schluss mit dem täglichen Rasieren, das immer wieder von vorn beginnt.',
  },
];
