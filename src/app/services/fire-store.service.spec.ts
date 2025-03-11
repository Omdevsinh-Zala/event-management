import { TestBed } from '@angular/core/testing';

import { FireStoreService } from './fire-store.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { doc, DocumentData, Firestore, getDoc, setDoc, getFirestore, provideFirestore, DocumentReference } from '@angular/fire/firestore';
import { environment } from '../../environments/environment.prod';
import { fireStoreUser } from '../forms/module';

jest.mock('@angular/fire/firestore', () => ({
  doc: jest.fn(),
  DocumentData: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  provideFirestore: jest.fn(),
  getFirestore: jest.fn()
}))

describe('FireStoreService', () => {
  let service: FireStoreService;
  let fireStore: jest.Mock<Firestore>;

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

  // it('should add user', async () => {
  //   const data:fireStoreUser = {
  //     email: 'some@thing.com',
  //     role: 'some',
  //     uid: 'someUID'
  //   };
  //   const ref = doc as jest.Mock;
  //   ref.mockReturnValue({})
  //   const set = setDoc as jest.Mock;
  //   set.mockResolvedValue({});
  //   await service.addUser(data, 'some');
  //   expect(set).toHaveBeenCalledWith(ref, data);
  // });
});
