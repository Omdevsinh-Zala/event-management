import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { doc, DocumentData, getDoc, getFirestore, setDoc } from '@angular/fire/firestore';
import { fireStoreUser } from '../forms/module';
import { MessageService } from './message.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  private fireStore = getFirestore()
  private userPath = 'users'
  private messageService = inject(MessageService);
  private loginService = inject(LoginService);
  loggedUser: WritableSignal<DocumentData | null> = signal(null);

  async addUser(data: fireStoreUser, id: string) {
    try {
      const userCollection = doc(this.fireStore, this.userPath , id);
      await setDoc(userCollection, data);
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
}
