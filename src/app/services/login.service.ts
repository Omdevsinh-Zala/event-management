import { inject, Injectable } from '@angular/core';
import { GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly authService = inject(AuthService);
  loginWithEmail() {

  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    provider.addScope('role');
    const login = await signInWithPopup(this.authService.getAuth(), provider)
    const user = login.user;
    console.log(user)
  }
}
