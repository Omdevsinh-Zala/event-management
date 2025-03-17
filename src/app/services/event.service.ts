import { Injectable } from '@angular/core';
import { EventData } from '../admin/module';
import { Database, getDatabase, onValue, push, query, ref, remove, set, update } from '@angular/fire/database';
import { from, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private db:Database;
  private path = 'events';
  private eventsData = new ReplaySubject<{[key: string]: EventData} | null>();
  private eventsData$ = this.eventsData.asObservable()
  
  constructor() {
    this.db = getDatabase();
  }
  
  addEvent(data: EventData) {
    const path = this.path;
    const databaseRef = ref(this.db, path);
    const newRef = push(databaseRef);
    return from(set(newRef, data));
  }

  updateData(id: string, data: EventData) {
    const pathRef = this.path + `/${id}`
    const databaseRef = ref(this.db, pathRef);
    return from(update(databaseRef, data));
  }

  getEventData() {
    const databaseRef = ref(this.db, this.path);
    const newRef = query(databaseRef);
    onValue(newRef, (snapshot) => {
      this.eventsData.next(snapshot.val());
    })
    return this.eventsData$
  }

  removeEventData(id: string) {
    const pathRef = this.path + `/${id}`;
    const dataRef = ref(this.db, pathRef);
    return from(remove(dataRef));
  }
}
