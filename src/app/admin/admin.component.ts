import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { title } from 'process';

@Component({
  selector: 'app-admin',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  searchEvent = signal('')
  showModel = signal(false)
  showaddEventModel = signal(false)
  private fb = inject(FormBuilder);

  toggleModel() {
    if(this.showModel() == false) {
      this.showModel.update(() => true)
      setTimeout(() => {
        this.showaddEventModel.update(() => true)
      },1)
    } else {
      this.showaddEventModel.update(() => false)
      setTimeout(() => {
        this.showModel.update(() => false)
      },200)
    }
  }

  eventForm: Signal<FormGroup> = computed(() => 
    this.fb.group(({
      title: ['',[Validators.required]],
      image: ['',[Validators.required]],
      place: ['',[Validators.required]],
      description: ['',[Validators.required]],
      time: ['',[Validators.required]],
      participentios: [[''],[]]
    }))
  );

  work() {
    console.log(this.eventForm().get('image')?.value.files)
  }

}
