import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../material-imports';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { MockUserService } from '../../../core/testing/mocks/services/user.service.mock';
import { MockAuthService } from '../../../core/testing/mocks/services/auth.service.mock';
import { mockUser } from '../../../core/testing/mocks/data/user.mock';
import { of } from 'rxjs';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: MockUserService;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        SharedModule,
        ProfileComponent
      ],
      providers: [
        { provide: UserService, useClass: MockUserService },
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as unknown as MockUserService;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;

    // Setup spies
    spyOn(userService, 'getCurrentUser').and.returnValue(of(mockUser));
    spyOn(authService, 'getItem').and.returnValue({ id: mockUser._id });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with user data', () => {
    expect(component.profileForm.get('username')?.value).toBe(mockUser.username);
    expect(component.profileForm.get('email')?.value).toBe(mockUser.email);
    expect(component.profileForm.get('role')?.value).toBe(mockUser.role);
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
    spyOn(userService, 'updateUser').and.returnValue(of(mockUser));
    
    const newValues = {
      username: 'newUsername',
      email: 'new@email.com'
    };
    
    component.profileForm.patchValue(newValues);
    component.user = mockUser;

    component.onSubmit();

    expect(userService.updateUser).toHaveBeenCalledWith(
      mockUser._id!,
      {
        ...mockUser,
        ...newValues
      }
    );
  });

  it('should not submit form when invalid', () => {
    spyOn(userService, 'updateUser');
    
    component.profileForm.patchValue({
      username: '',
      email: 'invalid-email'
    });

    component.onSubmit();

    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it('should handle MFA setup', () => {
    spyOn(userService, 'generateMFA').and.returnValue(of({ qrCode: 'mock-qr-code' }));
    
    component.setupMFA();

    expect(component.showMfaSetup).toBeTrue();
    expect(userService.generateMFA).toHaveBeenCalled();
    expect(component.qrCode).toBe('mock-qr-code');
  });

  it('should handle MFA verification', () => {
    spyOn(userService, 'verifyMFA').and.returnValue(of(true));
    spyOn(component, 'loadUserProfile');
    
    component.showMfaSetup = true;
    component.verifyMFA('123456');

    expect(userService.verifyMFA).toHaveBeenCalledWith('123456');
    expect(component.showMfaSetup).toBeFalse();
    expect(component.loadUserProfile).toHaveBeenCalled();
  });

  it('should load user profile on init', () => {
    expect(authService.getItem).toHaveBeenCalledWith('user');
    expect(userService.getCurrentUser).toHaveBeenCalledWith(mockUser._id!);
    expect(component.user).toEqual(mockUser);
  });
});
