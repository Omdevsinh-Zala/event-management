import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { collection, collectionData, doc, DocumentData, Firestore, getDoc, getFirestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { fireStoreUser } from '../forms/module';
import { MessageService } from './message.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  private fireStore !:Firestore;
  private userPath = 'users'
  private messageService = inject(MessageService);
  private loginService = inject(LoginService);
  loggedUser: WritableSignal<DocumentData | null> = signal(null);

  constructor() {
    this.fireStore = getFirestore();
  }

  async addUser(data: fireStoreUser, id: string) {
    try {
      const userCollection = doc(this.fireStore, this.userPath , id);
      await setDoc(userCollection, data);
      const userData = await getDoc(userCollection);
      return {...userData.data()};
    } catch(error: any) {
      this.messageService.error(error.code);
      this.loginService.deleteUser()
      throw error;
    }
  }

  async getUsers(id: string) {
    const userCollection = doc(this.fireStore, this.userPath , id);
    const data = await getDoc(userCollection)
    if(data.exists()) {
      this.loggedUser.set(data.data())
      return { ...data.data() };
    } else {
      return null
    }
  }

  async addEventData(id: string, eventId: string) {
    const userCollection = doc(this.fireStore, this.userPath, id);
    const userData = await getDoc(userCollection);
    const user = { ...userData.data() };
    let data;
    if(user['events-beta']) {
      const array = user['events-beta'];
      array.push(eventId)
      data = { 'events-beta': array };
    } else {
      data = { 'events-beta': [eventId] }
    }
    return await updateDoc(userCollection, data);
  }

  async removeEventData(id: string, eventId: string) {
    const userCollection = doc(this.fireStore, this.userPath, id);
    const userData = await getDoc(userCollection);
    const user = { ...userData.data() };
    const array = user['events-beta']!.filter((uid: string) => uid !== eventId);
    const data = {
      'events-beta': array
    }
    await updateDoc(userCollection, data);
  }

  getUserFromEvent(id: string) {
    const userCollection = collection(this.fireStore, this.userPath);
    const filter = query(userCollection, where('events-beta', 'array-contains', id));
    return collectionData(filter);
  }
}
