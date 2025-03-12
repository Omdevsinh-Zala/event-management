import { Injectable } from '@angular/core';
import { getMessaging, Messaging, onMessage } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireMessagingService {
  private messaging: Messaging;
  currentMessage = new BehaviorSubject<any>(null);
  constructor() {
    this.messaging = getMessaging();

    onMessage(this.messaging, (payload) => {
      console.log('Message recived:', payload)
      this.currentMessage.next(payload);
    })
  }
}
