const CACHE_NAME = 'antara-sahasranama-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './Antara_Logo2.png',
  './Vishnu AG.png',
  './Vishnu Logo H.png',
  './Vishnu Logo E.png',
  './Vishnu Logo.png',
  './Female.png',
  './Male.png',
  './Finger.png',
  './app_logo_transparent.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precaching static assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Cleaning old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Stale-While-Revalidate strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fetch failed
      });
      return cachedResponse || fetchPromise;
    })
  );
});
