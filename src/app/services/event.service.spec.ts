import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { DatabaseReference, DataSnapshot, onValue, push, Query, query, ref, remove, set, ThenableReference, update } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { EventData } from '../admin/module';

// Manually patch the EventService to use the mock in the constructor
jest.mock('@angular/fire/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  push: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
  query: jest.fn(),
  remove: jest.fn(),
  onValue: jest.fn()
}));

describe('EventService', () => {
  let service: EventService;

  const mockRef = ref as jest.Mock;
  const mockRefRef = {} as DatabaseReference;
  mockRef.mockReturnValue(mockRefRef);

  const data:EventData = {
    title: '',
    bannerImage: '',
    images: [],
    place: '',
    description: '',
    date: {
      singleDay: true,
      date: [],
      everyMonthEvent: false,
      everyWeekEvent: false,
      multiDay: false,
      odd_eventDay: false,
      weekDay: []
    },
    participants: []
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});

    // Spy on the constructor's getDatabase call if needed (not required here)
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add event data to database', () => {
    // Mock the push function
    const mockPush = push as jest.Mock;
    const mockPushRef = {} as DatabaseReference;
    mockPush.mockReturnValue(mockPushRef);
  
    // Mock the set function
    const mockSet = set as jest.Mock;
    const mockSetPromise = Promise.resolve();
    mockSet.mockReturnValue(mockSetPromise);
  
    // Call the method
    const result = service.addEvent(data);
    
    // Assertions
    expect(mockRef).toHaveBeenCalledWith(service['db'], service['path']);
    expect(mockPush).toHaveBeenCalledWith(mockRefRef);
    expect(mockSet).toHaveBeenCalledWith(mockPushRef, data);
    expect(result).toBeInstanceOf(Observable);
  });

  it('should update event data', () => {
    const mockUpdate = update as jest.Mock;
    const mockUpdateRef = Promise.resolve();
    mockUpdate.mockReturnValue(mockUpdateRef)

    const result = service.updateData('123', data);
    expect(mockRef).toHaveBeenCalledWith(service['db'], service['path']+ `/123`);
    expect(mockUpdate).toHaveBeenCalledWith(mockRefRef, data);
    expect(result).toBeInstanceOf(Observable)
  })

  it('should remove event data', () => {
    const mockremove = remove as jest.Mock
    const mockRemoveRef = Promise.resolve()
    mockremove.mockReturnValue(mockRemoveRef)

    const result = service.removeEventData('123');
    expect(mockRef).toHaveBeenCalledWith(service['db'], service['path']+ `/123`);
    expect(mockremove).toHaveBeenCalledWith(mockRefRef)
    expect(result).toBeInstanceOf(Observable)
  })

  it('should get event data', () => {
    // Mock the Firebase database reference
    const mockRef = ref as jest.Mock;
    const mockRefRef = {} as DatabaseReference;
    mockRef.mockReturnValue(mockRefRef);
  
    // Mock the query function
    const mockQuery = query as jest.Mock;
    const mockQueryRef = {} as Query;
    mockQuery.mockReturnValue(mockQueryRef);
  
    // Mock the onValue function
    const mockOnValue = onValue as jest.Mock;
    mockOnValue.mockImplementation((ref, callback) => {
      // Immediately call the callback with mock data
      const mockSnapshot = { val: () => '123' } as DataSnapshot;
      callback(mockSnapshot);
      // Return a mock unsubscribe function
      return jest.fn();
    });
  
    // Call the method
    const result = service.getEventData();
    
    // Assertions
    expect(mockRef).toHaveBeenCalledWith(service['db'], service['path']);
    expect(mockQuery).toHaveBeenCalledWith(mockRefRef);
    expect(mockOnValue).toHaveBeenCalledWith(mockQueryRef, expect.any(Function));
  });
});