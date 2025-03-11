import { TestBed } from '@angular/core/testing';

import { LocalstorageService } from './localstorage.service';
import { isPlatformBrowser } from '@angular/common';

jest.mock('@angular/common', () => ({
  isPlatformBrowser: jest.fn()
}))

describe('LocalstorageService', () => {
  let service: LocalstorageService;
  const localStorageMock = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data from localStorage', () => {
    const platform = isPlatformBrowser as jest.Mock;
    platform.mockReturnValue(true);
    service.getItem('some');
    expect(localStorageMock.getItem).toHaveBeenCalledWith('some');
  });
  
  it('should return null', () => {
    const platform = isPlatformBrowser as jest.Mock;
    platform.mockReturnValue(false);
    const result = service.getItem('some');
    expect(result).toBeNull();
  });

  it('should set data in localStorage', () => {
    const platform = isPlatformBrowser as jest.Mock;
    platform.mockReturnValue(true);
    service.setItem('some', 'some');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('some','some');
  });

  it('should remove data from localStorage', () => {
    const platform = isPlatformBrowser as jest.Mock;
    platform.mockReturnValue(true);
    service.removeItem('some');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('some');
  });

  it('should clear data from localStorage', () => {
    const platform = isPlatformBrowser as jest.Mock;
    platform.mockReturnValue(true);
    service.clear();
    expect(localStorageMock.clear).toHaveBeenCalled();
  });
});
