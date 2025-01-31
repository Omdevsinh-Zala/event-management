import { inject, Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile, user } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { RegisterUser } from '../forms/module';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly authService = inject(AuthService);

  async signupWithEmail(data: RegisterUser) {
    return await createUserWithEmailAndPassword(this.authService.getAuth(), data.email, data.password).then((res) => updateProfile(res.user, { displayName: data.email.split('@')[0] }));
  }

  async loginWithEmail(data: RegisterUser) {
    return await signInWithEmailAndPassword(this.authService.getAuth(), data.email, data.password)
  }
  // async loginWithGoogle() {
  //   console.log('Helo')
  //   const provider = new GoogleAuthProvider();
  //   // provider.addScope('profile');
  //   // provider.addScope('email');
  //   // provider.addScope('role');
  //   const login = await signInWithPopup(this.authService.getAuth(), provider)
  //   const user = login.user
  //   return of(null)
  // }


}
