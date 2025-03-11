import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { provideHttpClient } from '@angular/common/http';

// Mock the getDatabase function
const mockDatabase = {};
const mockGetDatabase = () => mockDatabase;

describe('EventService', () => {
  let service: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EventService,
        provideHttpClient(),
        // Override the real getDatabase with a mock
        { provide: 'Database', useValue: mockDatabase }, // Optional: Provide a mock database instance
      ],
    });

    // Spy on the constructor's getDatabase call if needed (not required here)
    service = TestBed.inject(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

// Manually patch the EventService to use the mock in the constructor
jest.mock('@angular/fire/database', () => ({
  getDatabase: () => mockDatabase,
}));