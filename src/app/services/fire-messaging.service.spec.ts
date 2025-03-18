import { TestBed } from '@angular/core/testing';

import { FireMessagingService } from './fire-messaging.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../environments/environment';
import { getToken } from '@angular/fire/messaging';
import { doc, DocumentData, DocumentReference, DocumentSnapshot, Firestore, getDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';
import { fireStoreUser } from '../forms/module';

jest.mock('@angular/fire/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    updateDoc: jest.fn(),
    getFirestore: jest.fn()
}))

jest.mock('@angular/common', () => ({
  isPlatformBrowser: jest.fn()
}));

jest.mock('@angular/fire/messaging', () => ({
  getToken: jest.fn(),
  getMessaging: jest.fn()
}));

describe('FireMessagingService', () => {
  let service: FireMessagingService;
  let fireStore: jest.Mock<Firestore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers:[
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        provideAuth(() => getAuth()),
      ]
    });
    service = TestBed.inject(FireMessagingService);
    fireStore = getFirestore as jest.Mock;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize firebase messaging service and not register if worker already exisits working', async () => {
    //Mock Notification
    const mockNotificationRef = 'granted' as NotificationPermission;
    Object.defineProperty(window, 'Notification', {
    value: {
      requestPermission: jest.fn().mockResolvedValue(mockNotificationRef)
    },
    writable: true
    });
    
    //Mock get service worker registration
    const mockSerivceWorkersRef = [{active: { scriptURL:'firebase-messaging-sw.js' }, }] as unknown as readonly ServiceWorkerRegistration[];
    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker : {
          getRegistrations: jest.fn().mockResolvedValue(mockSerivceWorkersRef)
        }
      },
      writable: false
    })

    // mockSerivceWorkersRef.find = jest.fn().mockReturnValue(mockSerivceWorkersRef);
    service['sendConfigToServiceWorker'] = jest.fn();
    service.requestPermission = jest.fn();

    await service.initializeFirebaseMessaging();
    expect(Notification.requestPermission).toHaveBeenCalled();
    expect(navigator.serviceWorker.getRegistrations).toHaveBeenCalled();
    expect(service['sendConfigToServiceWorker']).toHaveBeenCalledWith({ scriptURL:'firebase-messaging-sw.js' })
    expect(service.requestPermission).toHaveBeenCalled()
  })

  it('should create new service worker',  async () => {
    //Mock Notification
    const mockNotificationRef = 'granted' as NotificationPermission;
    Object.defineProperty(window, 'Notification', {
    value: {
      requestPermission: jest.fn().mockResolvedValue(mockNotificationRef)
    },
    writable: true
    });
    
    //Mock get service worker registration
    const mockSerivceWorkersRef = [{active: { scriptURL:'' }, }] as unknown as readonly ServiceWorkerRegistration[];
    const mockRegisterSerivceWorkersRef = [{active: { scriptURL:'/firebase-messaging-sw.js' }, }] as unknown as readonly ServiceWorkerRegistration[];
    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker : {
          getRegistrations: jest.fn().mockResolvedValue(mockSerivceWorkersRef),
          register: jest.fn().mockResolvedValue(mockRegisterSerivceWorkersRef)
        }
      },
      writable: false
    })
    await service.initializeFirebaseMessaging();
    expect(Notification.requestPermission).toHaveBeenCalled();
    expect(navigator.serviceWorker.getRegistrations).toHaveBeenCalled();
    expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/firebase-messaging-sw.js');
  })

  it('should initialize firebase messaging service and not register if worker already exisits working', async () => {
    //Mock Notification
    const mockNotificationRef = 'granted' as NotificationPermission;
    Object.defineProperty(window, 'Notification', {
    value: {
      requestPermission: jest.fn().mockResolvedValue(mockNotificationRef)
    },
    writable: true
    });
    
    //Mock get service worker registration
    const mockSerivceWorkersRef = [{active: { scriptURL:'firebase-messaging-sw.js' }, }] as unknown as readonly ServiceWorkerRegistration[];
    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker : {
          getRegistrations: jest.fn().mockResolvedValue(mockSerivceWorkersRef)
        }
      },
      writable: false
    })

    // mockSerivceWorkersRef.find = jest.fn().mockReturnValue(mockSerivceWorkersRef);
    service['sendConfigToServiceWorker'] = jest.fn();
    service.requestPermission = jest.fn().mockRejectedValue(new Error('Async error'));
    console.error = jest.fn();
    await service.initializeFirebaseMessaging();
    expect(Notification.requestPermission).toHaveBeenCalled();
    expect(navigator.serviceWorker.getRegistrations).toHaveBeenCalled();
    expect(service['sendConfigToServiceWorker']).toHaveBeenCalledWith({ scriptURL:'firebase-messaging-sw.js' })
    expect(service.requestPermission).rejects.toThrow('Async error');
  })

  it('should send config to service worker', () => {
    const mockSerivceWorkersRef = { postMessage: jest.fn() } as unknown as ServiceWorker;
    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker : {
          postMessage: jest.fn()
        }
      },
      writable: true
    })
    const postMessage = {
      type: 'INIT_FIREBASE',
      config: environment.firebaseConfig
    }
    service['sendConfigToServiceWorker'](mockSerivceWorkersRef);
    expect(mockSerivceWorkersRef.postMessage).toHaveBeenCalledWith(postMessage)
  })

  it('should return early if not in browser platform', async () => {
    // Mock isPlatformBrowser to return false
    (isPlatformBrowser as jest.Mock).mockReturnValue(false);
    
    // Set other conditions to true to ensure we're testing just the platform check
    service['messaging'] = {} as any;
    const originalEnv = environment.production;
    environment.production = true;
    
    await service.requestPermission();
    
    // Verify getToken was not called
    expect(getToken).not.toHaveBeenCalled();
    
    // Reset environment
    environment.production = originalEnv;
  });

  it('should return early if messaging is not available', async () => {
    // Mock isPlatformBrowser to return true
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    
    // Set messaging to undefined/null
    service['messaging'] = null;
    const originalEnv = environment.production;
    environment.production = true;
    
    await service.requestPermission();
    
    // Verify getToken was not called
    expect(getToken).not.toHaveBeenCalled();
    
    // Reset environment
    environment.production = originalEnv;
  });

  it('should return early if not in production environment', async () => {
    // Mock isPlatformBrowser to return true
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    
    // Set messaging to a valid object
    service['messaging'] = {} as any;
    
    // Set production to false
    const originalEnv = environment.production;
    environment.production = false;
    
    await service.requestPermission();
    
    // Verify getToken was not called
    expect(getToken).not.toHaveBeenCalled();
    
    // Reset environment
    environment.production = originalEnv;
  });

  it('should call getToken and storeTokenToUser when all conditions pass and token is returned', async () => {
    // Mock isPlatformBrowser to return true
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    
    // Set messaging to a valid object
    service['messaging'] = {} as any;
    
    // Set production to true
    const originalEnv = environment.production;
    environment.production = true;
    
    // Mock getToken to return a token
    const mockToken = 'mock-fcm-token';
    (getToken as jest.Mock).mockResolvedValue(mockToken);
    
    // Mock the storeTokenToUser method
    service['storeTokenToUser'] = jest.fn().mockResolvedValue(undefined);
    
    await service.requestPermission();
    
    // Verify getToken was called with correct params
    expect(getToken).toHaveBeenCalledWith(service['messaging'], { vapidKey: environment.vapidKey });
    
    // Verify storeTokenToUser was called with the token
    expect(service['storeTokenToUser']).toHaveBeenCalledWith(mockToken);
    
    // Reset environment
    environment.production = originalEnv;
  });

  it('should not call storeTokenToUser when token is not returned', async () => {
    // Mock isPlatformBrowser to return true
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    
    // Set messaging to a valid object
    service['messaging'] = {} as any;
    
    // Set production to true
    const originalEnv = environment.production;
    environment.production = true;
    
    // Mock getToken to return null/undefined
    (getToken as jest.Mock).mockResolvedValue(null);
    
    // Mock the storeTokenToUser method
    service['storeTokenToUser'] = jest.fn().mockResolvedValue(undefined);
    
    await service.requestPermission();
    
    // Verify getToken was called
    expect(getToken).toHaveBeenCalled();
    
    // Verify storeTokenToUser was not called
    expect(service['storeTokenToUser']).not.toHaveBeenCalled();
    
    // Reset environment
    environment.production = originalEnv;
  });

  it('should handle errors when getToken fails', async () => {
    // Mock isPlatformBrowser to return true
    (isPlatformBrowser as jest.Mock).mockReturnValue(true);
    
    // Set messaging to a valid object
    service['messaging'] = {} as any;
    
    // Set production to true
    const originalEnv = environment.production;
    environment.production = true;
    
    // Mock getToken to throw an error
    const mockError = new Error('Token retrieval failed');
    (getToken as jest.Mock).mockRejectedValue(mockError);
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await service.requestPermission();
    
    // Verify getToken was called
    expect(getToken).toHaveBeenCalled();
    
    // Verify console.error was called with the error
    expect(console.error).toHaveBeenCalledWith(mockError);
    
    // Reset environment
    environment.production = originalEnv;
  });

  it('should store the token to user database', async () => {
    // Mock document reference
  const mockDocRef = {} as DocumentReference<DocumentData, DocumentData>;
  const mockDoc = doc as jest.Mock;
  mockDoc.mockReturnValue(mockDocRef);

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

  await service['storeTokenToUser']('123');
  expect(mockDoc).toHaveBeenCalledWith(service['fireStore'], 'users', service['auth'].getuid());
  expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
  const newData = { FCMToken: '123' };
  expect(mockUpdateDoc).toHaveBeenCalledWith(mockDocRef, newData)
  })
});