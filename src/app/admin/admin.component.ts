import { AsyncPipe, CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, OnInit, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { selectEventData, selectEventId, selectEventLoading, selectEventsData, selectEventsIdData, selectLoading, selectModelCall, selectModelState, selectModuleLoading, selectUpdateModelCall, selectUpdateModelState, selectUpdateModuleLoading } from './store/admin.reducer';
import { adminActions } from './store/admin.actions';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventData, weekDay } from './module';
import { MessageService } from '../services/message.service';
import { LocalstorageService } from '../services/localstorage.service';
import { EventCardComponent } from '../event-card/event-card.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { single } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    MatProgressSpinnerModule,
    EventCardComponent,
    MatRadioModule,
    MatCheckboxModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations:[
    trigger('bubleUp',
      [
        transition(':enter', [
          style({ opacity: 0, scale: 0 }),
          animate('300ms ease-in', style({ opacity:1, scale: 1 }))
        ]),
        transition(':leave', [
          style({ opacity:1, scale: 1 }),
          animate('300ms ease-in', style({ opacity:0, scale:0 }))
        ])
      ]
    )
  ]
})
export class AdminComponent implements OnInit {
  store = inject(Store);
  private fb = inject(FormBuilder);
  private message = inject(MessageService);
  searchEvent = signal('');
  //For event form
  showModel$ = computed(() => this.store.select(selectModelCall));
  showaddEventModel$ = computed(() => this.store.select(selectModelState));
  modelOpen$ = computed(() => this.store.select(selectModuleLoading));
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
  eventImages: WritableSignal<string[]> = signal([])

  //File input html tag refrence
  @ViewChild('file') file !: ElementRef<HTMLInputElement>;
  @ViewChild('images') images !: ElementRef<HTMLInputElement>;
  eventData$ = signal(this.store.select(selectEventsData));
  eventLoading$ = signal(this.store.select(selectEventLoading));

  //To get event ids
  eventIds$ = signal(this.store.select(selectEventsIdData))

  //To store participants
  participants = signal([]);

  //To store base 64 image formate
  base64ImageData: WritableSignal<null | string | unknown> = signal(null);
  base64ImagesData: WritableSignal<null[] | string[] | unknown[]> = signal([]);

  //To use local storage
  localStorage = inject(LocalstorageService);

  //eventIdFor updating/deleting
  eventId$ = this.store.select(selectEventId);

  weekDays = signal(weekDay)

  todayDate = new Date().toISOString().split("T")[0];

  ngOnInit(): void {
    //To get events data
    this.store.dispatch(adminActions.getEventData());
    window.addEventListener('load', () => {
      if(matchMedia('(max-width: 768px)').matches) {
        this.space.update(() => 350);
      } else {
        this.space.update(() => 500);
      }
    })
    window.addEventListener('resize', () => {
      if(matchMedia('(max-width: 768px)').matches) {
        this.space.update(() => 350);
      } else {
        this.space.update(() => 500);
      }
    })
    this.minForLastDay()
  }

  toggleModel() {
    //To get event data if avaiable
    // this.handleEventForm();
    //To listen and store event data in local storage
    // this.eventForm().valueChanges.subscribe({
    //   next:(value) => {
    //     const data: EventData = {
    //       title: value.title,
    //       image: this.base64ImageData() as string,
    //       place: value.place,
    //       description: value.description,
    //       date: value.date,
    //       participants: this.participants()
    //     }
    //     this.localStorage.setItem('EventDetails', JSON.stringify(data));
    //   }
    // });

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
          });
          //Set image and file name
          if( data[0].bannerImage && (data[0].bannerImage !== '' || data[0].bannerImage !== null)) {
            const fileName = this.localStorage.getItem('ImageName');
            const file = this.base64ToFile(data[0].bannerImage, fileName!);
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
      type:['',[Validators.required]],
      // participants: [[''],[]]
    })
  );

  //Single day event form
  singleDayEvent: Signal<FormGroup> = computed(() =>
    this.fb.group({
      date: ['',[Validators.required]]
    })
  )
  //Multiple day event form
  multyDayEvent: Signal<FormGroup> = computed(() =>
    this.fb.group({
      firstDay: ['',[Validators.required]],
      secondDay: ['',[Validators.required]]
    })
  )
  //Weekly event form
  weekDaysData: WritableSignal<string[]> = signal([])
  //Monthly event form
  monthEvent: Signal<FormGroup> = computed(() =>
    this.fb.group({
      days: ['',[Validators.required]]
    })
  ) 

  //update-event form
  updateEventForm: Signal<FormGroup> = computed(() => 
    this.fb.group({
      title: ['',[Validators.required]],
      image: ['',[Validators.required]],
      place: ['',[Validators.required]],
      description: ['',[Validators.required]],
      type: ['',Validators.required]
      // participants: [[''],[]]
    })
  );

    //Update Single day event form
    updateSingleDayEvent: Signal<FormGroup> = computed(() =>
      this.fb.group({
        date: ['',[Validators.required]]
      })
    )
    //Update Multiple day event form
    updateMultyDayEvent: Signal<FormGroup> = computed(() =>
      this.fb.group({
        firstDay: ['',[Validators.required]],
        secondDay: ['',[Validators.required]]
      })
    )
    //Update Weekly event form
    updateWeekDaysData: WritableSignal<string[]> = signal([])
    //Update Monthly event form
    updateMonthEvent: Signal<FormGroup> = computed(() =>
      this.fb.group({
        days: ['',[Validators.required]]
      })
    ) 

  //Input image file to html and store it.
  async uploadFile(e: Event, type: 'Banner' | 'Event') {
    const inputElement = e.target as HTMLInputElement;
    if(inputElement.files) {
      if(type == 'Banner') {
        const selectedFiles = Array.from(inputElement.files);
        this.imageFile.update(() => selectedFiles[0])
        this.fileName.update(() => selectedFiles[0].name);
        this.fileImage.update(() => URL.createObjectURL(selectedFiles[0]));
        this.base64ImageData.set(await this.imageConvert(selectedFiles[0], 'Banner')!);
        this.localStorage.setItem('ImageName', this.fileName());
        let data = JSON.parse(this.localStorage.getItem('EventDetails') || '[]');
        if(data) {
          data.image = this.base64ImageData();
        }
        this.localStorage.setItem('EventDetails', JSON.stringify(data));
      } else {
        const selectedFiles = Array.from(inputElement.files);
        selectedFiles.forEach(async (e) => {
          this.eventImages.update((images) => [...images, URL.createObjectURL(e)]);
          const data = await this.imageConvert(e, 'Event')
          this.base64ImagesData.update((images) => [...images, data]);
        })
        this.images.nativeElement.value = ''
      }
    }
  }

  //Remove uploaded banner file
  clearBannerUpload() {
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

  //claer uplaoded event images
  clearEventUpload(index: number) {
    this.base64ImagesData.update((images) => images.filter((image, id) => id !== index));
    this.eventImages.update((images) => images.filter((image, id) => id !== index))
  }
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
    //For Event Images
    this.base64ImagesData.update(() => [])
    this.eventImages.update(() => [])
  }

  weekSelection(value: string) {
    this.weekDaysData.update((data => {
      if(data.includes(value)) {
        return data.filter((week) => week != value)
      } else {
        return [...data, value]
      }
    }))
  }

  updateWeekSelection(value: string) {
    this.updateWeekDaysData.update((data => {
      if(data.includes(value)) {
        return data.filter((week) => week != value)
      } else {
        return [...data, value]
      }
    }))
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
        title: this.eventForm().get('title')?.value.trim(),
        bannerImage: this.base64ImageData() as string,
        images: this.base64ImagesData() as string[],
        place: this.eventForm().get('place')?.value.trim(),
        description: this.eventForm().get('description')?.value.trim(),
        date: {
          singleDay: this.eventForm().get('type')?.value == '1' ? true : false,
          multiDay: this.eventForm().get('type')?.value == '2' ? true : false,
          everyWeekEvent: this.eventForm().get('type')?.value == '3' ? true : false,
          everyMonthEvent: this.eventForm().get('type')?.value == '4' ? true : false,
          date: this.getDate(),
          weekDay: this.eventForm().get('type')?.value == '3' ? this.weekDaysData() : null,
          odd_eventDay: false
        },
        participants: this.participants()
      }
      this.store.dispatch(adminActions.submitData({ data: data }));
      this.eventForm().reset();
      this.clearUpload()
      this.model.update(() => false)
    },500);
  }

  getDate(): string[] {
    switch(this.eventForm().get('type')?.value) {
      case '1':
        return [this.singleDayEvent().get('date')?.value];
      case '2':
        return [this.multyDayEvent().get('firstDay')?.value, this.multyDayEvent().get('secondDay')?.value];
      case '3':
        return this.weekDaysData();
      case '4':
        return [this.monthEvent().get('days')?.value];
      default:
      return [];
    }
  }

  //Convert File to base64 
  async imageConvert(data: File, type: 'Banner' | 'Event') {
    const index = this.eventImages().length - 1;
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
    ];
    this.message.warn('Running Image check!');
    if(!(validTypes.includes(data.type))) {
      setTimeout(() => {
        this.message.error('Invalid image format');
        type == 'Banner' ? this.clearBannerUpload() : this.clearEventUpload(index);
        this.store.dispatch(adminActions.error());
      },500);
      return null;
    }
    return new Promise((resolve, reject) => {
      const file = data
      if(!file) {
        this.message.error('Invalid image');
        type == 'Banner' ? this.clearBannerUpload() : this.clearEventUpload(index);
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
        type == 'Banner' ? this.clearBannerUpload() : this.clearEventUpload(index);
        return reject(null)
      }
    })
  }

  typeChange(event: MatRadioChange) {
    const data = event.value
    if(data == '1') {
      this.monthEvent().reset()
      this.weekDaysData.set([])
      this.multyDayEvent().reset()
    } else if( data == '2') {
      this.monthEvent().reset()
      this.weekDaysData.set([])
      this.singleDayEvent().reset()
    } else if (data == '3') {
      this.singleDayEvent().reset()
      this.multyDayEvent().reset()
      this.monthEvent().reset()
    } else {
      this.singleDayEvent().reset();
      this.multyDayEvent().reset();
      this.weekDaysData.set([])
    }
  }

  updateTypeChanges(event: MatRadioChange) {
    const data = event.value
    if(data == '1') {
      this.updateMonthEvent().reset()
      this.updateWeekDaysData.set([])
      this.updateMultyDayEvent().reset()
    } else if( data == '2') {
      this.updateMonthEvent().reset()
      this.updateWeekDaysData.set([])
      this.updateSingleDayEvent().reset()
    } else if (data == '3') {
      this.updateSingleDayEvent().reset()
      this.updateMultyDayEvent().reset()
      this.updateMonthEvent().reset()
    } else {
      this.updateSingleDayEvent().reset();
      this.updateMultyDayEvent().reset();
      this.updateWeekDaysData.set([])
    }
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

  //Remove any event images
  removeImage(id: number) {
    this.eventImages.update((images) => images.filter((image, index) => index != id))
    this.base64ImagesData.update((images) => images.filter((image, index) => index != id))
  }

  minForLastDay() {
    if(this.multyDayEvent().get('firstDay')?.value) {
      const date = new Date(this.multyDayEvent().get('firstDay')?.value);
      date.setDate((date.getDate() + 1))
      return date.toISOString().split("T")[0]
    } else {
      return new Date().toISOString().split("T")[0]
    }
  }

  minForUpdateLastDay() {
    if(this.updateMultyDayEvent().get('firstDay')?.value) {
      const date = new Date(this.updateMultyDayEvent().get('firstDay')?.value);
      date.setDate((date.getDate() + 1))
      return date.toISOString().split("T")[0]
    } else {
      return new Date().toISOString().split("T")[0]
    }
  }

  //To reset form
  resetForm() {
    this.singleDayEvent().reset()
    this.multyDayEvent().reset()
    this.weekDaysData.set([]);
    this.monthEvent().reset()
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
      type: data.date.singleDay ? '1' : data.date.multiDay ? '2' : data.date.everyWeekEvent ? '3' : data.date.everyMonthEvent ? '4' : '' ,
      // participants: [[''],[]]
    });
    this.updateSingleDayEvent().setValue({ date: data.date.singleDay ? data.date.date[0] : '' })
    this.updateMultyDayEvent().setValue({ firstDay: data.date.multiDay ? data.date.date[0] : '', secondDay: data.date.multiDay ? data.date.date[1] : '' })
    this.updateMonthEvent().setValue({ days: data.date.everyMonthEvent ? data.date.date[0] : '' })
    this.updateWeekDaysData.update(() => data.date.everyWeekEvent ? data.date.weekDay! : [] )
    const file = this.base64ToFile(data.bannerImage, 'Event Image');
    this.imageFile.update(() => file);
    this.fileName.update(() => 'Event Image');
    this.fileImage.update(() => URL.createObjectURL(file!));
    this.base64ImageData.set(data.bannerImage);
    this.updateEventForm().get('image')?.removeValidators(Validators.required);
    this.updateEventForm().markAsTouched();
    this.updateEventForm().updateValueAndValidity();
    data?.images?.forEach((e) => {
      const file = this.base64ToFile(e, 'Event Image');
      this.eventImages.update((image) => [...image, URL.createObjectURL(file!)]);
      this.base64ImagesData.update((image) => [...image, e]);
    })
}

  closeUpdateEventForm() {
    this.clearUpload();
    this.store.dispatch(adminActions.closeUpdateEvent());
  }

  editEvent(id: string) {
    this.store.dispatch(adminActions.processData());
    const data: EventData = {
      title: this.updateEventForm().get('title')!.value.trim(),
      bannerImage: this.base64ImageData() as string,
      images: this.base64ImagesData() as string[],
      place: this.updateEventForm().get('place')!.value.trim(),
      description: this.updateEventForm().get('description')!.value.trim(),
      date: {
        singleDay: this.updateEventForm().get('type')?.value == '1' ? true : false,
        multiDay: this.updateEventForm().get('type')?.value == '2' ? true : false,
        everyWeekEvent: this.updateEventForm().get('type')?.value == '3' ? true : false,
        everyMonthEvent: this.updateEventForm().get('type')?.value == '4' ? true : false,
        date: this.getUpdateDate(),
        weekDay: this.updateEventForm().get('type')?.value == '3' ? this.updateWeekDaysData() : null,
        odd_eventDay: false
      },
      participants:this.participants()
    };
    this.store.dispatch(adminActions.updateData({ id: id, eventData: data }));
    this.clearUpload()
  }

  getUpdateDate(): string[] {
    switch(this.updateEventForm().get('type')?.value) {
      case '1':
        return [this.updateSingleDayEvent().get('date')?.value];
      case '2':
        return [this.updateMultyDayEvent().get('firstDay')?.value, this.updateMultyDayEvent().get('secondDay')?.value];
      case '3':
        return this.updateWeekDaysData();
      case '4':
        return [this.updateMonthEvent().get('days')?.value];
      default:
      return [];
    }
  }

  resetUpdateEventForm() {
    this.clearUpload();
    this.updateEventForm().reset();
  }
}
