/**
 * Testet den Mailversand, bevor deployed wird.
 *
 * Nutzt denselben Code wie die Pages Function (`src/server/smtp.ts`), nur mit einem
 * Node-Socket statt des Cloudflare-Sockets. Wenn dieser Test durchläuft, stimmen
 * Zugangsdaten, Port und Absenderadresse.
 *
 *   npm run mail:test                      # Zugangsdaten aus .dev.vars oder Umgebung
 *   npm run mail:test -- --to=du@firma.de  # Empfänger überschreiben
 *
 * Erwartete Variablen (siehe .dev.vars.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, LEAD_TO_EMAIL, LEAD_FROM_EMAIL, LEAD_FROM_NAME
 */
import { readFileSync } from 'node:fs';
import { register } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** .dev.vars (KEY=VALUE, wie bei Wrangler) laden – vorhandene Umgebungsvariablen gewinnen. */
function loadDevVars() {
  let raw;
  try {
    raw = readFileSync(path.join(root, '.dev.vars'), 'utf8');
  } catch {
    return;
  }
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/i);
    if (!match) continue;
    const key = match[1];
    const value = match[2].trim().replace(/^["'](.*)["']$/s, '$1');
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function arg(name) {
  const hit = process.argv.slice(2).find((entry) => entry.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

loadDevVars();
register('./_cf-sockets-loader.mjs', import.meta.url);

const { sendMail, parseRecipients } = await import('../src/server/smtp.ts');

const host = (process.env.SMTP_HOST || 'smtp.ionos.de').trim();
const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
const user = (process.env.SMTP_USER || '').trim();
const pass = process.env.SMTP_PASS || '';
const from = (process.env.LEAD_FROM_EMAIL || '').trim() || user;
const to = parseRecipients(arg('to') || process.env.LEAD_TO_EMAIL || user);

if (!user || !pass) {
  console.error('Fehlt: SMTP_USER und SMTP_PASS (in .dev.vars eintragen oder als Umgebungsvariable setzen).');
  process.exit(1);
}

const secure =
  (process.env.SMTP_SECURE || '').trim().toLowerCase() === 'tls' || port === 465 ? 'tls' : 'starttls';

console.log(`Sende Testmail über ${host}:${port} (${secure})`);
console.log(`  Von:  ${from}`);
console.log(`  An:   ${to.join(', ')}`);

try {
  await sendMail(
    { host, port, user, pass, secure, timeoutMs: 20_000 },
    {
      fromAddress: from,
      fromName: (process.env.LEAD_FROM_NAME || 'Belium Beauty Website').trim(),
      to,
      replyTo: 'test@example.com',
      subject: 'Testmail Belium Kontaktformular – Umlaute äöüß',
      text: [
        'Das ist eine Testmail aus scripts/smtp-test.mjs.',
        '',
        'Kommt sie an, funktioniert der Versand des Kontaktformulars mit denselben Zugangsdaten.',
        'Die Antwortadresse ist testweise auf test@example.com gesetzt.',
      ].join('\n'),
    }
  );
  console.log('\nOK – Mail wurde vom Server angenommen. Jetzt im Postfach prüfen (auch Spam-Ordner).');
} catch (err) {
  console.error('\nFehlgeschlagen:', err instanceof Error ? err.message : err);
  process.exitCode = 1;
}
