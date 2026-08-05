/**
 * Behandlungszonen & Preise für den interaktiven Zonenwähler (Abschnitt 4).
 *
 * ============================ WICHTIG ============================
 * ALLE PREISE SIND PLATZHALTER ("placeholder: true").
 * Sie sind NICHT die echten Preise von Belium Beauty, sondern branchenübliche
 * Richtwerte als Struktur-Demo. Vor Go-live MÜSSEN die echten Preise vom Kunden
 * eingetragen werden. Danach jeweils `placeholder: false` setzen.
 *
 * Pflege:
 *  - einzel   = Preis für eine einzelne Sitzung (in EUR)
 *  - paket    = Paketpreis (typischerweise mehrere Sitzungen, siehe paketSitzungen)
 *  - Zonen ergänzen/entfernen ist gefahrlos möglich; die Summierung im Wähler passt sich an.
 * ================================================================
 */

export type Zone = {
  id: string;
  name: string;
  /** Kurzbeschreibung / Beispiel, was zur Zone gehört */
  hinweis?: string;
  /** Einzelpreis pro Sitzung in EUR (PLATZHALTER) */
  einzel: number;
  /** Paketpreis in EUR (PLATZHALTER) */
  paket: number;
  placeholder: boolean;
};

export type ZonenGruppe = {
  id: 'damen' | 'herren';
  label: string;
  zonen: Zone[];
};

/** Anzahl Sitzungen, auf die sich ein Paketpreis üblicherweise bezieht (Platzhalter-Annahme). */
export const paketSitzungen = 6;

/** Währungsformat für die Anzeige */
export function formatEuro(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export const zonenGruppen: ZonenGruppe[] = [
  {
    id: 'damen',
    label: 'Damen',
    zonen: [
      { id: 'oberlippe', name: 'Oberlippe', hinweis: 'Gesicht', einzel: 30, paket: 150, placeholder: true },
      { id: 'kinn', name: 'Kinn', hinweis: 'Gesicht', einzel: 30, paket: 150, placeholder: true },
      { id: 'wangen', name: 'Wangen', hinweis: 'Gesicht', einzel: 40, paket: 200, placeholder: true },
      { id: 'achseln', name: 'Achseln', einzel: 45, paket: 220, placeholder: true },
      { id: 'unterarme', name: 'Unterarme', einzel: 55, paket: 280, placeholder: true },
      { id: 'arme-komplett', name: 'Arme komplett', einzel: 80, paket: 400, placeholder: true },
      { id: 'bikinizone', name: 'Bikinizone', hinweis: 'klassisch', einzel: 45, paket: 220, placeholder: true },
      { id: 'intim-komplett', name: 'Intim komplett', einzel: 70, paket: 350, placeholder: true },
      { id: 'unterschenkel', name: 'Unterschenkel', einzel: 75, paket: 375, placeholder: true },
      { id: 'beine-komplett', name: 'Beine komplett', einzel: 120, paket: 600, placeholder: true },
      { id: 'ruecken-damen', name: 'Rücken', einzel: 90, paket: 450, placeholder: true },
      { id: 'bauch-damen', name: 'Bauch', einzel: 60, paket: 300, placeholder: true },
    ],
  },
  {
    id: 'herren',
    label: 'Herren',
    zonen: [
      { id: 'nacken', name: 'Nacken', einzel: 40, paket: 200, placeholder: true },
      { id: 'wangen-herren', name: 'Wangen / Bartkontur', einzel: 45, paket: 220, placeholder: true },
      { id: 'achseln-herren', name: 'Achseln', einzel: 50, paket: 250, placeholder: true },
      { id: 'brust', name: 'Brust', einzel: 80, paket: 400, placeholder: true },
      { id: 'bauch-herren', name: 'Bauch', einzel: 70, paket: 350, placeholder: true },
      { id: 'ruecken-herren', name: 'Rücken', einzel: 100, paket: 500, placeholder: true },
      { id: 'schultern', name: 'Schultern', einzel: 60, paket: 300, placeholder: true },
      { id: 'oberarme', name: 'Oberarme', einzel: 65, paket: 325, placeholder: true },
      { id: 'beine-herren', name: 'Beine komplett', einzel: 140, paket: 700, placeholder: true },
    ],
  },
];

/** True, solange irgendein Preis noch Platzhalter ist – steuert den Hinweisbanner im UI. */
export const preisePlatzhalter = zonenGruppen.some((g) => g.zonen.some((z) => z.placeholder));
