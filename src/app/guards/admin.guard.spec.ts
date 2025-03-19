import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { adminGuard } from './admin.guard';
import { LocalstorageService } from '../services/localstorage.service';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  let router: Router
  let local: LocalstorageService
  let mockRoute = {} as ActivatedRouteSnapshot
  let mockState = {} as RouterStateSnapshot

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        {
          provide: Router,
          userValue: {
            navigateByUrl: jest.fn()
          }
        },
        {
          provide: LocalstorageService,
          userValue: {
            getItem: jest.fn()
          }
        }
      ]
    });
    local = TestBed.inject(LocalstorageService);
    router = TestBed.inject(Router)
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should not allow admin route access if role is not admin', () => {
    local.getItem = jest.fn().mockReturnValue(JSON.stringify({ role: 'user' }))
    const nav = router.navigateByUrl = jest.fn()
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/event/home')
    expect(result).toBeFalsy()
  })

  it('should not allow admin route access if user is not logged in', () => {
    local.getItem = jest.fn().mockReturnValue(JSON.stringify(null))
    const nav = router.navigateByUrl = jest.fn()
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/event/home')
    expect(result).toBeFalsy()
  })

  it('should not allow admin route access if role is admin and email is empty', () => {
    local.getItem = jest.fn().mockReturnValue(JSON.stringify({ role: 'user', email : '' }))
    const nav = router.navigateByUrl = jest.fn()
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/event/home')
    expect(result).toBeFalsy()
  })

  it('should only allow admin route access if role is admin and email is admin email', () => {
    local.getItem = jest.fn().mockReturnValue(JSON.stringify({ role: 'admin', email : 'admin@event.com' }))
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(result).toBeTruthy()
  })
});
