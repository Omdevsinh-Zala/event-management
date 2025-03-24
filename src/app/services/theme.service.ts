import { inject, Injectable, signal } from '@angular/core';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() { }
  theme = signal('Light');
  private localStorage = inject(LocalstorageService)

  themeToggle() {
    let theme = localStorage.getItem('eventTheme')
    if(!theme) {
        localStorage.setItem('eventTheme', 'light');
        document.body.classList.remove('dark')
        this.theme.update(() => 'Light')
      }
      if(theme == 'light') {
        this.theme.update(() => 'Dark')
        localStorage.setItem('eventTheme', 'dark');
        document.body.classList.add('dark')
      } else {
        this.theme.update(() => 'Light')
        localStorage.setItem('eventTheme', 'light');
        document.body.classList.remove('dark')
      }
    }

  themeCheck() {
    let theme = this.localStorage.getItem('eventTheme')
    if(theme && theme == 'dark') {
      this.theme.update(() => 'Dark')
      document.body.classList.add('dark')
    }
  }
}
