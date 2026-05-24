// =================================================================
// Mon Monde · Service Worker
// =================================================================
// Deux rôles :
//   1. Permettre l'installation comme PWA (présence d'un SW requise)
//   2. En production (Vercel), intercepter les appels à
//      api.anthropic.com et les rerouter vers /api/claude
//      → la clé Anthropic vit côté serveur, jamais dans le navigateur
//
// En dev local (localhost / file://) le SW laisse tout passer : les
// modules Brain/Shrine/Compta continuent à appeler directement
// l'API Anthropic avec la clé déchiffrée par la Shrine en RAM.
// =================================================================

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// ─── Détecte si on est en environnement local de développement ───
const _host = self.location.hostname;
const IS_LOCAL_DEV =
  _host === 'localhost' ||
  _host === '127.0.0.1' ||
  _host === '0.0.0.0' ||
  _host.startsWith('192.168.') ||
  _host.startsWith('10.') ||
  _host.endsWith('.local') ||
  self.location.protocol === 'file:';

// ─── Fetch interceptor ───
self.addEventListener('fetch', (event) => {
  // En dev local : pass-through total
  if (IS_LOCAL_DEV) return;

  const url = new URL(event.request.url);

  // En prod : reroute les appels Anthropic vers notre edge proxy
  if (url.hostname === 'api.anthropic.com') {
    event.respondWith(proxyToEdge(event.request));
    return;
  }
  // Tout le reste : pass-through normal
});

async function proxyToEdge(originalRequest) {
  try {
    const body = originalRequest.method === 'POST'
      ? await originalRequest.clone().text()
      : null;

    const proxyUrl = new URL('/api/claude', self.location.origin);
    const proxyRequest = new Request(proxyUrl, {
      method: originalRequest.method,
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': originalRequest.headers.get('anthropic-version') || '2023-06-01',
        ...(originalRequest.headers.get('anthropic-beta')
          ? { 'anthropic-beta': originalRequest.headers.get('anthropic-beta') }
          : {}),
      },
      body,
    });

    return await fetch(proxyRequest);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: {
          type: 'proxy_error',
          message: 'Service worker proxy failed: ' + err.message,
        },
      }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
