import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectEventData, selectEventId, selectEventLoading, selectEventsData, selectEventsIdData, selectLoading, selectModelCall, selectModelState, selectModuleLoading, selectUpdateModelCall, selectUpdateModelState, selectUpdateModuleLoading } from './store/admin.reducer';
import { adminActions } from './store/admin.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventData } from './module';
import { MessageService } from '../services/message.service';
import { LocalstorageService } from '../services/localstorage.service';
import { EventCardComponent } from '../event-card/event-card.component';

@Component({
  selector: 'app-admin',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    EventCardComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  store = inject(Store);
  private fb = inject(FormBuilder);
  private message = inject(MessageService);
  searchEvent = signal('');
  //For event form
  showModel$ = signal(this.store.select(selectModelCall));
  showaddEventModel$ = signal(this.store.select(selectModelState));
  modelOpen$ = signal(this.store.select(selectModuleLoading));
  //For update event form
  showUpdateModel$ = signal(this.store.select(selectUpdateModelCall));
  showUpdateEventModel$ = signal(this.store.select(selectUpdateModelState));
  updateModelOpen$ = signal(this.store.select(selectUpdateModuleLoading));
  model = signal(false);
  fileName = signal('');
  fileImage = signal('');
  eventFormData$ = signal(this.store.select(selectEventData));
  imageFile:WritableSignal<File | null> = signal(null);
  formSubmit$ = signal(this.store.select(selectLoading));
  space = signal(500)

  //File input html tag refrence
  @ViewChild('file') file !: ElementRef<HTMLInputElement>;
  eventData$ = signal(this.store.select(selectEventsData));
  eventLoading$ = signal(this.store.select(selectEventLoading));

  //To get event ids
  eventIds$ = signal(this.store.select(selectEventsIdData))

  //To store participants
  participants = signal([]);

  //To store base 64 image formate
  base64ImageData: WritableSignal<null | string | unknown> = signal(null);

  //To use local storage
  localStorage = inject(LocalstorageService);

  //eventIdFor updating/deleting
  eventId$ = this.store.select(selectEventId);

  todayDate = new Date().toISOString().split("T")[0];

  isFuterEvent(date: string):boolean {
    return new Date(date).getTime() > new Date().getTime();
  }
  ngOnInit(): void {
    //To get events data
    this.store.dispatch(adminActions.getEventData());
    window.addEventListener('load', () => {
      if(matchMedia('(max-width: 768px)').matches) {
        this.space.update(() => 300);
      } else {
        this.space.update(() => 500);
      }
    })
    window.addEventListener('resize', () => {
      if(matchMedia('(max-width: 768px)').matches) {
        this.space.update(() => 300);
      } else {
        this.space.update(() => 500);
      }
    })
  }

  toggleModel() {
    //To get event data if avaiable
    // this.handleEventForm();
    //To listen and store event data in local storage
    this.eventForm().valueChanges.subscribe({
      next:(value) => {
        const data: EventData = {
          title: value.title,
          image: this.base64ImageData() as string,
          place: value.place,
          description: value.description,
          date: value.date,
          participants: this.participants()
        }
        this.localStorage.setItem('EventDetails', JSON.stringify(data));
      }
    });

    //To toggle event form dialog
    if(this.model() == false) {
      this.store.dispatch(adminActions.openModel());
      this.model.update(() => true);
    } else {
      this.store.dispatch(adminActions.closeModel());
      this.model.update(() => false)
    }
  }

  handleEventForm() {
    this.store.dispatch(adminActions.initiateEventFormData());
    const sub = this.eventFormData$().subscribe({
      next:async (data) => {
        if(data[0]) {
          //Set form data to event form
          this.eventForm().setValue({
            title: data[0].title,
            image: '',
            place: data[0].place,
            description: data[0].description,
            date: data[0].date
          });
          //Set image and file name
          if( data[0].image && (data[0].image !== '' || data[0].image !== null)) {
            const fileName = this.localStorage.getItem('ImageName');
            const file = this.base64ToFile(data[0].image, fileName!);
            this.imageFile.update(() => file);
            this.fileName.update(() => fileName!);
            this.fileImage.update(() => URL.createObjectURL(file!));
            this.base64ImageData.set(data[0]);
            this.eventForm().get('image')?.removeValidators(Validators.required);
          } else {
            this.eventForm().get('image')?.addValidators(Validators.required);
          }
          this.eventForm().markAsTouched();
          this.eventForm().updateValueAndValidity();
        }
      }
    });
    sub.unsubscribe();
  }

  //Event form
  eventForm: Signal<FormGroup> = computed(() => 
    this.fb.group({
      title: ['',[Validators.required]],
      image: ['',[Validators.required]],
      place: ['',[Validators.required]],
      description: ['',[Validators.required]],
      date: ['',[Validators.required]],
      // participants: [[''],[]]
    })
  );

  //update-event form
  updateEventForm: Signal<FormGroup> = computed(() => 
    this.fb.group({
      title: ['',[Validators.required]],
      image: ['',[Validators.required]],
      place: ['',[Validators.required]],
      description: ['',[Validators.required]],
      date: ['',[Validators.required]],
      // participants: [[''],[]]
    })
  );

  //Input image file to html and store it.
  async uploadFile(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    if(inputElement.files) {
      const selectedFiles = Array.from(inputElement.files);
      this.imageFile.update(() => selectedFiles[0])
      this.fileName.update(() => selectedFiles[0].name);
      this.fileImage.update(() => URL.createObjectURL(selectedFiles[0]));
      this.base64ImageData.set(await this.imageConvert(selectedFiles[0])!);
      this.localStorage.setItem('ImageName', this.fileName());
      let data = JSON.parse(this.localStorage.getItem('EventDetails') || '[]');
      if(data) {
        data.image = this.base64ImageData();
      }
      this.localStorage.setItem('EventDetails', JSON.stringify(data));
    }
  }

  //Remove uploaded file
  clearUpload() {
    this.file.nativeElement.value = '';
    this.fileName.update(() => '');
    this.fileImage.update(() => '');
    this.imageFile.update(() => null);
    if(this.eventForm().get('image')) {
      this.eventForm().get('image')!.addValidators(Validators.required);
      this.eventForm().get('image')!.reset();
      this.eventForm().updateValueAndValidity();
    }
    this.base64ImageData.update(() => null);
    this.localStorage.removeItem('ImageName');
    let data = JSON.parse(this.localStorage.getItem('EventDetails') || '[]');
      if(data) {
        data.image = null;
      }
      this.localStorage.setItem('EventDetails', JSON.stringify(data));
  }

  //Submit event data
  async submit() {
    this.store.dispatch(adminActions.processData());
    if(typeof(this.base64ImageData()) != 'string') {
      setTimeout(() => {
        this.message.error('Invalid data formate');
        this.store.dispatch(adminActions.error());
        return;
      }, 500)
    }
    setTimeout(() => {
      const data: EventData = {
        title: this.eventForm().get('title')?.value,
        image: this.base64ImageData() as string,
        place: this.eventForm().get('place')?.value,
        description: this.eventForm().get('description')?.value,
        date: this.eventForm().get('date')?.value,
        participants: this.participants()
      }
      this.store.dispatch(adminActions.submitData({ data: data }));
      this.eventForm().reset();
    },500);
  }

  //Convert File to base64 
  async imageConvert(data: File) {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    this.message.warn('Running Image check!');
    if(!(validTypes.includes(data.type))) {
      setTimeout(() => {
        this.message.error('Invalid image format');
        this.clearUpload();
        this.store.dispatch(adminActions.error());
      },500);
      return null;
    }
    return new Promise((resolve, reject) => {
      const file = data
      if(!file) {
        this.message.error('Invalid image');
        this.clearUpload();
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setTimeout(() => {
          this.message.success('Image validation successful!')
        },500);
        return resolve(reader.result as string)
      };
      reader.onerror = (error) => {
        this.message.error('Invalid image');
        this.clearUpload();
        return reject(null)
      }
    })
  }

  //Convert base64 image to File
  base64ToFile(base64: string, fileName: string) {
    if(base64 && base64 !== '' && base64 !== null) {
      const byteString = atob(base64.split(',')[1]);
      const mimeType = base64.match(/^data:(.*);base64,/)?.[1] || 'application/octet-stream';
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      return new File([uint8Array], fileName, { type: mimeType });
    }
    return null;
  }

  //To reset form
  resetForm() {
    this.clearUpload();
    this.eventForm().reset();
    this.localStorage.removeItem('EventDetails');
  }

  //To delete event
  deleteEvent(id: string) {
    this.store.dispatch(adminActions.removeEvent({ id: id }));
  }

  openUpdateEventForm(id: string, data: EventData) {
    this.store.dispatch(adminActions.openUpdateEvent({id: id}))
    this.updateEventForm().setValue({
      title: data.title,
      image: '',
      place: data.place,
      description: data.description,
      date: data.date,
      // participants: [[''],[]]
    });
    const file = this.base64ToFile(data.image, 'Event Image');
    this.imageFile.update(() => file);
    this.fileName.update(() => 'Event Image');
    this.fileImage.update(() => URL.createObjectURL(file!));
    this.base64ImageData.set(data.image);
    this.updateEventForm().get('image')?.removeValidators(Validators.required);
    this.updateEventForm().markAsTouched();
    this.updateEventForm().updateValueAndValidity();
}

  closeUpdateEventForm() {
    this.store.dispatch(adminActions.closeUpdateEvent());
  }

  editEvent(id: string) {
    this.store.dispatch(adminActions.processData());
    const data: EventData = {
      title: this.updateEventForm().get('title')!.value,
      image: this.base64ImageData() as string,
      place: this.updateEventForm().get('place')!.value,
      description: this.updateEventForm().get('description')!.value,
      date: this.updateEventForm().get('date')!.value,
      participants:this.participants()
    };
    this.store.dispatch(adminActions.updateData({ id: id, eventData: data }));
  }

  resetUpdateEventForm() {
    this.clearUpload();
    this.updateEventForm().reset();
  }
}
