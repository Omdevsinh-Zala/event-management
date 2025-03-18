import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { formActions } from '../store/form.actions';
import { RegisterUser } from '../module';
import {
  selectIsEmailLoading,
  selectIsGmailLoading,
  selectSigInProgress,
} from '../store/form.reducer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatTooltipModule,
    MatIconModule,
    AsyncPipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private formStore = inject(Store);
  emailLoading$ = this.formStore.select(selectIsEmailLoading);
  gmailLoading$ = this.formStore.select(selectIsGmailLoading);
  isSigninProgress = this.formStore.select(selectSigInProgress);
  registerForm: Signal<FormGroup> = computed(() =>
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

  registerWithGmail() {
    this.formStore.dispatch(formActions.registerUserWithGoogle());
  }

  registerWithEmail() {
    const email = this.registerForm().value.email;
    const password = this.registerForm().value.password;
    const data: RegisterUser = {
      email: email,
      password: password,
    };
    this.formStore.dispatch(
      formActions.registerUserWithEmailAndPassword({ data: data })
    );
  }
}
