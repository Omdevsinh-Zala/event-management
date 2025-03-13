import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { AuthService } from './auth.service';
import { RegisterUser } from '../forms/module';
import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut, updateProfile } from '@angular/fire/auth'; // Import the correct function
import { getFirestore } from '@angular/fire/firestore';

// Mock Firebase Auth module
jest.mock('@angular/fire/auth', () => ({
  getAuth: jest.fn(() => ({})),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  signInWithEmailAndPassword: jest.fn(), // Mock signInWithEmailAndPassword instead
  signOut: jest.fn(),
  deleteUser: jest.fn()
}));

jest.mock('@angular/fire/firestore', () => ({
  getFirestore: jest.fn()
}))

describe('LoginService', () => {
  let service: LoginService;
  let authService: AuthService;

  // Mock AuthService
  const authServiceMock = {
    getAuth: jest.fn(() => ({})),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        { provide: AuthService, useValue: authServiceMock },
      ],
    });

    service = TestBed.inject(LoginService);
    authService = TestBed.inject(AuthService);

    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user with email and password', async () => { // Updated test description
    const data: RegisterUser = {
      email: 'some@thing.com',
      password: '**',
    };

    // Mock the auth object returned by getAuth
    const authMock = {};
    authServiceMock.getAuth.mockReturnValue(authMock);

    // Mock signInWithEmailAndPassword response
    const userCredentialMock = { user: { uid: '123' } };
    const signInWithEmail = signInWithEmailAndPassword as jest.Mock;
    signInWithEmail.mockResolvedValue(userCredentialMock);

    // Call the loginWithEmail method
    await service.loginWithEmail(data);

    // Verify the mock was called with the correct arguments
    expect(signInWithEmail).toHaveBeenCalledWith(
      service['authService'].getAuth(),
      data.email,
      data.password
    );
  });

  it('should create user with email and password', async () => { // Updated test description
    const data: RegisterUser = {
      email: 'some@thing.com',
      password: '**',
    };

    // Mock the auth object returned by getAuth
    const authMock = {};
    authServiceMock.getAuth.mockReturnValue(authMock);

    // Mock signUpWithEmailAndPassword response
    const userCredentialMock = { user: { uid: '123' } };
    const signUpWithEmail = createUserWithEmailAndPassword as jest.Mock;
    signUpWithEmail.mockResolvedValue(userCredentialMock);

    (updateProfile as jest.Mock).mockResolvedValue(undefined);

    // Call the loginWithEmail method
    await service.signupWithEmail(data);

    // Verify the mock was called with the correct arguments
    expect(signUpWithEmail).toHaveBeenCalledWith(
      service['authService'].getAuth(),
      data.email,
      data.password
    );
    expect(updateProfile).toHaveBeenCalledWith(userCredentialMock.user, {
      displayName: 'some', // data.email.split('@')[0]
    });
  });

  it('should signOut user', async () => {
    const authMock = {};
    authServiceMock.getAuth.mockReturnValue(authMock);
    (signOut as jest.Mock).mockResolvedValue(undefined);
    await service.singOut();
  });

  it('should delete user', async () => {
    const authMock = {};
    authServiceMock.getAuth.mockReturnValue(authMock);
    (deleteUser as jest.Mock).mockResolvedValue(undefined);
    await service.deleteUser();
  })
});