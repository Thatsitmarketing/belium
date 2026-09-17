/**
 * Minimaler SMTP-Client für die Cloudflare-Runtime (Workers / Pages Functions).
 *
 * Warum selbst gebaut: In Workers gibt es kein Node-`net`/`nodemailer`. Cloudflare stellt
 * stattdessen `cloudflare:sockets` bereit – damit lässt sich SMTP direkt sprechen.
 *
 * Unterstützt:
 *   - Port 587 mit STARTTLS (IONOS-Empfehlung) und Port 465 mit direktem TLS
 *   - AUTH LOGIN und AUTH PLAIN
 *   - UTF-8 in Betreff und Text (Header als RFC-2047-Wort, Body als Base64)
 *
 * Nicht unterstützt (bewusst, wird hier nicht gebraucht): Anhänge, HTML-Multipart, Pipelining.
 *
 * Wichtig: Port 25 ist in der Cloudflare-Runtime gesperrt. Es funktionieren nur 587 und 465.
 */
import { connect } from 'cloudflare:sockets';

const CRLF = '\r\n';

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  /** 'starttls' für Port 587, 'tls' für Port 465 */
  secure: 'starttls' | 'tls';
  /** Harte Obergrenze für den gesamten Versand (Standard 15 Sekunden). */
  timeoutMs?: number;
}

export interface SmtpMail {
  /** Absenderadresse – bei IONOS muss das das authentifizierte Postfach sein. */
  fromAddress: string;
  fromName?: string;
  to: string[];
  replyTo?: string;
  subject: string;
  /** Reiner Text, Zeilenumbrüche mit \n. */
  text: string;
}

/* ------------------------------------------------------------------ Hilfen */

function b64(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/** Base64 in 76-Zeichen-Zeilen brechen (RFC 2045). */
function b64Body(value: string): string {
  const encoded = b64(value.replace(/\r?\n/g, CRLF));
  const lines: string[] = [];
  for (let i = 0; i < encoded.length; i += 76) lines.push(encoded.slice(i, i + 76));
  return lines.join(CRLF);
}

/**
 * Header-Wert absichern: Zeilenumbrüche raus (Header-Injection über Formularfelder),
 * Nicht-ASCII als RFC-2047-Wort kodieren.
 */
function headerValue(value: string): string {
  const clean = value.replace(/[\r\n]+/g, ' ').trim();
  // Reines ASCII darf unverändert bleiben, alles andere wird RFC-2047-kodiert.
  if (/^[\x20-\x7E]*$/.test(clean)) return clean;
  return `=?UTF-8?B?${b64(clean)}?=`;
}

/** Anzeigename für einen From-Header: ASCII ggf. quoten, sonst RFC-2047. */
function displayName(value: string): string {
  const encoded = headerValue(value);
  if (encoded.startsWith('=?UTF-8?B?')) return encoded;
  return /[",<>:;@\\[\]]/.test(encoded) ? `"${encoded.replace(/(["\\])/g, '\\$1')}"` : encoded;
}

/** RFC-5322-Datum, z. B. "Wed, 17 Sep 2026 08:14:00 +0000". */
function rfcDate(): string {
  return new Date().toUTCString().replace(/GMT$/, '+0000');
}

function domainOf(address: string): string {
  return address.split('@')[1] || 'localhost';
}

/* -------------------------------------------------------------- SMTP-Dialog */

interface SmtpReply {
  code: number;
  text: string;
}

/** Ein SMTP-Dialog auf genau einem Socket (vor bzw. nach STARTTLS je ein eigener). */
class SmtpSession {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private writer: WritableStreamDefaultWriter<Uint8Array>;
  private decoder = new TextDecoder();
  private encoder = new TextEncoder();
  private buffer = '';

  constructor(socket: { readable: ReadableStream<Uint8Array>; writable: WritableStream<Uint8Array> }) {
    this.reader = socket.readable.getReader();
    this.writer = socket.writable.getWriter();
  }

  /** Eine vollständige (auch mehrzeilige) Serverantwort aus dem Puffer ziehen. */
  private takeReply(): SmtpReply | null {
    let from = 0;
    for (;;) {
      const eol = this.buffer.indexOf(CRLF, from);
      if (eol === -1) return null;
      const line = this.buffer.slice(from, eol);
      // Mehrzeilige Antworten haben "250-" als Trennung, die Schlusszeile "250 ".
      if (line.length < 4 || line[3] === ' ') {
        const raw = this.buffer.slice(0, eol);
        this.buffer = this.buffer.slice(eol + CRLF.length);
        return { code: Number.parseInt(raw.slice(0, 3), 10), text: raw };
      }
      from = eol + CRLF.length;
    }
  }

  async read(): Promise<SmtpReply> {
    for (;;) {
      const reply = this.takeReply();
      if (reply) return reply;
      const { value, done } = await this.reader.read();
      if (done) throw new Error('SMTP: Verbindung wurde vorzeitig beendet.');
      this.buffer += this.decoder.decode(value, { stream: true });
    }
  }

  async write(data: string): Promise<void> {
    await this.writer.write(this.encoder.encode(data));
  }

  async expect(codes: number[], label: string): Promise<SmtpReply> {
    const reply = await this.read();
    if (!codes.includes(reply.code)) {
      const server = reply.text.replace(/\s+/g, ' ').slice(0, 180);
      throw new Error(`SMTP ${label}: unerwartete Antwort ${server}`);
    }
    return reply;
  }

  /** `label` statt `command` in Fehlermeldungen – sonst landet das Passwort im Log. */
  async command(command: string, codes: number[], label: string): Promise<SmtpReply> {
    await this.write(command + CRLF);
    return this.expect(codes, label);
  }

  release(): void {
    try {
      this.reader.releaseLock();
    } catch {
      /* bereits freigegeben */
    }
    try {
      this.writer.releaseLock();
    } catch {
      /* bereits freigegeben */
    }
  }
}

function buildMessage(mail: SmtpMail): string {
  const from = mail.fromName
    ? `${displayName(mail.fromName)} <${mail.fromAddress}>`
    : mail.fromAddress;

  const headers = [
    `Date: ${rfcDate()}`,
    `From: ${from}`,
    `To: ${mail.to.join(', ')}`,
    mail.replyTo ? `Reply-To: ${headerValue(mail.replyTo)}` : '',
    `Subject: ${headerValue(mail.subject)}`,
    `Message-ID: <${crypto.randomUUID()}@${domainOf(mail.fromAddress)}>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
  ].filter(Boolean);

  // Base64-Body: keine Punkt-Stuffing-Sonderfälle und keine Zeilenlängen-Probleme.
  return headers.join(CRLF) + CRLF + CRLF + b64Body(mail.text);
}

async function authenticate(session: SmtpSession, ehlo: string, config: SmtpConfig): Promise<void> {
  const capabilities = ehlo.toUpperCase();
  if (capabilities.includes('LOGIN')) {
    await session.command('AUTH LOGIN', [334], 'AUTH LOGIN');
    await session.command(b64(config.user), [334], 'AUTH Benutzername');
    await session.command(b64(config.pass), [235], 'AUTH Passwort');
    return;
  }
  if (capabilities.includes('PLAIN')) {
    await session.command(`AUTH PLAIN ${b64(`\0${config.user}\0${config.pass}`)}`, [235], 'AUTH PLAIN');
    return;
  }
  throw new Error('SMTP: Server bietet weder AUTH LOGIN noch AUTH PLAIN an.');
}

async function deliver(
  config: SmtpConfig,
  mail: SmtpMail,
  ref: { socket?: ReturnType<typeof connect> }
): Promise<void> {
  const ehloName = domainOf(mail.fromAddress);

  ref.socket = connect(
    { hostname: config.host, port: config.port },
    { secureTransport: config.secure === 'tls' ? 'on' : 'starttls', allowHalfOpen: false }
  );

  let session = new SmtpSession(ref.socket);
  await session.expect([220], 'Begrüßung');
  let ehlo = await session.command(`EHLO ${ehloName}`, [250], 'EHLO');

  if (config.secure === 'starttls') {
    await session.command('STARTTLS', [220], 'STARTTLS');
    // Vor startTls() müssen die Stream-Locks frei sein.
    session.release();
    ref.socket = ref.socket.startTls();
    session = new SmtpSession(ref.socket);
    ehlo = await session.command(`EHLO ${ehloName}`, [250], 'EHLO (TLS)');
  }

  await authenticate(session, ehlo.text, config);

  await session.command(`MAIL FROM:<${mail.fromAddress}>`, [250], 'MAIL FROM');
  for (const rcpt of mail.to) {
    await session.command(`RCPT TO:<${rcpt}>`, [250, 251], 'RCPT TO');
  }
  await session.command('DATA', [354], 'DATA');
  await session.write(`${buildMessage(mail)}${CRLF}.${CRLF}`);
  await session.expect([250], 'Nachricht');

  try {
    await session.command('QUIT', [221], 'QUIT');
  } catch {
    // Die Mail ist an dieser Stelle bereits angenommen – ein ruppiges QUIT ist egal.
  }
  session.release();
}

/**
 * Verschickt eine Mail über SMTP. Wirft bei jedem Protokoll-, Auth- oder Zeitfehler.
 */
export async function sendMail(config: SmtpConfig, mail: SmtpMail): Promise<void> {
  if (!mail.to.length) throw new Error('SMTP: Keine Empfängeradresse angegeben.');

  const timeoutMs = config.timeoutMs ?? 15_000;
  const ref: { socket?: ReturnType<typeof connect> } = {};
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`SMTP: Zeitüberschreitung nach ${timeoutMs} ms.`)),
      timeoutMs
    );
  });

  try {
    await Promise.race([deliver(config, mail, ref), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
    try {
      await ref.socket?.close();
    } catch {
      // Socket war schon zu oder der Server hat vorher aufgelegt.
    }
  }
}

/** Parst "a@b.de, c@d.de" zu einer Empfängerliste. */
export function parseRecipients(value: string | undefined): string[] {
  return (value ?? '')
    .split(/[,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}
