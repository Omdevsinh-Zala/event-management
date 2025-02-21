import { Component, inject, input, output } from '@angular/core';
import { EventData } from '../admin/module';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LocalstorageService } from '../services/localstorage.service';

@Component({
  selector: 'app-event-card',
  imports: [DatePipe, MatIconModule, CommonModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent {
  eventId = input<string>();
  event = input<EventData>();
  editEvent = output<string>();
  deleteEvent = output<string>();
  private localStorage = inject(LocalstorageService);
  targetId = input<string>();
  today = new Date();
  userRole = JSON.parse(this.localStorage.getItem('user')!);
  isFuterEvent(date: string):boolean {
    this.today.setHours(0,0,0,0)
    return new Date(date).getTime() >= this.today.getTime();
  }
}
