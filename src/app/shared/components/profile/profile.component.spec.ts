import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../material-imports';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { MockProfileService } from '../../../core/testing/mocks/services/profile.service.mock';
import { MockAuthService } from '../../../core/testing/mocks/services/auth.service.mock';
import { mockProfileUser } from '../../../core/testing/mocks/data/profile.mock';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', [
      'getCurrentUser',
      'updateUser',
      'generateMFA',
      'verifyMFA'
    ]);
    const authSpy = jasmine.createSpyObj('AuthService', ['getItem']);

    userSpy.getCurrentUser.and.returnValue(of(mockProfileUser));
    userSpy.updateUser.and.returnValue(of(mockProfileUser));
    userSpy.generateMFA.and.returnValue(of({ qrCode: 'mock-qr-code' }));
    userSpy.verifyMFA.and.returnValue(of(true));
    authSpy.getItem.and.returnValue({ id: mockProfileUser._id });

    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileComponent
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', () => {
    expect(component.profileForm.get('username')?.value).toBe(mockProfileUser.username);
    expect(component.profileForm.get('email')?.value).toBe(mockProfileUser.email);
  });

  it('should validate required fields', () => {
    const form = component.profileForm;
    
    form.patchValue({
      username: '',
      email: ''
    });

    expect(form.valid).toBeFalsy();
    expect(form.get('username')?.errors?.['required']).toBeTruthy();
    expect(form.get('email')?.errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.profileForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.errors?.['email']).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.errors).toBeNull();
  });

  it('should handle form submission when valid', () => {
    const newValues = {
      username: 'newUsername',
      email: 'new@email.com'
    };
    
    component.profileForm.patchValue(newValues);
    component.user = mockProfileUser;

    component.onSubmit();

    expect(userService.updateUser).toHaveBeenCalledWith(
      mockProfileUser._id!,
      {
        ...mockProfileUser,
        ...newValues
      }
    );
  });

  it('should not submit form when invalid', () => {
    component.profileForm.patchValue({
      username: '',
      email: 'invalid-email'
    });

    component.onSubmit();

    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('should handle MFA setup', () => {
    component.setupMFA();

    expect(component.showMfaSetup).toBeTrue();
    expect(userService.generateMFA).toHaveBeenCalled();
    expect(component.qrCode).toBe('mock-qr-code');
  });

  it('should handle MFA verification', () => {
    component.showMfaSetup = true;
    component.verifyMFA('123456');

    expect(userService.verifyMFA).toHaveBeenCalledWith('123456');
    expect(component.showMfaSetup).toBeFalse();
  });

  it('should load user profile on init', () => {
    expect(authService.getItem).toHaveBeenCalledWith('user');
    expect(userService.getCurrentUser).toHaveBeenCalledWith(mockProfileUser._id!);
    expect(component.user).toEqual(mockProfileUser);
  });
});
