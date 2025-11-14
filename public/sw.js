// Service Worker básico para caché de assets estáticos
const CACHE_NAME = 'rium-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/HERO.png',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  return self.clients.claim();
});

// Estrategia: Cache First para assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear requests GET
  if (request.method !== 'GET') {
    return;
  }

  // Cachear assets estáticos (JS, CSS, imágenes)
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i) ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Solo cachear respuestas válidas
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        });
      })
    );
  } else {
    // Para otras requests, usar network first
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

