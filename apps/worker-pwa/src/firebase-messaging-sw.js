/* Firebase Cloud Messaging Service Worker for Gracepoint Worker PWA */
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBoyo0VIJb5-xIqi2tP5LJaDGLPx6WGUIE",
  authDomain: "gracepoint-pwa.firebaseapp.com",
  projectId: "gracepoint-pwa",
  storageBucket: "gracepoint-pwa.firebasestorage.app",
  messagingSenderId: "533328087729",
  appId: "1:533328087729:web:1990e94a339fea966a3090"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Gracepoint Notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: payload.notification?.icon || payload.data?.icon || '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('/home') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/home');
      }
    })
  );
});
