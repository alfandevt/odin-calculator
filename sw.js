const cacheName = 'RGB Calculator';
const cacheAsset = [
  './',
  './index.html',
  './styles.css',
  './main.js',
  './manifest.json',
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(cacheAsset);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evt) => {
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .open(cacheName)
      .then((cache) => cache.match(event.request, { ignoreSearch: true }))
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
