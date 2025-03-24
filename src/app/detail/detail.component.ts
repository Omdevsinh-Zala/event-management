import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, inject, input, OnInit, PLATFORM_ID } from '@angular/core';
import { DetailStore } from './detail.store';
import { AsyncPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-detail',
  imports: [AsyncPipe, MatProgressSpinnerModule, DatePipe],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
  providers:[DetailStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailComponent implements OnInit {
  readonly id = input<string>();
  private store = inject(DetailStore)
  eventData = this.store.eventData$;
  loading = this.store.loading$;
  plateformId = inject(PLATFORM_ID);
  ngOnInit(): void {
    this.store.getEventData$(this.id()!);
    if(isPlatformBrowser(this.plateformId)) {
      this.initSwiper()
    }
  }
  initSwiper() {
    register();
  }
}
