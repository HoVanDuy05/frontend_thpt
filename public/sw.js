const CACHE_NAME = 'pms-cache-v2';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/manifest.json',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    const url = new URL(req.url);

    // Never cache API calls or non-GET requests
    if (url.pathname.startsWith('/api') || req.method !== 'GET') {
        event.respondWith(fetch(req));
        return;
    }

    // Cache-first for same-origin GET assets/pages
    event.respondWith(
        caches.match(req).then((cached) => {
            if (cached) return cached;
            return fetch(req).then((res) => {
                // Only cache successful same-origin responses
                if (res && res.status === 200 && url.origin === self.location.origin) {
                    const copy = res.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
                }
                return res;
            });
        })
    );
});
