import { ChangeDetectionStrategy, Component, Inject, inject, isDevMode, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageComponent } from "./message/message.component";
import { FireMessagingService } from './services/fire-messaging.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MessageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'event-management';
  private messagingService = inject(FireMessagingService)
  private themeService = inject(ThemeService)
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private auth: AuthService
  ) {
    this.themeService.themeCheck()
    auth.getAuthState().subscribe({
      next:() => {
        if(isPlatformBrowser(this.platformId) && environment.production && auth.getuid() && !isDevMode()) {
          this.messagingService.initializeFirebaseMessaging();
        }
      }
    })
  }
}
