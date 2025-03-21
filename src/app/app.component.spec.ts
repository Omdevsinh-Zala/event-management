import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { provideHttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';
import { getMessaging, onMessage } from '@angular/fire/messaging';
import { FireMessagingService } from './services/fire-messaging.service';
import { provideServiceWorker, SwPush } from '@angular/service-worker';

jest.mock('@angular/common', () => ({
  isPlatformBrowser: jest.fn()
}));

jest.mock('@angular/fire/messaging', () => ({
  getMessaging: jest.fn(),
  onMessage: jest.fn()
}));

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideHttpClient(),
        provideServiceWorker('ngsw-worker.js', {
          enabled: environment.production,
          registrationStrategy: 'registerWhenStable:30000'
        })
      ],
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    await fixture.whenStable();
    expect(app).toBeTruthy();
  });
  
  it(`should have the 'event-management' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.whenStable();
    expect(app.title).toEqual('event-management');
  });

  it('should not call initialize firebase message function', async() => {
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    const service = TestBed.inject(AuthService);
    service.getuid = jest.fn().mockReturnValue('123');
    environment.production = true
    const messagingServcie = TestBed.inject(FireMessagingService);
    messagingServcie.initializeFirebaseMessaging = jest.fn()
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    await fixture.whenStable();
    jest.useFakeTimers();
    jest.advanceTimersByTime(500);
    expect(app['messagingService'].initializeFirebaseMessaging).not.toHaveBeenCalled();
  })
});
