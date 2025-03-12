import { ChangeDetectionStrategy, Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageComponent } from "./message/message.component";
import { FireMessagingService } from './services/fire-messaging.service';
import { isPlatformBrowser } from '@angular/common';

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
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if(isPlatformBrowser(this.platformId)) {
      this.messagingService.requestPermission();
    }
  }
}
