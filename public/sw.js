const CACHE_NAME = 'pms-cache-v3';
const ASSETS_TO_CACHE = [
    '/',
    '/?utm_source=pwa',
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

self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const { title, body, icon, data: customData } = data.notification;

        const options = {
            body: body || '',
            icon: icon || '/favicon.png',
            badge: '/favicon.png',
            data: customData || {},
            vibrate: [100, 50, 100],
            actions: [
                { action: 'open', title: 'Xem ngay' },
                { action: 'close', title: 'Đóng' }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(title || 'Thông báo mới', options)
        );
    } catch (error) {
        console.error('Error handling push event:', error);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    if (event.action === 'close') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there is already a window open with this URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
