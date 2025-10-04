// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAs82Or7bJPuBE3A_QmRAz18CkRb9iKRZE",
    authDomain: "bahari-52fdb.firebaseapp.com",
    databaseURL: "https://bahari-52fdb-default-rtdb.firebaseio.com",
    projectId: "bahari-52fdb",
    storageBucket: "bahari-52fdb.appspot.com",
    messagingSenderId: "89195698661",
    appId: "1:89195698661:web:b8fa8277a2103da37b370c",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// --- PWA Caching Logic ---

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
