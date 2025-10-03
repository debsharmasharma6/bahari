const CACHE_NAME = 'bahari-cache-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Install event: ক্যাশে ফাইল যোগ করা হয়
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: অফলাইন থাকলে ক্যাশ থেকে ডেটা দেখানো হয়
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ক্যাশে পাওয়া যায়, তবে সেটি দেখানো হবে
        if (response) {
          return response;
        }
        // অন্যথায় নেটওয়ার্ক থেকে আনা হবে
        return fetch(event.request);
      })
  );
});

// Activate event: পুরোনো ক্যাশ পরিষ্কার করা হয়
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
