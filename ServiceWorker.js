const cacheName = 'RGB Calculator';
const cacheAsset = ['index.html', 'style.css', 'main.js'];

self.addEventListener('install', (evt) => {
  console.log('Service Worker: Installed');

  evt.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        cache.addAll(cacheAsset);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
  console.log('Service Worker: Activated');

  evt.waitUntil(
    caches.keys().then((cacheName) => {
      return Promise.all(
        cacheName.map((cache) => {
          if (cache !== cacheName) {
            console.log('Service Worker: Clear Old Caches');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (evt) => {
  console.log('Service Worker: Fetching');
  e.respondWith(fetch(evt.request).catch(() => caches.match(e.request)));
});
