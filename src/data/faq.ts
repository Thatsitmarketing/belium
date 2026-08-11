/**
 * FAQ (Abschnitt 11). Wird sowohl im Akkordeon als auch im FAQPage-JSON-LD verwendet.
 * Antworten HWG-konform: ehrlich, ohne Heils- oder Erfolgsgarantien.
 * Bei blonden/grauen/weißen Haaren wird bewusst offen gesagt, dass die Methode dort an Grenzen stößt.
 */

export type FaqItem = {
  frage: string;
  antwort: string;
};

export const faqItems: FaqItem[] = [
  {
    frage: 'Tut die Laser Haarentfernung weh?',
    antwort:
      'Die Behandlung ist schmerzarm. Der Laserkopf ist gekühlt, dadurch spüren die meisten nur ein kurzes, leichtes Zwicken oder ein warmes Gefühl. Empfindliche Zonen wie die Bikinizone können etwas spürbarer sein. Ein Testfleck im Beratungsgespräch zeigt dir vorab, wie sich das anfühlt.',
  },
  {
    frage: 'Wie viele Sitzungen brauche ich?',
    antwort:
      'Das hängt von der Körperregion, deinem Haartyp und dem Haarwachstum ab. In der Regel sind sieben bis zehn Sitzungen im Abstand von einigen Wochen sinnvoll. Da Haare in Zyklen wachsen, lässt sich nur das Haar behandeln, das gerade aktiv ist. Deshalb sind mehrere Termine nötig.',
  },
  {
    frage: 'Funktioniert der Laser bei jedem Hauttyp?',
    antwort:
      'Der Diodenlaser mit 808 Nanometern eignet sich für viele Haut- und Haartypen. Am besten wirkt er bei dunklem Haar auf hellerer bis mittlerer Haut, weil der Laser auf das Farbpigment im Haar zielt. Im kostenlosen Beratungsgespräch schätzen wir deinen Hauttyp ein und sagen dir ehrlich, was möglich ist.',
  },
  {
    frage: 'Kann man blonde, graue oder weiße Haare lasern?',
    antwort:
      'Ehrliche Antwort: nein, hier stößt die Methode an ihre Grenzen. Der Laser braucht Farbpigment im Haar, um zu wirken. Blonde, graue, weiße und sehr helle rote Haare enthalten davon zu wenig, deshalb spricht die Behandlung dort kaum an. Bei sehr feinem hellem Flaum ist das Ergebnis ebenfalls eingeschränkt.',
  },
  {
    frage: 'Was ist mit Sonne und Solarium vor der Behandlung?',
    antwort:
      'Bitte in den Wochen vor und nach einer Sitzung nicht gezielt bräunen und kein Solarium nutzen. Frisch gebräunte oder gereizte Haut erhöht das Risiko einer Hautreaktion. An sonnigen Tagen ist Sonnenschutz auf den behandelten Zonen wichtig. Details bekommst du in der Beratung.',
  },
  {
    frage: 'Kann ich mich in der Schwangerschaft lasern lassen?',
    antwort:
      'Während Schwangerschaft und Stillzeit führen wir keine Laser Haarentfernung durch. Es liegen keine ausreichenden Erkenntnisse vor und die Haut reagiert hormonbedingt anders. Nach dieser Zeit kannst du gerne wieder zu uns kommen.',
  },
  {
    frage: 'Was kostet eine dauerhafte Haarentfernung?',
    antwort:
      'Der Preis richtet sich nach der Zone und danach, ob du einzelne Sitzungen oder ein Paket buchst. Größere Flächen wie Beine oder Rücken kosten mehr als kleine Zonen wie die Oberlippe. Deinen persönlichen Preis nennen wir dir in der kostenlosen Beratung, nachdem wir deine Haut und deine Wunschzonen eingeschätzt haben. Sende uns dafür einfach das Kontaktformular am Ende der Seite.',
  },
  {
    frage: 'Übernimmt die Krankenkasse die Kosten?',
    antwort:
      'Die Laser Haarentfernung ist eine kosmetische Leistung. Gesetzliche Krankenkassen übernehmen die Kosten dafür in aller Regel nicht. Sprich uns gerne an, dann finden wir eine Lösung, die zu dir passt, zum Beispiel über Pakete.',
  },
  {
    frage: 'Wie lange dauert eine Sitzung?',
    antwort:
      'Das hängt von der Größe der Zone ab. Eine kleine Zone wie die Oberlippe ist in wenigen Minuten fertig, größere Flächen wie die Beine dauern bis etwa eine Stunde. Den passenden Zeitrahmen besprechen wir beim Termin.',
  },
  {
    frage: 'Wie bereite ich mich auf den Termin vor?',
    antwort:
      'Rasiere die zu behandelnde Zone ein bis zwei Tage vorher. Bitte nicht wachsen, epilieren oder zupfen, denn die Haarwurzel muss vorhanden sein. Komme mit ungebräunter, ungecremter Haut und ohne Make-up in der Behandlungszone. Alles Weitere erklären wir dir persönlich.',
  },
];
