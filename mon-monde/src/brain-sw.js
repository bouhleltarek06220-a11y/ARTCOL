// Xiaomi Brain - Service Worker minimal
// Sa seule raison d'exister : permettre l'installation comme PWA.
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {});
