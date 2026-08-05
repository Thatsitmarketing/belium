/**
 * Cloudflare Pages Function: Verarbeitung der Lead-/Kontaktanfragen.
 * Endpoint: POST /api/lead  (FormData)
 *
 * Spam-Schutz:
 *   1. Honeypot-Feld "website" – ist es gefüllt, wird still verworfen.
 *   2. Cloudflare Turnstile (optional) – aktiv, sobald TURNSTILE_SECRET_KEY gesetzt ist.
 *
 * Zustellung (in dieser Reihenfolge, je nach gesetzten Umgebungsvariablen):
 *   - RESEND_API_KEY + LEAD_TO_EMAIL + LEAD_FROM_EMAIL  => E-Mail via Resend
 *   - LEAD_WEBHOOK_URL                                  => POST als JSON (z. B. Make/Zapier)
 *   - keiner der beiden gesetzt                         => Demo-Modus (Anfrage wird akzeptiert,
 *                                                          aber NICHT zugestellt; siehe CLAUDE.md)
 *
 * Alle Variablen werden im Cloudflare-Pages-Dashboard unter "Environment variables" hinterlegt.
 */

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  LEAD_TO_EMAIL?: string;
  LEAD_FROM_EMAIL?: string;
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

function esc(v: FormDataEntryValue | null): string {
  return String(v ?? '').slice(0, 2000).trim();
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
  const name = esc(form.get('name'));
  const email = esc(form.get('email'));
  const telefon = esc(form.get('telefon'));
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
    zonen: esc(form.get('zonen')),
    summe: esc(form.get('summe')),
    wunschzone: esc(form.get('wunschzone')),
    wunschtermin: esc(form.get('wunschtermin')),
    nachricht: esc(form.get('nachricht')),
    quelle: esc(form.get('quelle')),
    eingegangen: new Date().toISOString(),
  };

  const zeilen = [
    `Name: ${lead.name}`,
    `E-Mail: ${lead.email || '—'}`,
    `Telefon: ${lead.telefon || '—'}`,
    lead.zonen ? `Gewählte Zonen: ${lead.zonen}` : '',
    lead.summe ? `Paketpreis (Auswahl): ${lead.summe} EUR` : '',
    lead.wunschzone ? `Wunschzone: ${lead.wunschzone}` : '',
    lead.wunschtermin ? `Wunschtermin: ${lead.wunschtermin}` : '',
    lead.nachricht ? `Nachricht: ${lead.nachricht}` : '',
    `Quelle: ${lead.quelle || 'website'}`,
    `Eingegangen: ${lead.eingegangen}`,
  ].filter(Boolean);
  const text = zeilen.join('\n');

  // 4) Zustellung
  try {
    if (env.RESEND_API_KEY && env.LEAD_TO_EMAIL && env.LEAD_FROM_EMAIL) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          from: env.LEAD_FROM_EMAIL,
          to: [env.LEAD_TO_EMAIL],
          reply_to: lead.email || undefined,
          subject: `Neue Anfrage über belium.de – ${lead.name}`,
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
    console.error('[lead] Zustellung fehlgeschlagen:', err);
    return json(
      { ok: false, error: 'Zustellung derzeit nicht möglich. Bitte ruf uns an oder schreib per WhatsApp.' },
      502
    );
  }
};

// GET => Methodenhinweis
export const onRequestGet: PagesFunction<Env> = () =>
  json({ ok: false, error: 'Nur POST wird unterstützt.' }, 405);
