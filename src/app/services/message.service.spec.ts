import { TestBed } from '@angular/core/testing';

import { MessageService } from './message.service';
import { signal } from '@angular/core';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update warn message successfully', () => {
    service['warnMessages'] = signal(['hello']);
    service['clearValue'] = jest.fn();
    jest.useFakeTimers();
    service.warn('sup');
    expect(service['warnMessages']()).toEqual(['hello','sup']);
    const index = service['warnMessages'].length;
    jest.advanceTimersByTime(4000);
    expect(service['clearValue']).toHaveBeenCalledWith(service['warnMessages'], index);
    jest.useRealTimers();
  });

  it('should update success message successfully', () => {
    service['successMessages'] = signal(['hello']);
    service['clearValue'] = jest.fn();
    jest.useFakeTimers();
    service.success('sup');
    expect(service['successMessages']()).toEqual(['hello','sup']);
    const index = service['successMessages'].length;
    jest.advanceTimersByTime(4000);
    expect(service['clearValue']).toHaveBeenCalledWith(service['successMessages'], index);
    jest.useRealTimers();
  });

  it('should update error message successfully', () => {
    service['errorMessages'] = signal(['hello']);
    service['clearValue'] = jest.fn();
    jest.useFakeTimers();
    service.error('sup');
    expect(service['errorMessages']()).toEqual(['hello','sup']);
    const index = service['errorMessages'].length;
    jest.advanceTimersByTime(4000);
    expect(service['clearValue']).toHaveBeenCalledWith(service['errorMessages'], index);
    jest.useRealTimers();
  });

  it('should clear value from the messages', () => {
    service['successMessages'] = signal(['1','2']);
    const index = 1;
    service['clearValue'](service['successMessages'], index);
    expect(service['successMessages']()).toEqual(['1']);
  });
});
