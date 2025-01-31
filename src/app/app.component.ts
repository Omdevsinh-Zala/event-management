import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { LocalstorageService } from './services/localstorage.service';
import { MessageComponent } from "./message/message.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'event-management';
  authSubscription?: Subscription;
  service = inject(AuthService);
  localStorage = inject(LocalstorageService);
  router = inject(Router);
  ngOnInit(): void {
    this.checkAuthState();
  }

  checkAuthState() {
    this.authSubscription = this.service.getAuthState().subscribe({
      next: (data) => {
        const uid = signal(this.localStorage.getItem('User'));
        if (data == null || data.uid !== uid()) {
          this.localStorage.removeItem('User');
        }
      },
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }
}
