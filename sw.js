const CACHE_NAME = 'fnaf-global-speed-cache-v3.0';

// The Shield: Files that are too big and will crash the Chromebook if cached
const IGNORED_EXTENSIONS = ['.part', '.zip', '.cch'];

self.addEventListener('install', (event) => {
    // Force the new worker to take over instantly
    self.skipWaiting(); 
});

self.addEventListener('activate', (event) => {
    // Clean out any old, broken zombie caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Wiping old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all open pages
    );
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // 1. THE SHIELD: Completely ignore massive files.
    // This allows your Pizzeria Simulator index.html to handle them safely!
    if (IGNORED_EXTENSIONS.some(ext => url.includes(ext))) {
        return; 
    }

    // Only cache standard GET requests (ignore weird browser extensions/plugins)
    if (event.request.method !== 'GET') {
        return;
    }

    // 2. THE SPEED BOOST: Cache-First Strategy
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // If the file is already in the vault, load it instantly!
            if (cachedResponse) {
                return cachedResponse;
            }

            // If it's not in the vault, download it and save it for next time
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
            }).catch((error) => {
                console.error('Fetch failed, likely offline:', error);
            });
        })
    );
});
