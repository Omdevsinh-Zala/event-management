import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { provideState, provideStore, Store } from '@ngrx/store';
import { FormKey, FormReducer } from '../store/form.reducer';
import { provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideStore(),
        provideState(FormKey, FormReducer),
        provideRouter(routes)
      ],
      imports: [LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    await fixture.whenStable();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
