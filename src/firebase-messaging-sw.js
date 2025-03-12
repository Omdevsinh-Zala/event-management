importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');
import { environment } from './environments/environment.prod'

firebase.initializeApp({
  apiKey: environment.firebaseConfig.apiKey,
  projectId: environment.firebaseConfig.projectId,
  messagingSenderId: environment.firebaseConfig.messagingSenderId,
  appId: environment.firebaseConfig.appId
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/assets/icons/icon-72x72.png'
  };
  
  return self.registration.showNotification(notificationTitle, notificationOptions);
});