import { computed, inject, Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly authSignal = computed(() => this.auth);
  private readonly authState = authState(this.auth);
  private readonly authSignalState = computed(() => this.authState);

  getAuthState() {
    return this.authSignalState();
  }

  getAuth() {
    return this.authSignal();
  }

  getuid() {
    return this.getAuth().currentUser?.uid!
  }
}
