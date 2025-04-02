import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminComponent } from './admin.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { provideState, provideStore } from '@ngrx/store';
import { adminKey, adminReducer } from './store/admin.reducer';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideStore(),
        provideState(adminKey, adminReducer),
      ],
      imports: [AdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get event data and bind load/resize on load time', () => {
    const store = component.store.dispatch = jest.fn()
    const eventListener = window.addEventListener = jest.fn();
    (matchMedia as jest.Mock) = jest.fn().mockReturnValue({ matches: true })
    const space = component.space.update = jest.fn().mockReturnValue(350)
    component.ngOnInit()
    expect(store).toHaveBeenCalled()
    expect(eventListener).toHaveBeenCalledTimes(2);
    expect(eventListener).toHaveBeenCalledWith('load', expect.any(Function));
    expect(eventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  })
});
