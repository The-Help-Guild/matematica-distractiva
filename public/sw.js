// Service Worker pentru PWA - Matematică Distractivă
const CACHE_NAME = 'matematica-distractiva-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalare Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache deschis');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activare Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Ștergere cache vechi:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptare fetch - strategia Network First cu Cache Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Dacă răspunsul e valid, îl salvăm în cache
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Dacă network-ul eșuează, încercăm cache-ul
        return caches.match(event.request);
      })
  );
});
