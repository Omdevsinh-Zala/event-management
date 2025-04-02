import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsComponent } from './events.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment.prod';
import { provideState } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { EventData } from '../../admin/module';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideHttpClient(),
        provideRouter(routes)
      ],
      imports: [EventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    await fixture.whenStable();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run function on init', () => {
    const store = component['store'].getEventData = jest.fn();
    component.ngOnInit();
    expect(store).toHaveBeenCalled();
  })

  it('should return true/false depending the date comparision of current and event date', () => {
    const date = new Date()
    const getTime = component.today.getTime = jest.fn().mockReturnValue(date)
    const result_1 = component.isFuterEvent(['2022-12-12']);
    expect(getTime).toHaveBeenCalled()
    expect(result_1).toBe(false)

    const result_2 = component.isFuterEvent(['12-12-2025']);
    expect(getTime).toHaveBeenCalled()
    expect(result_2).toBe(true)
  })

  it('should check if the user is already register or not', () => {
    const data:EventData = {
      title: '',
      bannerImage: '',
      images: [],
      place: '',
      description: '',
      date: {
        singleDay: true,
        date: [],
        everyMonthEvent: false,
        everyWeekEvent: false,
        multiDay: false,
        odd_eventDay: false,
        weekDay: []
      },
      participants: ['123','234']
    }
    component['auth'].getuid = jest.fn().mockReturnValue('123')
    const result_1 = component.isRegistered(data.participants);
    expect(result_1).toBeTruthy();

    component['auth'].getuid = jest.fn().mockReturnValue('1')
    const result_2 = component.isRegistered(data.participants);
    expect(result_2).toBeFalsy();

    const newData:EventData = {
      title: '',
      bannerImage: '',
      images: [],
      place: '',
      description: '',
      date: {
        singleDay: true,
        date: [],
        everyMonthEvent: false,
        everyWeekEvent: false,
        multiDay: false,
        odd_eventDay: false,
        weekDay: []
      },
      participants: []
    }
    component['auth'].getuid = jest.fn().mockReturnValue('123')
    const result_3 = component.isRegistered(newData.participants);
    expect(result_3).toBeNull();
  })

  it('should register user in event', () => {
    const store = component['store'].addEventsData = jest.fn()
    component['auth'].getuid = jest.fn().mockReturnValue('34')
    const data:EventData = {
      title: '',
      bannerImage: '',
      images: [],
      place: '',
      description: '',
      date: {
        singleDay: true,
        date: [],
        everyMonthEvent: false,
        everyWeekEvent: false,
        multiDay: false,
        odd_eventDay: false,
        weekDay: []
      },
      participants: []
    }
    component.registerUser(data, '123');
    const newData:EventData = {
      title: '',
      bannerImage: '',
      images: [],
      place: '',
      description: '',
      date: {
        singleDay: true,
        date: [],
        everyMonthEvent: false,
        everyWeekEvent: false,
        multiDay: false,
        odd_eventDay: false,
        weekDay: []
      },
      participants: ['34']
    }
    expect(store).toHaveBeenCalledWith('123', newData)
  })
});
