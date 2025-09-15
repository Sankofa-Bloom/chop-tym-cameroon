const CACHE_NAME = 'choptym-v3';
const ASSET_PATH = '/assets/';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/lovable-uploads/33b7898f-db40-4c09-88d0-be22465c7036.png'
];

// Install event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  event.respondWith((async () => {
    try {
      // Handle hashed build assets under /assets/ with cache-first, then network fallback
      if (url.pathname.startsWith(ASSET_PATH)) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res && res.ok) await cache.put(req, res.clone());
        return res;
      }

      // Default: try network first, fall back to cache
      const network = await fetch(req);
      if (network && network.ok) return network;
      const cache = await caches.open(CACHE_NAME);
      const fallback = await cache.match(req);
      if (fallback) return fallback;
      return network;
    } catch (_err) {
      // On errors (e.g., offline), try cache, otherwise error
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;
      return Response.error();
    }
  })());
});