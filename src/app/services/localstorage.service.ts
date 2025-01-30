import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  private readonly local = inject(PLATFORM_ID);

  getItem(item: string) {
    if (isPlatformBrowser(this.local)) {
      return localStorage.getItem(item);
    } else {
      return null;
    }
  }

  setItem(item: string, data: string) {
    if (isPlatformBrowser(this.local)) {
      localStorage.setItem(item, data);
    }
  }

  removeItem(item: string) {
    if (isPlatformBrowser(this.local)) {
      localStorage.removeItem(item);
    }
  }

  clear() {
    if (isPlatformBrowser(this.local)) {
      localStorage.clear();
    }
  }
}
