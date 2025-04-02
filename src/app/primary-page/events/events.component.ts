import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsStore } from './events.store';
import { AsyncPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EventData, weekDay } from '../../admin/module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events',
  imports: [MatProgressSpinnerModule, MatIconModule, AsyncPipe, DatePipe, MatProgressSpinnerModule, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[EventsStore]
})
export class EventsComponent implements OnInit {
  private store = inject(EventsStore);
  today = new Date();
  loading$ = this.store.loading$;
  eventsData$ = this.store.eventsData$;
  eventsId$ = this.store.eventsIds$;
  registerEventId$ = this.store.registerEventId$;
  registerEventLoading$ = this.store.registerEventLoading$;
  auth = inject(AuthService);
  ngOnInit(): void {
    this.store.getEventData();
  }
  weekDays = signal(weekDay)

  getWeekDay(data: string) {
    return this.weekDays().filter((week) => week['value'] == data)
  }

  //To check event date with current date
  isFuterEvent(date: string[]):boolean {
    if(weekDay.find((week) => week['value'] == date[0])) {
      if(date.length >= 2) {
        return true
      } else {
        const currentDay = new Date().getDay()
        if(currentDay == Number(date[0])) {
          return false
        } else {
          return true
        }
      }
    } else {
      this.today.setHours(0,0,0,0)
      if(date.length >= 2) {
        return new Date(date[1]).getTime() >= this.today.getTime();
      } else {
        return new Date(date[0]).getTime() >= this.today.getTime();
      }
    }
  }
  
  registerUser(data:EventData, id: string) {
    let newData: EventData;
    if(data.participants) {
      newData = { 
        title: data.title,
        bannerImage: data.bannerImage,
        images: data.images,
        description: data.description,
        place: data.place,
        date: data.date,
        participants: [...data.participants, this.auth.getuid()]
       };
    } else {
      newData = { 
        title: data.title,
        bannerImage: data.bannerImage,
        images: data.images,
        description: data.description,
        place: data.place,
        date: data.date,
        participants: [this.auth.getuid()]
       };
    }
    this.store.addEventsData(id, newData);
  }

  isUser() {
    return this.auth.getAuthState()
  }

  isRegistered(data:string[]) {
    if(data && data.length > 0) {
      return data.find((uid) => uid == this.auth.getuid());
    }
    return null;
  }
}
