import { inject, Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, deleteUser, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { RegisterUser } from '../forms/module';
import { doc, getDoc, getFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly authService = inject(AuthService);
  private fireStore = getFirestore()

  async signupWithEmail(data: RegisterUser) {
    return await createUserWithEmailAndPassword(this.authService.getAuth(), data.email, data.password).then((res) => updateProfile(res.user, { displayName: data.email.split('@')[0] }));
  }

  async loginWithEmail(data: RegisterUser) {
    return await signInWithEmailAndPassword(this.authService.getAuth(), data.email, data.password)
  }

  async registerWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const register = await signInWithPopup(this.authService.getAuth(), provider)
      const user = register.user
      const allowRegister = await this.checkUser(user.uid);
      if(allowRegister) {
        return null
      } else {
        return user;
      }
    } catch(error) {
      return null;
    }
  }

  async loginWithGoole() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.authService.getAuth(), provider);
      return null
    } catch(error) {
      return null;
    }
  }

  singOut() {
    return signOut(this.authService.getAuth());
  }

  deleteUser() {
    return deleteUser(this.authService.getAuth().currentUser!)
  }

  async checkUser(id: string) {
    if(id) {
      const userCollection = doc(this.fireStore, 'users' , id);
      const data =  await getDoc(userCollection)
      if(data.exists()) {
        return true;
      } else {
        return false;
      }
    } else {
      return false
    }
  }
}
