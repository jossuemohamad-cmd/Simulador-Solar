const CACHE_NAME = 'lecasu-solar-v23';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './shared-catalog.js',
  './app.js',
  './logo.png',
  './icon-192.png',
  './icon-512.png',
  './favicon.png',
  './manifest.json',
  './img/products/bat-deye-lv.svg',
  './img/products/bat-livoltek-bhf.svg',
  './img/products/bat-megatron-lv.svg',
  './img/products/bat-sigen-hv.svg',
  './img/products/inv-deye-lv.svg',
  './img/products/inv-livoltek-lv.svg',
  './img/products/inv-megatron-lv.svg',
  './img/products/inv-sigen-hv.svg',
  './img/products/panel-canadian.svg',
  './img/products/panel-ja.svg',
  './img/products/panel-jinko.svg',
  './img/products/panel-longi.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;
  // Rotas de administração, API e health check nunca passam pela cache do Service Worker
  if (url.includes('/api/') || url.includes('admin') || url.endsWith('/health')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first com fallback offline tolerante a query string (?v=...)
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
