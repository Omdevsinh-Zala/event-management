import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, MatTooltipModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private fb = inject(FormBuilder);
    registerForm:Signal<FormGroup> = computed(() => this.fb.group({
      'email': ['',[Validators.required, Validators.email]],
      'password': ['',[Validators.required, Validators.maxLength(16), Validators.minLength(8)]]
    }))
  
    submit() {
      const email = this.registerForm().value.email
      const password = this.registerForm().value.password
      if(email == '' && password == '') {
        this.registerForm().markAllAsTouched();
        this.registerForm().get('email')?.markAsDirty();
        this.registerForm().get('password')?.markAsDirty();
        this.registerForm().get('email')?.setErrors({ required: true });
        this.registerForm().get('password')?.setErrors({ required: true });
        return;
      }
      if(email == '') {
        this.registerForm().markAllAsTouched();
        this.registerForm().get('email')?.markAsDirty();
        this.registerForm().get('email')?.setErrors({ required: true });
        return;
      }
      if(password == '') {
        this.registerForm().markAllAsTouched();
        this.registerForm().get('password')?.markAsDirty();
        this.registerForm().get('password')?.setErrors({ required: true });
        return;
      }
    }
}
