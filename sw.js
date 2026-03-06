const CACHE_NAME = 'fnaf-all-games-cache-v1';

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
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Pre-caching core HTML files...');
      return cache.addAll(CORE_ASSETS);
    })
  );
});

// Step 2: Dynamic Caching - The Magic Part
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(cachedResponse) {
      // If the file is already in the cache (from a previous visit), load it instantly!
      if (cachedResponse) {
        return cachedResponse;
      }

      // If it's NOT in the cache, download it from the internet normally...
      return fetch(event.request).then(function(networkResponse) {
        
        // Don't cache bad responses (like 404 errors) or cross-origin requests
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // ...AND save a copy of it to the cache so it's instant next time!
        let responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
