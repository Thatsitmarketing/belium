# Mailversand einrichten (IONOS SMTP)

Das Kontaktformular auf belium.de schickt die Anfrage an die Cloudflare Pages Function
`/api/lead`. Diese verschickt sie per SMTP über das IONOS Postfach an `info@belium.de`.

Solange kein Zustellkanal konfiguriert ist, läuft die Function im **Demo Modus**: Die Anfrage wird
angenommen und die Besucherin sieht das Danke Fenster, aber es wird **nichts zugestellt**. Nach den
Schritten unten ist der Versand scharf.

---

## 1. Zugangsdaten bei IONOS

Aus der IONOS E-Mail Verwaltung (Tab „E-Mail Server Informationen"):

| Wert | Eintrag |
|---|---|
| Postausgangsserver (SMTP) | `smtp.ionos.de` |
| Port | `587` (TLS/STARTTLS) |
| Authentifizierung | erforderlich |
| Benutzername | die vollständige Adresse, also `info@belium.de` |
| Passwort | das für das Postfach gesetzte Passwort |

Alternativ funktioniert Port `465` (direktes TLS). Dann zusätzlich `SMTP_SECURE=tls` setzen.
**Port 25 geht nicht**, der ist in der Cloudflare Laufzeit gesperrt.

---

## 2. Variablen in Cloudflare Pages setzen

Cloudflare Dashboard → **Workers & Pages** → Projekt `belium` → **Settings** →
**Environment variables** → *Production* (und sinnvollerweise auch *Preview*):

| Variable | Wert | Typ |
|---|---|---|
| `SMTP_HOST` | `smtp.ionos.de` | Text |
| `SMTP_PORT` | `587` | Text |
| `SMTP_USER` | `info@belium.de` | Text |
| `SMTP_PASS` | Postfach Passwort | **Secret / encrypted** |
| `LEAD_TO_EMAIL` | `info@belium.de` | Text |
| `LEAD_FROM_EMAIL` | `info@belium.de` | Text |
| `LEAD_FROM_NAME` | `Belium Beauty Website` | Text |

Hinweise:

- `SMTP_PASS` unbedingt als **Secret** anlegen, nicht als normalen Text.
- `LEAD_TO_EMAIL` verträgt mehrere Empfänger, durch Komma getrennt
  (z. B. `info@belium.de, maria@belium.de`).
- `LEAD_FROM_EMAIL` muss das **authentifizierte Postfach oder ein Alias davon** sein. IONOS lehnt
  fremde Absenderadressen ab (Fehler `550` bzw. `553`).
- Die Adresse der Interessentin steht im **Reply-To**. Ein „Antworten" im Mailprogramm geht also
  direkt an sie.
- Nach dem Speichern der Variablen einmal **neu deployen** (Deployments → Retry deployment),
  sonst greifen sie noch nicht.

### Kompatibilitätsdatum prüfen

Der Versand nutzt die TCP Socket API der Cloudflare Laufzeit (`cloudflare:sockets`).
Unter **Settings → Functions → Compatibility date** muss ein Datum ab **2023-08-01** stehen.
Bei neu angelegten Projekten ist das ohnehin der Fall. Ein Kompatibilitätsflag ist nicht nötig.

---

## 3. Vorher lokal testen

Damit man nicht blind deployt, gibt es einen Test, der **exakt denselben Versandcode** benutzt wie
die Function, nur unter Node statt in der Cloudflare Laufzeit:

```bash
cp .dev.vars.example .dev.vars   # und echte Werte eintragen
npm run mail:test                # schickt eine Testmail an LEAD_TO_EMAIL
npm run mail:test -- --to=victor@thatsit.marketing   # Empfänger überschreiben
```

Kommt die Testmail an, stimmen Server, Port, Benutzername, Passwort und Absenderadresse.
`.dev.vars` steht in `.gitignore` und darf nie committet werden.

---

## 4. Danach: Spam Schutz aktivieren

Der Honeypot im Formular ist immer aktiv. Empfohlen ist zusätzlich **Cloudflare Turnstile**
(kein reCAPTCHA, DSGVO freundlicher):

1. Cloudflare Dashboard → **Turnstile** → Widget für `belium.de` anlegen.
2. **Site Key** in `src/data/site.ts` bei `turnstileSiteKey` eintragen (öffentlich, darf ins Repo).
3. **Secret Key** in Cloudflare Pages als Variable `TURNSTILE_SECRET_KEY` (Typ Secret) setzen.

Sobald der Site Key gesetzt ist, rendert das Formular das Widget automatisch und die Function prüft
das Token serverseitig.

---

## 5. Zustellbarkeit

Die Mail geht vom IONOS Postfach an dasselbe Postfach, das landet praktisch immer im Posteingang.
Trotzdem einmal prüfen:

- Erste Testmail kontrollieren, notfalls im **Spam Ordner** nachsehen und als „kein Spam" markieren.
- Im DNS von `belium.de` sollte der SPF Eintrag von IONOS stehen
  (`v=spf1 include:_spf.perfora.net include:_spf.kundenserver.de ~all`). Bei einer bei IONOS
  gehosteten Domain ist er in der Regel schon vorhanden.
- Eine Regel oder ein Label im Postfach für den Betreff „Neue Anfrage über belium.de" macht die
  Anfragen gut auffindbar.

---

## 6. Wenn etwas nicht klappt

Logs live ansehen: Cloudflare Dashboard → Pages Projekt → **Functions** → **Real time logs**,
dann eine Testanfrage über das Formular schicken. Die Function loggt die Fehlermeldung des Servers
(ohne Passwort).

| Meldung in den Logs | Ursache | Lösung |
|---|---|---|
| `SMTP AUTH Passwort: … 535 …` | Benutzername oder Passwort falsch | Benutzername ist die **volle Adresse**; Passwort bei IONOS neu setzen |
| `SMTP MAIL FROM: … 550/553 …` | Absender passt nicht zum Postfach | `LEAD_FROM_EMAIL` auf `SMTP_USER` setzen |
| `SMTP: Zeitüberschreitung nach 15000 ms` | Port falsch oder blockiert | Port `587` verwenden, nicht `25`; alternativ `465` mit `SMTP_SECURE=tls` |
| `SMTP: Verbindung wurde vorzeitig beendet` | TLS Variante passt nicht zum Port | `587` → STARTTLS (Standard), `465` → `SMTP_SECURE=tls` |
| Formular meldet Erfolg, Mail fehlt | Demo Modus | `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` gesetzt? Danach neu deployen |
| `Sicherheitsprüfung fehlgeschlagen` | Turnstile Secret ohne Site Key (oder umgekehrt) | beide Schlüssel setzen, siehe Schritt 4 |

---

## Wie es technisch funktioniert

- `src/server/smtp.ts`: schlanker SMTP Client für die Cloudflare Laufzeit. In Workers gibt es kein
  `nodemailer`, deshalb läuft der SMTP Dialog direkt über `cloudflare:sockets`
  (STARTTLS auf 587 bzw. direktes TLS auf 465, `AUTH LOGIN`/`AUTH PLAIN`, UTF-8 als Base64).
- `functions/api/lead.ts`: prüft Pflichtfelder, Honeypot und Turnstile und wählt den Kanal:
  **SMTP** → **Resend** → **Webhook** → Demo Modus. Es gewinnt der erste vollständig konfigurierte.
- `scripts/smtp-test.mjs`: fährt denselben Client unter Node, indem `cloudflare:sockets` auf einen
  Node Socket umgebogen wird (`scripts/_cf-sockets-node.mjs`).

Umlaute in Betreff und Text werden korrekt kodiert, Zeilenumbrüche aus Formularfeldern können keine
zusätzlichen Mail Header einschleusen.
