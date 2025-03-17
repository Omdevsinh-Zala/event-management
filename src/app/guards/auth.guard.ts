import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const localStorage = inject(LocalstorageService);
  const localData: any = JSON.parse(localStorage.getItem('user') || '[]') || '';
  const path = route.url[0].path || '';

  if (path === 'login' || path === 'register') {
    if (localData['role']) {
      // Redirect logged-in users away from login/register
      router.navigate(['/event/home']); // Change to your default logged-in route
      return false;
    }
    return true;
  }

  // Protect authenticated routes
  if (!localData['role']) {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }

  return true;
};
