/**
 * Node-Nachbau von `cloudflare:sockets`.
 *
 * Nur für `scripts/smtp-test.mjs`: Damit läuft exakt derselbe SMTP-Code wie in der
 * Cloudflare-Pages-Function (`src/server/smtp.ts`) lokal unter Node – ohne Deploy.
 * In Produktion wird diese Datei NICHT verwendet.
 */
import net from 'node:net';
import tls from 'node:tls';

function buildStreams(socket, onDetach) {
  const listeners = {};

  const readable = new ReadableStream({
    start(controller) {
      listeners.data = (chunk) => controller.enqueue(new Uint8Array(chunk));
      listeners.end = () => {
        try {
          controller.close();
        } catch {
          /* bereits geschlossen */
        }
      };
      listeners.error = (err) => {
        try {
          controller.error(err);
        } catch {
          /* bereits geschlossen */
        }
      };
      socket.on('data', listeners.data);
      socket.on('end', listeners.end);
      socket.on('error', listeners.error);
    },
    cancel() {
      onDetach();
    },
  });

  const writable = new WritableStream({
    write(chunk) {
      return new Promise((resolve, reject) => {
        socket.write(Buffer.from(chunk), (err) => (err ? reject(err) : resolve()));
      });
    },
  });

  const detach = () => {
    if (listeners.data) socket.off('data', listeners.data);
    if (listeners.end) socket.off('end', listeners.end);
    if (listeners.error) socket.off('error', listeners.error);
  };

  return { readable, writable, detach };
}

class NodeSocket {
  constructor(socket, hostname) {
    this.socket = socket;
    this.hostname = hostname;
    const { readable, writable, detach } = buildStreams(socket, () => this.#detach());
    this.readable = readable;
    this.writable = writable;
    this.#detachStreams = detach;
    this.closed = new Promise((resolve) => socket.once('close', resolve));
  }

  #detachStreams;

  #detach() {
    this.#detachStreams?.();
  }

  startTls() {
    // Vor dem Upgrade die Klartext-Listener lösen, sonst lesen zwei Stellen denselben Socket.
    this.#detach();
    const secure = tls.connect({ socket: this.socket, servername: this.hostname });
    return new NodeSocket(secure, this.hostname);
  }

  async close() {
    this.#detach();
    await new Promise((resolve) => {
      if (this.socket.destroyed) return resolve();
      this.socket.end(() => resolve());
      this.socket.destroy();
      resolve();
    });
  }
}

export function connect(address, options = {}) {
  const { hostname, port } = typeof address === 'string'
    ? { hostname: address.split(':')[0], port: Number(address.split(':')[1]) }
    : address;

  if (options.secureTransport === 'on') {
    return new NodeSocket(tls.connect({ host: hostname, port, servername: hostname }), hostname);
  }
  return new NodeSocket(net.connect({ host: hostname, port }), hostname);
}

export default { connect };
