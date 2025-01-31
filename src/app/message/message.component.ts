import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MessageService } from '../services/message.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter, :increment', [
        style({ opacity: 0, transform: 'translateX(100px)' }),
        animate(
          '0.3s linear',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0px)' }),
        animate(
          '0.4s linear',
          style({ opacity: 0, transform: 'translateX(100px)' })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  service = inject(MessageService);
}
