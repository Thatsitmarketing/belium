/**
 * Module-Hook für `scripts/smtp-test.mjs`. Zwei Aufgaben:
 *   1. Import von `cloudflare:sockets` auf den Node-Nachbau umleiten.
 *   2. Endungslose relative Imports (z. B. `../../src/server/smtp`) auf `.ts` auflösen –
 *      Node verlangt die Endung, esbuild in der Cloudflare-Build-Pipeline nicht.
 */
export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'cloudflare:sockets') {
    return {
      shortCircuit: true,
      url: new URL('./_cf-sockets-node.mjs', import.meta.url).href,
    };
  }

  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const erweiterbar = specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier);
    if (err?.code === 'ERR_MODULE_NOT_FOUND' && erweiterbar) {
      return nextResolve(`${specifier}.ts`, context);
    }
    throw err;
  }
}
