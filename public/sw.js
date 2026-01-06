const CACHE_NAME = 'pms-cache-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/favicon.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    /* self.skipWaiting(); Removed to support manual update UI */
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip API, socket.io, non-GET, and non-same-origin
    if (url.pathname.startsWith('/api') || url.pathname.includes('socket.io') || request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Stale-while-revalidate for most assets
    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        cache.put(request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(() => cachedResponse); // Retain cached if network fails

                return cachedResponse || fetchPromise;
            });
        })
    );
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
