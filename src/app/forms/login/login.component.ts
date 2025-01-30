import { Component, computed, inject, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip'

@Component({
  selector: 'app-login',
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, RouterLink, MatTooltipModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  loginForm:Signal<FormGroup> = computed(() => this.fb.group({
    'email': ['',[Validators.required, Validators.email]],
    'password': ['',[Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
  }))

  submit() {
    // const email = this.loginForm().value.email
    // const password = this.loginForm().value.password
    // if(email == '' && password == '') {
    //   this.loginForm().markAllAsTouched();
    //   this.loginForm().get('email')?.markAsDirty();
    //   this.loginForm().get('password')?.markAsDirty();
    //   this.loginForm().get('email')?.setErrors({ required: true });
    //   this.loginForm().get('password')?.setErrors({ required: true });
    //   return;
    // }
    // if(email == '') {
    //   this.loginForm().markAllAsTouched();
    //   this.loginForm().get('email')?.markAsDirty();
    //   this.loginForm().get('email')?.setErrors({ required: true });
    //   return;
    // }
    // if(password == '') {
    //   this.loginForm().markAllAsTouched();
    //   this.loginForm().get('password')?.markAsDirty();
    //   this.loginForm().get('password')?.setErrors({ required: true });
    //   return;
    // }
    // console.log(this.loginForm().errors)
  }
}
