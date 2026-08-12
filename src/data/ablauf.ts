/**
 * Ablauf (Abschnitt 5): vier Schritte von der Beratung bis zum Ergebnis.
 */

export type Schritt = {
  nummer: string;
  titel: string;
  text: string;
};

export const ablaufSchritte: Schritt[] = [
  {
    nummer: '01',
    titel: 'Kostenloses Beratungsgespräch mit Testfleck',
    text: 'Wir schauen uns deinen Hauttyp und deine Haare an und klären, ob und wie gut die Behandlung für dich geeignet ist. Ein kleiner Testfleck zeigt, wie deine Haut reagiert. Ganz in Ruhe und unverbindlich.',
  },
  {
    nummer: '02',
    titel: 'Erste Behandlung',
    text: 'Du trägst eine Schutzbrille, die Zone wird vorbereitet und der gekühlte Laserkopf gleitet über die Haut. Je nach Zone dauert eine Sitzung von wenigen Minuten bis etwa einer Stunde.',
  },
  {
    nummer: '03',
    titel: 'Nachsorge',
    text: 'Direkt danach kühlen und pflegen wir die Haut. Du bekommst klare Hinweise für die Tage danach, etwa zu Sonne, Sport und Pflege. Meist kannst du sofort wieder in deinen Alltag.',
  },
  {
    nummer: '04',
    titel: 'Intervall bis zum Ergebnis',
    text: 'Haare wachsen in Zyklen, deshalb sind mehrere Sitzungen im Abstand von vier bis acht Wochen nötig. Je nach Körperregion sind das in der Regel sieben bis zehn Termine. Schon nach wenigen Behandlungen wächst in der Regel sichtbar weniger nach.',
  },
];
