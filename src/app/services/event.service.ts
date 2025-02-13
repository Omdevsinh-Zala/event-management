import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { EventData } from '../admin/module';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private path = 'events';
  private database = environment.firebaseConfig.databaseURL
  
  addEvent(data: EventData) {
    return this.http.post(this.database + '/' +this.path + '.json', data);
  }

  updateData(id: string, data: EventData) {
    return this.http.put(this.database + '/' + this.path + `/${id}` + + '.json', data);
  }
}
