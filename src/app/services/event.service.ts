import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EventData } from '../admin/module';
import { getDatabase, onValue, query, ref } from '@angular/fire/database';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private path = 'events';
  private database = environment.firebaseConfig.databaseURL
  private db = getDatabase();
  private eventsData = new ReplaySubject<{[key: string]: EventData} | null>();
  eventsData$ = this.eventsData.asObservable()
  
  addEvent(data: EventData) {
    return this.http.post(this.database + '/' +this.path + '.json', data);
  }

  updateData(id: string, data: EventData) {
    return this.http.put(this.database + '/' + this.path + `/${id}` + '.json', data);
  }

  getEventData() {
    // return this.http.get<{ key: string,  }>(this.database + '/' +this.path + '.json');
    const databaseRef = ref(this.db, this.path);
    const newRef = query(databaseRef);
    onValue(newRef, (snapshot) => {
      this.eventsData.next(snapshot.val());
    })
    return this.eventsData$
  }
}
