/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { mockRegisterData } from '../../core/testing/mocks/data/auth.mock';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        BrowserAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize register form with empty fields', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();
    
    form.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });
    
    expect(form.valid).toBeTruthy();
  });

  it('should validate password match', () => {
    const form = component.registerForm;
    
    form.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'different'
    });
    
    expect(form.hasError('mismatch')).toBeTruthy();
    
    form.patchValue({
      confirmPassword: 'password123'
    });
    
    expect(form.hasError('mismatch')).toBeFalsy();
  });

  it('should handle successful registration', fakeAsync(() => {
    authService.register.and.returnValue(of({ message: 'Registration successful' }));
    
    component.registerForm.patchValue({
      username: mockRegisterData.username,
      email: mockRegisterData.email,
      password: mockRegisterData.password,
      confirmPassword: mockRegisterData.password
    });
    
    component.onSubmit();
    tick(100);
    
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    
    flush();
  }));


  it('should navigate to login page', () => {
    component.login();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
