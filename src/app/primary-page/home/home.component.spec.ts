import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment.prod';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';
import { EventData } from '../../admin/module';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        provideHttpClient(),
        provideRouter(routes)
      ],
      imports: [
        HomeComponent
      ]
    })
    .compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should get all event data on init', () => {
    const store = component['store'].getEventData = jest.fn()
    component.ngOnInit();
    expect(store).toHaveBeenCalled();
  })

  it('should return true/false depending the date comparision of current and event date', () => {
    const date = new Date()
    const getTime = component.today.getTime = jest.fn().mockReturnValue(date)
    const result_1 = component.isFuterEvent('2022-12-12');
    expect(getTime).toHaveBeenCalled()
    expect(result_1).toBe(false)

    const result_2 = component.isFuterEvent('12-12-2025');
    expect(getTime).toHaveBeenCalled()
    expect(result_2).toBe(true)
  })

  it('should return string/null if user is registered for event', () => {
    const userParticipants = ['123','23'];
    component['auth'].getuid = jest.fn().mockReturnValue('123')
    const result_1 = component.userEvents(userParticipants);
    expect(result_1).toBe('123');

    component['auth'].getuid = jest.fn().mockReturnValue('45')
    const result_2 = component.userEvents(userParticipants);
    expect(result_2).toBe(undefined);

    const userParticipantsEmpty:string[] = [];
    component['auth'].getuid = jest.fn().mockReturnValue('123')
    const result_3 = component.userEvents(userParticipantsEmpty);
    expect(result_3).toBeNull();
  })

  it('should un-register from event', () => {
    const store = component['store'].removeEventDataFromUser = jest.fn()
    const data:EventData = { 
      title: '',
      image: '',
      description: '',
      place: '',
      date: '',
      participants: ['123','24']
    };
    component['auth'].getuid = jest.fn().mockReturnValue('123');
    component.unRegisterUser(data, '234');
    const newData = {
      title: '',
      image: '',
      description: '',
      place: '',
      date: '',
      participants: ['24']
    }
    expect(store).toHaveBeenCalledWith('234', newData)
  })
});
