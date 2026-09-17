/**
 * Cloudflare Pages Function: Verarbeitung der Lead-/Kontaktanfragen.
 * Endpoint: POST /api/lead  (FormData)
 *
 * Spam-Schutz:
 *   1. Honeypot-Feld "website" – ist es gefüllt, wird still verworfen.
 *   2. Cloudflare Turnstile (optional) – aktiv, sobald TURNSTILE_SECRET_KEY gesetzt ist.
 *
 * Zustellung (in dieser Reihenfolge, je nach gesetzten Umgebungsvariablen):
 *   - SMTP_HOST + SMTP_USER + SMTP_PASS                 => E-Mail direkt über SMTP (IONOS)
 *   - RESEND_API_KEY + LEAD_TO_EMAIL + LEAD_FROM_EMAIL  => E-Mail via Resend
 *   - LEAD_WEBHOOK_URL                                  => POST als JSON (z. B. Make/Zapier)
 *   - keiner davon gesetzt                              => Demo-Modus (Anfrage wird akzeptiert,
 *                                                          aber NICHT zugestellt; siehe CLAUDE.md)
 *
 * Alle Variablen werden im Cloudflare-Pages-Dashboard unter "Environment variables" hinterlegt.
 * Einrichtung Schritt für Schritt: docs/mailversand.md
 */
import { parseRecipients, sendMail, type SmtpConfig } from '../../src/server/smtp';

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  // SMTP (IONOS)
  SMTP_HOST?: string;
  SMTP_PORT?: string;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_SECURE?: string;
  // gemeinsam für SMTP und Resend
  LEAD_TO_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
  LEAD_FROM_NAME?: string;
  // Alternativen
  RESEND_API_KEY?: string;
  LEAD_WEBHOOK_URL?: string;
}

type PagesFunction<E = unknown> = (context: {
  request: Request;
  env: E;
}) => Response | Promise<Response>;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

/**
 * Formularwert säubern: Länge begrenzen, Steuerzeichen entfernen (Zeilenumbrüche bleiben).
 * Ohne das könnten Formularfelder zusätzliche Mail-Header einschleusen.
 */
function esc(v: FormDataEntryValue | null): string {
  let sauber = '';
  for (const zeichen of String(v ?? '').slice(0, 2000)) {
    const code = zeichen.codePointAt(0) ?? 0;
    const istUmbruch = code === 10 || code === 13;
    const istSteuerzeichen = (code < 32 && !istUmbruch) || code === 127;
    if (!istSteuerzeichen) sauber += zeichen;
  }
  return sauber.trim();
}

/** Einzeiliger Wert (Name, Zone, Adresse) – zusätzlich ohne Zeilenumbrüche. */
function escLine(v: FormDataEntryValue | null): string {
  return esc(v).replace(/[\r\n]+/g, ' ').slice(0, 200).trim();
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.append('secret', secret);
  body.append('response', token);
  if (ip) body.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/**
 * SMTP-Zugang aus den Umgebungsvariablen lesen.
 * Gibt null zurück, wenn kein vollständiger Zugang hinterlegt ist (dann greifen Resend/Webhook).
 */
function readSmtpConfig(env: Env): SmtpConfig | null {
  const host = (env.SMTP_HOST || '').trim();
  const user = (env.SMTP_USER || '').trim();
  const pass = env.SMTP_PASS || '';
  if (!host || !user || !pass) return null;

  const port = Number.parseInt((env.SMTP_PORT || '587').trim(), 10) || 587;
  // Port 465 spricht direkt TLS, Port 587 startet im Klartext und wechselt per STARTTLS.
  const secure =
    (env.SMTP_SECURE || '').trim().toLowerCase() === 'tls' || port === 465 ? 'tls' : 'starttls';

  return { host, port, user, pass, secure };
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'Ungültige Anfrage.' }, 400);
  }

  // 1) Honeypot
  if (esc(form.get('website'))) {
    // Bot: freundlich "ok" antworten, aber nichts tun.
    return json({ ok: true });
  }

  // 2) Pflichtfelder
  const name = escLine(form.get('name'));
  const email = escLine(form.get('email'));
  const telefon = escLine(form.get('telefon'));
  const datenschutz = form.get('datenschutz');

  if (!name) return json({ ok: false, error: 'Bitte gib deinen Namen an.' }, 422);
  if (!email && !telefon) return json({ ok: false, error: 'Bitte gib E-Mail oder Telefon an.' }, 422);
  if (!datenschutz) return json({ ok: false, error: 'Bitte stimme der Datenschutzerklärung zu.' }, 422);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ ok: false, error: 'Bitte gib eine gültige E-Mail-Adresse an.' }, 422);
  }

  // 3) Turnstile (nur wenn konfiguriert)
  if (env.TURNSTILE_SECRET_KEY) {
    const token = esc(form.get('cf-turnstile-response'));
    const ip = request.headers.get('CF-Connecting-IP') || '';
    const ok = await verifyTurnstile(env.TURNSTILE_SECRET_KEY, token, ip);
    if (!ok) return json({ ok: false, error: 'Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.' }, 403);
  }

  const lead = {
    name,
    email,
    telefon,
    wunschzone: escLine(form.get('wunschzone')),
    nachricht: esc(form.get('nachricht')),
    quelle: escLine(form.get('quelle')),
    eingegangen: new Date().toISOString(),
  };

  const eingegangenLesbar = new Date(lead.eingegangen).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const felder = [
    `Name: ${lead.name}`,
    `E-Mail: ${lead.email || 'nicht angegeben'}`,
    `Telefon: ${lead.telefon || 'nicht angegeben'}`,
    lead.wunschzone ? `Wunschzone: ${lead.wunschzone}` : null,
  ].filter(Boolean) as string[];

  const bloecke = [
    'Neue Terminanfrage über belium.de',
    felder.join('\n'),
    lead.nachricht ? `Nachricht:\n${lead.nachricht}` : null,
    [
      `Quelle: ${lead.quelle || 'website'}`,
      `Eingegangen: ${eingegangenLesbar} (Europe/Berlin)`,
    ].join('\n'),
    lead.email
      ? 'Antwort auf diese Mail geht direkt an die Interessentin.'
      : 'Es wurde keine E-Mail angegeben, bitte telefonisch zurückrufen.',
  ].filter(Boolean) as string[];
  const text = bloecke.join('\n\n');

  const betreff = `Neue Anfrage über belium.de: ${lead.name}`;

  // 4) Zustellung
  try {
    const smtp = readSmtpConfig(env);
    if (smtp) {
      // Absender muss bei IONOS das authentifizierte Postfach (oder ein Alias davon) sein.
      const fromAddress = (env.LEAD_FROM_EMAIL || '').trim() || smtp.user;
      const empfaenger = parseRecipients(env.LEAD_TO_EMAIL);

      await sendMail(smtp, {
        fromAddress,
        fromName: (env.LEAD_FROM_NAME || 'Belium Beauty Website').trim(),
        to: empfaenger.length ? empfaenger : [smtp.user],
        replyTo: lead.email || undefined,
        subject: betreff,
        text,
      });
      return json({ ok: true });
    }

    if (env.RESEND_API_KEY && env.LEAD_TO_EMAIL && env.LEAD_FROM_EMAIL) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: env.LEAD_FROM_EMAIL,
          to: parseRecipients(env.LEAD_TO_EMAIL),
          reply_to: lead.email || undefined,
          subject: betreff,
          text,
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}`);
      return json({ ok: true });
    }

    if (env.LEAD_WEBHOOK_URL) {
      const res = await fetch(env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(lead),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      return json({ ok: true });
    }

    // Kein Zustellkanal konfiguriert => Demo-Modus.
    console.log('[lead] Demo-Modus, keine Zustellung konfiguriert:\n' + text);
    return json({ ok: true, demo: true });
  } catch (err) {
    console.error('[lead] Zustellung fehlgeschlagen:', err instanceof Error ? err.message : err);
    return json(
      { ok: false, error: 'Zustellung derzeit nicht möglich. Bitte ruf uns kurz an, wir helfen sofort.' },
      502
    );
  }
};

// GET => Methodenhinweis
export const onRequestGet: PagesFunction<Env> = () =>
  json({ ok: false, error: 'Nur POST wird unterstützt.' }, 405);
