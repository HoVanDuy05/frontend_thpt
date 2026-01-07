const CACHE_NAME = 'pms-cache-v4';
const ASSETS_TO_CACHE = [
    '/manifest.json',
    '/favicon.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Sự kiện Install: Cài đặt và lưu các assets cơ bản vào cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Thêm tất cả assets vào cache
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
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
    // Yêu cầu các tab đang mở sử dụng SW mới ngay lập tức
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Chỉ xử lý các yêu cầu GET cùng origin (nội bộ)
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }

    // Bỏ qua các API, socket.io và file nội bộ của Next.js
    if (url.pathname.startsWith('/api') || url.pathname.includes('socket.io') || url.pathname.startsWith('/_next')) {
        return;
    }

    // Chiến lược Caching: Network First cho HTML (trang web), Cache First cho Tài nguyên (Assets)
    const isHtml = request.headers.get('accept')?.includes('text/html');

    if (isHtml) {
        // Network First cho HTML: Ưu tiên tải từ mạng để đảm bảo dữ liệu mới nhất
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request, { ignoreSearch: true });
                    if (cachedResponse) return cachedResponse;

                    // Nếu không có mạng và không có cache, có thể trả về một trang offline lỗi
                    // Hoặc ném lỗi để trình duyệt tự xử lý (nhưng nếu đã respondWith thì nên trả về Response)
                    return new Response("Bạn đang ngoại tuyến và trang này chưa được lưu. Vui lòng kết nối mạng để tiếp tục.", {
                        status: 503,
                        statusText: "Service Unavailable",
                        headers: new Headers({ "Content-Type": "text/plain; charset=utf-8" })
                    });
                })
        );
    } else {
        // Stale-while-revalidate cho tài nguyên (ảnh, js, css, etc.)
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(request, { ignoreSearch: true }).then((cachedResponse) => {
                    const fetchPromise = fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Lỗi mạng, trả về null để sau đó dùng || cachedResponse
                        return null;
                    });

                    return cachedResponse || fetchPromise;
                });
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
