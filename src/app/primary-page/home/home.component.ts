import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { HomeStore } from './home.store';
import { AuthService } from '../../services/auth.service';
import { EventData } from '../../admin/module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatProgressSpinnerModule, MatIconModule, AsyncPipe, DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[HomeStore]
})
export class HomeComponent implements OnInit {
  private store = inject(HomeStore);
  today = new Date();
  loading$ = this.store.loading$;
  eventsData$ = this.store.eventsData$;
  eventsId$ = this.store.eventsIds$;
  unRegisterEventId$ = this.store.registerEventId$;
  unRegisterEventLoading$ = this.store.registerEventLoading$;
  private auth = inject(AuthService);

  ngOnInit(): void {
    this.store.getEventData();
  }

  //To check event date with current date
  isFuterEvent(date: string):boolean {
    this.today.setHours(0,0,0,0);
    return new Date(date).getTime() >= this.today.getTime();
  }

  userEvents(data: string[]) {
    if(data && data.length > 0) {
      return data.find((uid) => uid == this.auth.getuid());
    }
    return null;
  }

  isUser() {
    return this.auth.getAuthState()
  }

  unRegisterUser(data:EventData, id: string) {
    let newData: EventData;
    const updatedParticipants = data.participants.filter((uid) => uid !== this.auth.getuid());
      newData = { 
        title: data.title,
        image: data.image,
        description: data.description,
        place: data.place,
        date: data.date,
        participants: updatedParticipants
      };
    this.store.updateEventsData(id, newData);
  }

  shouldShow(data: EventData[] | null) {
    if(data) {
      const index = data.findIndex((event) => event.participants.includes(this.auth.getuid()))
      if(index >= 0) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
}
