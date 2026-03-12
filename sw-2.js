const CACHE_NAME = 'fnaf-global-cache-v2';

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force it to take over immediately
});

self.addEventListener('activate', (event) => {
    // Delete the old broken caches from the original sw.js
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== 'fnaf-massive-files-safe-v1') {
                        console.log('Deleting old zombie cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    // 1. THE SHIELD: Completely ignore massive files. 
    // Let the HTML file handle these safely!
    if (event.request.url.includes('.part') || event.request.url.includes('.zip')) {
        return; 
    }

    // 2. THE SPEED BOOST: For all other games, cache them for fast loading!
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                // Don't cache bad errors
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }
                let responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            });
        })
    );
});
