import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getMessaging, getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { doc, Firestore, getDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class FireMessagingService {
  private messaging: Messaging | null = null;
  private fireStore: Firestore;
  private auth: AuthService;
  private message:MessageService;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.fireStore = getFirestore();
    this.auth = inject(AuthService);
    this.message = inject(MessageService);
    if(isPlatformBrowser(this.platformId) && environment.production) {
      this.messaging = getMessaging();
  
      onMessage(this.messaging, (payload) => {
        this.message.success(payload.notification?.body ? payload.notification?.body : 'New notification arrived!');
      });
    }
  }

  async initializeFirebaseMessaging() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        // Wait until the service worker is active
        if (registration.active) {
          this.sendConfigToServiceWorker(registration.active);
          this.requestPermission();
        } else {
          navigator.serviceWorker.ready.then(reg => {
            this.sendConfigToServiceWorker(reg.active!);
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  private sendConfigToServiceWorker(swRegistration: ServiceWorker) {
    // Send Firebase configuration to service worker
    swRegistration.postMessage({
      type: 'INIT_FIREBASE',
      config: environment.firebaseConfig
    });
  }

  async requestPermission() {
    if (!isPlatformBrowser(this.platformId) || !this.messaging || !environment.production) {
      return;
    }
    try {
      const currrentToken = await getToken(this.messaging, { vapidKey: environment.vapidKey });
      if(currrentToken) {
        await this.storeTokenToUser(currrentToken);
      }
    } catch(error) {
      console.error(error);
    }
  }

  private async storeTokenToUser(token: string) {
    const userCollection = doc(this.fireStore, 'users', this.auth.getuid());
    const userData = await getDoc(userCollection);
    const user = { ...userData.data() };
    let data;
    if(user['FCMToken']) {
      return null
    } else {
      data = { FCMToken: token };
      return await updateDoc(userCollection, data);
    }
  }
}
