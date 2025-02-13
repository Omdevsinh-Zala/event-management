import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectLoading, selectModelCall, selectModelState, selectModuleLoading } from './store/admin.reducer';
import { adminActions } from './store/admin.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventData } from './module';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-admin',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  store = inject(Store);
  private fb = inject(FormBuilder);
  private message = inject(MessageService);
  searchEvent = signal('');
  showModel$ = signal(this.store.select(selectModelCall));
  showaddEventModel$ = signal(this.store.select(selectModelState));
  model = signal(false);
  fileName = signal('');
  fileImage = signal('');
  modelOpen$ = signal(this.store.select(selectModuleLoading));
  imageFile:WritableSignal<File | null> = signal(null);
  formSubmit = signal(this.store.select(selectLoading));
  @ViewChild('file') file !: ElementRef<HTMLInputElement>;
  participentios = signal([''])

  toggleModel() {
    if(this.model() == false) {
      this.store.dispatch(adminActions.openModel());
      this.model.update(() => true);
    } else {
      this.store.dispatch(adminActions.closeModel());
      this.model.update(() => false)
    }
  }

  eventForm: Signal<FormGroup> = computed(() => 
    this.fb.group(({
      title: ['',[Validators.required]],
      image: ['',[Validators.required]],
      place: ['',[Validators.required]],
      description: ['',[Validators.required]],
      date: ['',[Validators.required]],
      // participentios: [[''],[]]
    }))
  );

  uploadFile(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    if(inputElement.files) {
      const selectedFiles = Array.from(inputElement.files);
      this.imageFile.update(() => selectedFiles[0])
      this.fileName.update(() => selectedFiles[0].name);
      this.fileImage.update(() => URL.createObjectURL(selectedFiles[0]));
    }
  }

  clearUpload() {
    this.file.nativeElement.value = '';
    this.fileName.update(() => '');
    this.fileImage.update(() => '');
    this.imageFile.update(() => null)
  }

  async imageConvert(data: File) {
    this.message.success('Running Image check!');
    return new Promise((resolve, reject) => {
      const file = data
      if(!file) {
        this.message.error('Invalid image');
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => {
        this.message.error('Invalid image formate')
        return reject(error)
      }
    })
  }

  async submit() {
    const imageUrl = await this.imageConvert(this.imageFile()!) as string
    const data: EventData = {
      title: this.eventForm().get('title')?.value,
      image: imageUrl,
      place: this.eventForm().get('place')?.value,
      description: this.eventForm().get('description')?.value,
      date: this.eventForm().get('date')?.value,
      participentios: ['']
    }
    this.store.dispatch(adminActions.submitData({ data: data }));
  }
}
