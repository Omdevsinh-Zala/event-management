import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryPageComponent } from './primary-page.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { routes } from '../app.routes';

describe('PrimaryPageComponent', () => {
  let component: PrimaryPageComponent;
  let fixture: ComponentFixture<PrimaryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideRouter(routes)
      ],
      imports: [PrimaryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimaryPageComponent);
    await fixture.whenStable()
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
