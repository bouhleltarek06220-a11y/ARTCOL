/*
 * Play Azur CRM — Service Worker
 * Stratégie : network-first pour l'app shell (toujours dernière version),
 *             cache-first pour les assets statiques (icônes, polices, libs CDN).
 *
 * Pourquoi network-first sur le HTML : quand Tarek pousse une nouvelle version
 * sur Vercel, Julie et Myriam doivent voir le changement au prochain reload,
 * pas un cache obsolète.
 */

const VERSION = 'v1.0.0';
const SHELL_CACHE  = `pa-crm-shell-${VERSION}`;
const ASSET_CACHE  = `pa-crm-assets-${VERSION}`;

const SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon-180.png',
  '/icons/favicon-32.png'
];

// ─── Install : précharger l'app shell ───────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_FILES).catch(()=>{}))
  );
});

// ─── Activate : nettoyer les vieux caches ───────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(k => k !== SHELL_CACHE && k !== ASSET_CACHE)
      .map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

// ─── Fetch : stratégie selon le type de requête ─────────────────────────────
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Ignorer tout ce qui n'est pas GET
  if (req.method !== 'GET') return;

  // Ignorer les appels Supabase, API IA, Brevo, etc. (toujours en direct)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('openai.com') ||
    url.hostname.includes('brevo.com') ||
    url.protocol === 'chrome-extension:' ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:'
  ) return;

  // App shell (HTML) : network-first → garantit la dernière version
  const isShell = req.mode === 'navigate' ||
                  (req.destination === 'document') ||
                  url.pathname === '/' ||
                  url.pathname === '/index.html';

  if (isShell) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        const cache = await caches.open(SHELL_CACHE);
        cache.put(req, fresh.clone()).catch(()=>{});
        return fresh;
      } catch (e) {
        const cached = await caches.match(req) || await caches.match('/index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  // Assets statiques (icônes, polices, scripts CDN) : cache-first
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.status === 200) {
        const cache = await caches.open(ASSET_CACHE);
        cache.put(req, fresh.clone()).catch(()=>{});
      }
      return fresh;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});

// ─── Messages depuis l'app (pour forcer update) ─────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
  if (event.data === 'CLEAR_CACHES') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  }
});
