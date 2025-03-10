import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideState, provideStore, Store } from '@ngrx/store';
import { FormKey, FormReducer } from '../store/form.reducer';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { routes } from '../../app.routes';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideState(FormKey, FormReducer),
        provideRouter(routes)
      ],
      imports: [RegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
