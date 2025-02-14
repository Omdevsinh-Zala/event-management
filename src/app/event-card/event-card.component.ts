import { Component, input, output } from '@angular/core';
import { EventData } from '../admin/module';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, MatIconModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  eventId = input<string>();
  event = input<EventData>();
  editEvent = output<string>();
  deleteEvent = output<string>();
}
