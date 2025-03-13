// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// We'll fetch the configuration from a configuration file
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch the Firebase configuration from a separate file
self.addEventListener('fetch', event => {
  if (event.request.url.endsWith('/firebase-config.json')) {
    // This is just to ensure the fetch happens - we don't need to actually
    // intercept the response
  }
});

// Initialize Firebase once we receive the configuration
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INIT_FIREBASE') {
    // Initialize Firebase with the provided configuration
    firebase.initializeApp(event.data.config);
    
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
     
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        title: payload.notification.title,
        body: payload.notification.body,
      };
     
      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        // If a tab is open, focus it
        for (const client of clientList) {
          if (client.url && 'focus' in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
      })
  );
});