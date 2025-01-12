import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get current user', () => {
    const mockUser: User = {
      _id: '1',
      username: 'testuser',
      email: 'test@test.com',
      role: 'user',
      isActive: true,
      mfaEnabled: false
    };

    service.getCurrentUser('1').subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users/1`);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockUser });
  });

  it('should update user', () => {
    const userId = '1';
    const updateData = {
      username: 'updateduser',
      email: 'updated@test.com'
    };

    const mockUpdatedUser: User = {
      _id: '1',
      username: 'updateduser',
      email: 'updated@test.com',
      role: 'user',
      isActive: true,
      mfaEnabled: false
    };

    service.updateUser(userId, updateData).subscribe(user => {
      expect(user).toEqual(mockUpdatedUser);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users/${userId}`);
    expect(req.request.method).toBe('PUT');
    req.flush({ data: mockUpdatedUser });
  });

  it('should generate MFA', () => {
    const mockMfaResponse = {
      secret: 'test-secret',
      qrCodeUrl: 'test-qr-url'
    };

    service.generateMFA().subscribe(response => {
      expect(response).toEqual(mockMfaResponse);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users/mfa/generate`);
    expect(req.request.method).toBe('POST');
    req.flush(mockMfaResponse);
  });

  it('should verify MFA', () => {
    const token = '123456';
    const mockResponse = { success: true };

    service.verifyMFA(token).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users/mfa/verify`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token });
    req.flush(mockResponse);
  });

  it('should validate MFA', () => {
    const token = '123456';
    const email = 'test@test.com';
    const mockResponse = { success: true };

    service.validateMFA(token, email).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users/mfa/validate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token, email });
    req.flush(mockResponse);
  });

  it('should get all users', () => {
    const mockUsers: User[] = [
      {
        _id: '1',
        username: 'user1',
        email: 'user1@test.com',
        role: 'user',
        isActive: true,
        mfaEnabled: false
      },
      {
        _id: '2',
        username: 'user2',
        email: 'user2@test.com',
        role: 'admin',
        isActive: true,
        mfaEnabled: true
      }
    ];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should delete user', () => {
    const userId = '1';

    service.deleteUser(userId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 