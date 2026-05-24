// Xiaomi Shrine - Service Worker minimal
// Sa seule raison d'exister : permettre l'installation comme PWA.
// Pas de cache offline (Shrine fonctionne en pure client-side avec sync cloud).

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Pass-through: laisse le navigateur gérer toutes les requêtes normalement.
});
