const CACHE_NAME = 'fnaf-all-games-cache-v1.3'; // Bumped to v1.3 to force an update!

// Only pre-cache the lightweight HTML files for each game folder
// MAKE SURE your repo name matches! Change FNAF-HTML-UNBLOCKED if you renamed your repo.
const CORE_ASSETS = [
  '/FNAF-HTML-UNBLOCKED/1/index.html',
  '/FNAF-HTML-UNBLOCKED/2/index.html',
  '/FNAF-HTML-UNBLOCKED/3/index.html',
  '/FNAF-HTML-UNBLOCKED/4/index.html',
  '/FNAF-HTML-UNBLOCKED/ps/index.html',
  '/FNAF-HTML-UNBLOCKED/ucn/index.html',
  '/FNAF-HTML-UNBLOCKED/w/index.html'
];

// Step 1: Install and cache the core HTML files
self.addEventListener('install', function(event) {
  // Force the new service worker to take over immediately
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Pre-caching core HTML files...');
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Step 1.5: Clean up old caches when a new version installs
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Step 2: Dynamic Caching - Background Saving
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      // 1. If it's already cached from a previous visit, load it instantly!
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. If not, fetch it from the internet normally...
      return fetch(event.request).then(function(networkResponse) {
        
        // Don't cache bad responses (like 404 errors) or cross-origin requests
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // 3. Clone the response BEFORE handing it to the game
        let responseToCache = networkResponse.clone();

        // 4. THE MAGIC: Use waitUntil to save to cache in the BACKGROUND.
        // This does not hold up the game's loading screen!
        event.waitUntil(
          caches.open(CACHE_NAME).then(function(cache) {
            return cache.put(event.request, responseToCache);
          }).catch(function(error) {
            console.warn('Cache saving failed (file might be too large for this device):', error);
          })
        );

        // 5. Hand the original response to the game immediately
        return networkResponse;
      });
    })
  );
});
