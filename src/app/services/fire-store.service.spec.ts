import { TestBed } from '@angular/core/testing';

import { FireStoreService } from './fire-store.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { doc, DocumentData, Firestore, getDoc, setDoc, getFirestore, DocumentReference, DocumentSnapshot, updateDoc, query, where, collectionData, collection, CollectionReference, QueryFieldFilterConstraint, Query } from '@angular/fire/firestore';
import { environment } from '../../environments/environment.prod';
import { fireStoreUser } from '../forms/module';
import { firstValueFrom, Observable } from 'rxjs';

jest.mock('@angular/fire/firestore', () => ({
  doc: jest.fn(),
  DocumentData: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  provideFirestore: jest.fn(),
  getFirestore: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  collection: jest.fn(),
  collectionData: jest.fn()
}))

describe('FireStoreService', () => {
  let service: FireStoreService;
  let fireStore: jest.Mock<Firestore>;
  
  // Mock document reference
  const mockDocRef = {} as DocumentReference<DocumentData, DocumentData>;
  const mockDoc = doc as jest.Mock;
  mockDoc.mockReturnValue(mockDocRef);

  // Mock setDoc
  const mockSetDoc = setDoc as jest.Mock;
  mockSetDoc.mockResolvedValue({});

  // Mock updateDoc
  const mockUpdateDoc = updateDoc as jest.Mock;
  mockUpdateDoc.mockResolvedValue({});

  // Mock getDoc and its return value
  const data: fireStoreUser = {
    email: 'some@thing.com',
    role: 'some',
    uid: 'someUID',
    events:['1','2']
  };
  const mockSnapshot = {
    data: () => data,
    exists:() => true
  } as unknown as DocumentSnapshot<DocumentData, DocumentData>;
  const mockGetDoc = getDoc as jest.Mock;
  mockGetDoc.mockResolvedValue(mockSnapshot);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(FireStoreService);
    fireStore = getFirestore as jest.Mock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add user', async () => {
    // Execute the method
    const result = await service.addUser(data, 'some');
    
    // Assertions
    expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', 'some');
    expect(mockSetDoc).toHaveBeenCalledWith(mockDocRef, data);
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    expect(result).toEqual(data);
  });

  it('should get all users', async () => {
    service.loggedUser.set = jest.fn();
    const result = await service.getUsers('some');
    expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', 'some');
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    if(mockSnapshot.exists()) {
      expect(service.loggedUser.set).toHaveBeenCalledWith(mockSnapshot.data());
      expect(result).toEqual({ ...mockSnapshot.data() })
    }
  })

  it('should return null if there are no user', async () => {
    const mockTempSnapshot = {
      data: () => data,
      exists:() => false
    } as unknown as DocumentSnapshot<DocumentData, DocumentData>;
    mockGetDoc.mockResolvedValue(mockTempSnapshot);
    const result = await service.getUsers('some');
    expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', 'some');
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    expect(result).toEqual(null);
  })

  it('should add new event if there are already events registered', async () => {
    const result = await service.addEventData('some','3');
    expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', 'some');
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    let data;
    if(mockSnapshot.data()!['events']) {
      const array = mockSnapshot.data()!['events'];
      array.push('3');
      data = { events: array };
    }
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, data);
  });

  it('should remove event', async () => {
    await service.removeEventData('some', '2');
    expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', 'some');
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    const array = mockSnapshot.data()!['events'].filter((uid: string) => uid !== '2');
    let data = { events: array };
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, data);
  });

  it('should add new event if there are no events registered', async () => {
    const data: Omit<fireStoreUser, 'events'> = {
      email: 'some@thing.com',
      role: 'some',
      uid: 'someUID',
    };
    const mockSnapshot = {
      data: () => data,
      exists:() => true
    } as unknown as DocumentSnapshot<DocumentData, DocumentData>;
    const mockGetDoc = getDoc as jest.Mock;
    mockGetDoc.mockResolvedValue(mockSnapshot);
    const result = await service.addEventData('some','3');
    expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', 'some');
    expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
    let newData = { events: ['3'] }
    expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, newData);
  })

  it('should get user from event', async () => {
    jest.useFakeTimers();
    const mockCollection = collection as jest.Mock;
    const mockCollectioRef = {} as CollectionReference<DocumentData, DocumentData>
    mockCollection.mockReturnValue(mockCollectioRef);

    const mockWhere = where as jest.Mock
    const mockWhereRef = {} as QueryFieldFilterConstraint;
    mockWhere.mockReturnValue(mockWhereRef);

    const mockQuery = query as jest.Mock;
    const mockQueryRef = {} as Query<DocumentData, DocumentData>
    mockQuery.mockReturnValue(mockQueryRef);

    const mockCollectioData = collectionData as jest.Mock
    const mockCollectioDataRef = {} as Observable<(DocumentData | (DocumentData & {}))[]>
    mockCollectioData.mockResolvedValue(mockCollectioDataRef)

    const result = await service.getUserFromEvent('2')
    jest.advanceTimersByTime(300);

    expect(mockCollection).toHaveBeenCalledWith(service['fireStore'], 'users')
    expect(mockWhere).toHaveBeenCalledWith('events', 'array-contains', '2');
    expect(mockQuery).toHaveBeenCalledWith(mockCollectioRef, mockWhereRef);
    expect(mockCollectioData).toHaveBeenCalledWith(mockQueryRef)
    expect(result).toEqual(mockCollectioDataRef);
    jest.useRealTimers()
  })
});
