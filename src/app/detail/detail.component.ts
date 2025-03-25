import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { DetailStore } from './detail.store';
import { AsyncPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { register } from 'swiper/element/bundle';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-detail',
  imports: [AsyncPipe, MatProgressSpinnerModule, DatePipe, MatTableModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  providers:[DetailStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailComponent implements OnInit {
  readonly id = input<string>();
  private store = inject(DetailStore)
  readonly columns = ['name', 'email'];

  eventData = this.store.eventData$;
  loading = this.store.loading$;
  plateformId = inject(PLATFORM_ID);
  partiLoading$ = this.store.paticipantsLoading$
  dataSource$ = this.store.participantsData$
  isAdmin$ = this.store.isAdmin$

  ngOnInit(): void {
    this.store.checkUser();
    this.store.getEventData$(this.id()!);
    this.store.getParticipantsData(this.id()!);
    if(isPlatformBrowser(this.plateformId)) {
      this.initSwiper()
    }
  }

  initSwiper() {
    register();
  }
}
