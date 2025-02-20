import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorage = inject(LocalstorageService);
  const localData: any = JSON.parse(localStorage.getItem('user') || '[]') || '';
  
  if(localData['role'] == 'admin' && localData['email'] == 'admin@event.com') {
    return true;
  } else {
    router.navigateByUrl('/home');
    return false;
  }
};
