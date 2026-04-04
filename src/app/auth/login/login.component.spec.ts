/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../core/services/auth.service';
import { MfaService } from '../../core/services/mfa.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { mockLoginResponse } from '../../core/testing/mocks/data/auth.mock';
import { MfaResponse } from '../../core/interfaces/mfa.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let mfaService: jasmine.SpyObj<MfaService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'setItem']);
    const mfaSpy = jasmine.createSpyObj('MfaService', ['generateMFA', 'verifyAndEnableMFA', 'validateMFA']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: MfaService, useValue: mfaSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mfaService = TestBed.inject(MfaService) as jasmine.SpyObj<MfaService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty fields', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('mfaToken')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.loginForm;
    expect(form.valid).toBeFalsy();
    
    form.controls['email'].setValue('test@example.com');
    form.controls['password'].setValue('password123');
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls['email'];
    
    emailControl.setValue('invalid-email');
    expect(emailControl.errors?.['email']).toBeTruthy();
    
    emailControl.setValue('valid@email.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should handle MFA setup requirement', fakeAsync(() => {
    const mfaResponse = { ...mockLoginResponse, requiresMfaSetup: true, requiresMfaValidation: false };
    authService.login.and.returnValue(of(mfaResponse));
    mfaService.generateMFA.and.returnValue(of({
      data: {
        secret: 'test-secret',
        qrCodeUrl: 'test-qr-url'
      }
    }));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      mfaToken: ''
    });

    component.login();
    tick(100);

    expect(component.showMfaSetup).toBeTrue();
    expect(component.qrCodeUrl).toBe('test-qr-url');
  }));

  it('should show MFA code step when validation is required', fakeAsync(() => {
    const mfaResponse = {
      ...mockLoginResponse,
      requiresMfaSetup: false,
      requiresMfaValidation: true
    };
    authService.login.and.returnValue(of(mfaResponse));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      mfaToken: ''
    });

    component.login();
    tick();
    flush();

    expect(component.showMfaInput).toBeTrue();
    expect(mfaService.validateMFA).not.toHaveBeenCalled();
  }));

  it('should navigate when login does not require MFA steps', fakeAsync(() => {
    authService.login.and.returnValue(of(mockLoginResponse));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      mfaToken: ''
    });

    component.login();
    tick();
    flush();

    expect(router.navigate).toHaveBeenCalledWith(['/app']);
  }));

  it('should navigate to register page', () => {
    component.register();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/register']);
  });

  describe('MFA Methods', () => {
    it('should handle MFA setup successfully', fakeAsync(() => {
      const mockMfaResponse: MfaResponse = {
        data: {
          qrCodeUrl: 'test-qr-url',
          secret: 'test-secret'
        }
      };

      mfaService.generateMFA.and.returnValue(of({
        data: {
          secret: mockMfaResponse.data.secret,
          qrCodeUrl: mockMfaResponse.data.qrCodeUrl
        }
      }));

      component['handleMfaSetup']('test-user-id');
      tick();
      flush();

      expect(component.qrCodeUrl).toBe('test-qr-url');
      expect(component.mfaSecret).toBe('test-secret');
      expect(component.showMfaSetup).toBeTrue();
      expect(component.isLoading).toBeFalse();
    }));

    it('should handle MFA setup error', fakeAsync(() => {
      mfaService.generateMFA.and.returnValue(throwError(() => new Error('MFA Error')));
      
      component['handleMfaSetup']('test-user-id');
      tick();
      flush();
      
      expect(component.isLoading).toBeFalse();
    }));

    describe('verifyAndEnableMfa', () => {
      it('should handle successful MFA verification', fakeAsync(() => {
        const mockResponse = {
          data: { verified: true },
          token: 'test-token'
        };
        
        component.loginForm.get('mfaToken')?.setValue('123456');
        mfaService.verifyAndEnableMFA.and.returnValue(of(mockResponse));
        
        component.verifyAndEnableMfa('test-user-id');
        tick();
        flush();

        expect(router.navigate).toHaveBeenCalledWith(['/app']);
      }));

      it('should handle invalid verification code', fakeAsync(() => {
        const mockResponse = {
          data: { verified: false }
        };
        
        component.loginForm.get('mfaToken')?.setValue('123456');
        mfaService.verifyAndEnableMFA.and.returnValue(of(mockResponse));
        
        component.verifyAndEnableMfa('test-user-id');
        tick();
        flush();

        expect(component.isLoading).toBeFalse();
      }));
    });

    describe('validateMfa', () => {
      it('should show error when token is empty', fakeAsync(() => {
        component.loginForm.get('mfaToken')?.setValue('');
        component.validateMfa('test-user-id');
        flush();

        expect(snackBar.open).not.toHaveBeenCalled();
      }));

      it('should handle successful MFA validation', fakeAsync(() => {
        const mockResponse = { success: true, data: { verified: true } };

        component.loginForm.get('mfaToken')?.setValue('123456');
        mfaService.validateMFA.and.returnValue(of(mockResponse));

        component.validateMfa('test-user-id');
        tick();
        flush();

        expect(router.navigate).toHaveBeenCalledWith(['/app']);
      }));

      it('should handle invalid validation code', fakeAsync(() => {
        component.loginForm.get('mfaToken')?.setValue('123456');
        mfaService.validateMFA.and.returnValue(of({ success: true, data: { verified: false } }));

        component.validateMfa('test-user-id');
        tick();
        flush();

        expect(mfaService.validateMFA).toHaveBeenCalled();
        expect(component.isLoading).toBeFalse();
      }));
    });

    describe('handleSuccessfulLogin', () => {
      it('should handle successful login with token', fakeAsync(() => {
        const mockResponse = { token: 'test-token' };
        
        component.handleSuccessfulLogin(mockResponse);
        flush();

        expect(router.navigate).toHaveBeenCalledWith(['/app']);
      }));

      it('should handle successful login without token when MFA verified', fakeAsync(() => {
        const mockResponse = { data: { verified: true } };

        component.handleSuccessfulLogin(mockResponse);
        flush();

        expect(router.navigate).toHaveBeenCalledWith(['/app']);
      }));

      it('should not navigate without token and without MFA verified', fakeAsync(() => {
        const mockResponse = {};

        component.handleSuccessfulLogin(mockResponse);
        flush();

        expect(router.navigate).not.toHaveBeenCalledWith(['/app']);
      }));
    });
  });
});
