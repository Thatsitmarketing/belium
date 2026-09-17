/**
 * Ambiente Typdeklaration für das Cloudflare-Runtime-Modul `cloudflare:sockets`.
 * Das Modul existiert nur zur Laufzeit in Workers/Pages Functions, deshalb wird es hier
 * minimal (nur das, was `src/server/smtp.ts` nutzt) für TypeScript beschrieben.
 * Bewusst KEIN import/export in dieser Datei – sonst wäre es keine ambiente Deklaration mehr.
 */
declare module 'cloudflare:sockets' {
  interface SocketAddress {
    hostname: string;
    port: number;
  }

  interface SocketOptions {
    /** 'off' = Klartext, 'on' = direktes TLS (Port 465), 'starttls' = Upgrade möglich (Port 587) */
    secureTransport?: 'off' | 'on' | 'starttls';
    allowHalfOpen?: boolean;
  }

  interface Socket {
    readonly readable: ReadableStream<Uint8Array>;
    readonly writable: WritableStream<Uint8Array>;
    readonly closed: Promise<void>;
    close(): Promise<void>;
    /** Nur bei secureTransport: 'starttls' – liefert den TLS-Socket zurück. */
    startTls(): Socket;
  }

  function connect(address: SocketAddress | string, options?: SocketOptions): Socket;
}
