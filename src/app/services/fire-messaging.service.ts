import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getMessaging, getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';
import { doc, Firestore, getDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FireMessagingService {
  private messaging: Messaging | null = null;
  private fireStore: Firestore;
  private auth: AuthService;
  currentMessage = new BehaviorSubject<any>(null);
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.fireStore = getFirestore();
    this.auth = inject(AuthService);
    if(isPlatformBrowser(this.platformId)) {
      this.messaging = getMessaging();
  
      onMessage(this.messaging, (payload) => {
        console.log('Message recived:', payload)
        this.currentMessage.next(payload);
      });
    }
  }

  async requestPermission() {
    if (!isPlatformBrowser(this.platformId) || !this.messaging) {
      console.log('Messaging not available in this environment');
      return;
    }
    try {
      const currrentToken = await getToken(this.messaging, { vapidKey: environment.vapidKey });
      if(currrentToken) {
        console.log('FMC Token:', currrentToken);
        await this.storeTokenToUser(currrentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch(error) {
      console.error('An error occurred while retrieving token:', error);
    }
  }

  private async storeTokenToUser(token: string) {
    const userCollection = doc(this.fireStore, 'users', this.auth.getuid());
    const userData = await getDoc(userCollection);
    const user = { ...userData.data() };
    let data;
    if(user['FMCToken']) {
      return null
    } else {
      data = { FMCToken: token };
      return await updateDoc(userCollection, data);
    }
  }
}
