import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let local: {
    getItem: jest.Mock<string>;
    setItem: jest.Mock<string>;
    removeItem: jest.Mock<string>;
  };
  let mockState = {} as RouterStateSnapshot;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        },
      ]
    });
    local = {
      getItem: jest.fn(), 
      setItem: jest.fn(),
      removeItem: jest.fn() 
    };
    Object.defineProperty(window, 'localStorage', {
      value: local,
      writable: true
    })
    router = TestBed.inject(Router)
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to home page if user is logged in', () => {
    const mockRoute = { url: [{ path: 'login' }] } as ActivatedRouteSnapshot
    local.getItem = jest.fn().mockReturnValue(JSON.stringify({ role: 'user' }))
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user')
    expect(router.navigate).toHaveBeenCalledWith(['/event/home'])
    expect(result).toBeFalsy()
  })

  it('should redirect to home page if user is logged in', () => {
    const mockRoute = { url: [{ path: 'register' }] } as ActivatedRouteSnapshot
    local.getItem = jest.fn().mockReturnValue(JSON.stringify({ role: 'user' }))
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user')
    expect(router.navigate).toHaveBeenCalledWith(['/event/home'])
    expect(result).toBeFalsy()
  })

  it('should not redirect to home if user is not logged in', () => {
    const mockRoute = { url: [{ path: 'login' }] } as ActivatedRouteSnapshot
    local.getItem = jest.fn().mockReturnValue(JSON.stringify(null));
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(result).toBeTruthy()
    expect(router.navigate).not.toHaveBeenCalled()
  })

  it('should not redirect to home if user is not logged in', () => {
    const mockRoute = { url: [{ path: 'register' }] } as ActivatedRouteSnapshot
    local.getItem = jest.fn().mockReturnValue(JSON.stringify(null));
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(result).toBeTruthy()
    expect(router.navigate).not.toHaveBeenCalled()
  })

  it('prevent any url other than login/register if user is not logged in', () => {
    const mockRoute = { url: [{ path: 'event/home' }] } as ActivatedRouteSnapshot;
    local.getItem = jest.fn().mockReturnValue(JSON.stringify(null));
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(router.navigate).toHaveBeenCalledWith(['/login'])
    expect(result).toBeFalsy()
  })

  it('allow any url other than login/register if user is logged in', () => {
    const mockRoute = { url: [{ path: 'event/home' }] } as ActivatedRouteSnapshot;
    local.getItem = jest.fn().mockReturnValue(JSON.stringify({ role: 'user' }));
    const result = executeGuard(mockRoute, mockState);
    expect(local.getItem).toHaveBeenCalledWith('user');
    expect(router.navigate).not.toHaveBeenCalledWith(['/login'])
    expect(result).toBeTruthy()
  })
});
