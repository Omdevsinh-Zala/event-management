import { AsyncPipe, CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, QueryList, signal, ViewChild, ViewChildren, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { LoginService } from '../../services/login.service';
import { FireStoreService } from '../../services/fire-store.service';
import { LocalstorageService } from '../../services/localstorage.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    CommonModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, AfterViewInit {
  navlinks = signal([
    {
      path: 'home',
      link: 'Home',
    },
    {
      path: 'events',
      link: 'Events',
    },
  ]);
  ngOnInit(): void {
    const data = JSON.parse(this.localStorage.getItem('user') || '[]');
    if(data && data.email && data.role === 'admin') {
      this.navlinks.update((links) => [...links, { path: 'admin', link: 'Admin' }]);
    }
  }
  position: WritableSignal<{top?: string, left?: string, scale: string, height?: string, width?: string}[]> = signal([]);
  ngAfterViewInit(): void {
    this.navLink.forEach((e, i) => {
      e.nativeElement.addEventListener('mouseover', () => {
        const navPosition = e.nativeElement.getBoundingClientRect();
        this.position.set([{ top: `${navPosition.top}px`, left: `${navPosition.left}px`, scale: '1', height: `${navPosition.height}px`, width: `${navPosition.width}px`}]);
      });
    });
    this.navContainer.nativeElement.addEventListener('mouseleave', () => {
      setTimeout(() => {
        this.position.set([{ top: `unset`, left: `unset`, scale: '0'}]);
      }, 300)
    });
    // const index = this.navlinks().findIndex((links) => links.path == this.route.url);
    // const currentPage = this.navLink.get(index)?.nativeElement.getBoundingClientRect()!;
    // this.position.set([{ top: `${currentPage.top}px`, left: `${currentPage.left - 186}px`, scale: '1'}]);
  }
  @ViewChildren('navLink') navLink!:QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChild('navContainer') navContainer!:ElementRef<HTMLAnchorElement>;
  service = inject(AuthService);
  userState$ = this.service.getAuthState();
  private readonly loginService = inject(LoginService);
  private readonly fireStore = inject(FireStoreService);
  private route = inject(Router);
  private localStorage = inject(LocalstorageService);
  navbarToggle = signal(false);
  signOut() {
    this.fireStore.loggedUser.set(null);
    this.localStorage.removeItem('user');
    this.loginService.singOut();
    this.route.navigateByUrl('/login');
  }
}
