const CACHE_NAME = 'lucky-finger-v2';
const urlsToCache = [
  './',
  './index.html',
  './crash.html',
  './roulette.html',
  './slots.html',
  './mines.html',
  './dice.html',
  './horses.html',
  './pyramid.html',
  './fishing.html',
  './coin.html',
  './poker.html',
  './plinko.html',
  './blackjack.html',
  './leaderboard.html',
  './news.html',
  './settings.html',
  './pol.html',
  './con.html',
  './ban.html',
  './authors.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './pixel-font.ttf',
  './music/1.mp3',
  './music/2.mp3',
  './music/3.mp3',
  './music/4.mp3',
  './music/5.mp3',
  './music/6.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.log('Ошибка кеша:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200) return networkResponse;
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
