// Network-First Service Worker: Always fetches live fresh content for products & pages
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  // Always fetch fresh network content first so new products appear instantly
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    )
  }
})
