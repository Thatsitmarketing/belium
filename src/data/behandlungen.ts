/**
 * Signatur-Behandlungsbereiche für das Karussell (Abschnitt "Behandlungen").
 * Redaktionell pflegbar. Bilder sind aktuell Platzhalter (placeholder),
 * bis passende Motive je Zone vorliegen.
 */
export type Behandlung = {
  id: string;
  name: string;
  /** kurzer Nutzen-Satz */
  text: string;
  /** Icon-Name aus Icon.astro */
  icon: string;
  /** grober Zeitrahmen einer Sitzung */
  dauer: string;
};

export const behandlungen: Behandlung[] = [
  {
    id: 'gesicht',
    name: 'Gesicht & Oberlippe',
    text: 'Feine Zonen wie Oberlippe, Kinn und Wangen – präzise und sanft behandelt.',
    icon: 'spark',
    dauer: 'wenige Minuten',
  },
  {
    id: 'achseln',
    name: 'Achseln',
    text: 'Ein Klassiker der Laser-Haarentfernung. Schnell, diskret, dauerhaft.',
    icon: 'droplet',
    dauer: 'ca. 10–15 Min.',
  },
  {
    id: 'arme',
    name: 'Arme',
    text: 'Unterarme oder Arme komplett – gleichmäßig glatte Haut ohne Rasur.',
    icon: 'hand',
    dauer: 'ca. 20–30 Min.',
  },
  {
    id: 'bikini',
    name: 'Bikini & Intim',
    text: 'Von der klassischen Bikinizone bis Intim komplett – besonders schonend.',
    icon: 'heart',
    dauer: 'ca. 15–30 Min.',
  },
  {
    id: 'beine',
    name: 'Beine',
    text: 'Unterschenkel oder Beine komplett – die große Fläche, dauerhaft frei.',
    icon: 'leaf',
    dauer: 'bis ca. 1 Std.',
  },
  {
    id: 'ruecken',
    name: 'Rücken & Schultern',
    text: 'Für Herren und Damen: großflächig, kraftvoll und gleichmäßig.',
    icon: 'shield',
    dauer: 'ca. 30–45 Min.',
  },
];
