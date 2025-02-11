import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    AsyncPipe,
    RouterLinkActive,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navlinks = signal([
    {
      path: '/home',
      link: 'Home',
    },
    {
      path: '/events',
      link: 'Events',
    },
  ]);
  service = inject(AuthService);
  userState$ = this.service.getAuthState();
  loginService = inject(LoginService);
  navbarToggle = signal(false);
  signOut() {
    this.loginService.singOut();
  }
}
