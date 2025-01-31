import { Component, computed, inject, signal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import {
  selectIsEmailLoading,
  selectIsGmailLoading,
  selectSigInProgress,
} from '../store/form.reducer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { formActions } from '../store/form.actions';
import { RegisterUser } from '../module';

@Component({
  selector: 'app-login',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    MatProgressSpinnerModule,
    AsyncPipe,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private formStore = inject(Store);
  emailLoading$ = this.formStore.select(selectIsEmailLoading);
  gmailLoading$ = this.formStore.select(selectIsGmailLoading);
  isSigninProgress = this.formStore.select(selectSigInProgress);
  loginForm: Signal<FormGroup> = computed(() =>
    this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(16),
          Validators.minLength(8),
        ],
      ],
    })
  );

  showPassword = signal(false);

  submit() {
    const email = this.loginForm().value.email;
    const password = this.loginForm().value.password;
    const data: RegisterUser = {
      email: email,
      password: password,
    };
    this.formStore.dispatch(
      formActions.loginUserWithEmailAndPassword({ data: data })
    );
  }
}
