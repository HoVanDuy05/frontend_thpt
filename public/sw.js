const CACHE_NAME = 'pms-cache-v5';
const ASSETS_TO_CACHE = [
    '/offline.html',
    '/manifest.json',
    '/favicon.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Sự kiện Install: Cài đặt và lưu các assets cơ bản vào cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

// Sự kiện Activate: Dọn dẹp cache cũ khi có phiên bản mới
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Chỉ xử lý các yêu cầu GET cùng origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Bỏ qua các API, socket.io và file nội bộ của Next.js
    if (url.pathname.startsWith('/api') || url.pathname.includes('socket.io') || url.pathname.startsWith('/_next')) {
        return;
    }

    const isHtml = request.headers.get('accept')?.includes('text/html');

    if (isHtml) {
        // Network First cho HTML
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request, { ignoreSearch: true });
                    if (cachedResponse) return cachedResponse;

                    // Fallback sang trang offline chuẩn
                    return caches.match('/offline.html');
                })
        );
    } else {
        // Cache First cho tài nguyên (Assets)
        event.respondWith(
            caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Nếu không có trong cache, thử tải từ mạng
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                    }
                    return networkResponse;
                }).catch(() => null);
            })
        );
    }
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
        const notification = data.notification || data; // Xử lý cấu trúc lồng hoặc phẳng
        const { title, body, icon, data: customData } = notification;

        const options = {
            body: body || '',
            icon: icon || '/favicon.png',
            badge: '/favicon.png',
            data: customData || { url: '/' },
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
        console.error('Lỗi khi xử lý sự kiện push:', error);
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    if (event.action === 'close') return;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Kiểm tra xem có tab nào đang mở URL này không
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Nếu chưa mở, tiến hành mở tab mới
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
