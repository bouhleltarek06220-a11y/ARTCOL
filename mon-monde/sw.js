// Mon Monde · Service Worker minimal
// Sa seule raison d'exister : permettre l'installation comme PWA.
// Pas de cache offline (chaque module — Brain, Shrine, Compta —
// gère son propre état via Supabase chiffré et localStorage).

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through : laisse le navigateur gérer toutes les requêtes normalement.
});
