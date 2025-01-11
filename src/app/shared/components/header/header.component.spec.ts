/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeManager } from '../../../core/services/theme-manager.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { SharedModule } from '../../material-imports';
import { SocketService } from '../../../core/services/socket.service';
import { Component } from '@angular/core';
import { MockSocketService } from '../../../core/testing/mocks/services/socket.service.mock';
import { MockAuthService } from '../../../core/testing/mocks/services/auth.service.mock';

// Componente mock para la ruta de login
@Component({
  template: ''
})
class DummyComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let themeManager: jasmine.SpyObj<ThemeManager>;
  let router: Router;
  let socketService: MockSocketService;

  beforeEach(async () => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const themeManagerSpy = jasmine.createSpyObj('ThemeManager', ['getPreferredTheme', 'changeTheme'], {
      isDark$: of(false)
    });

    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        HeaderComponent,
        NotificationsComponent,
        SharedModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'auth/login', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: ThemeManager, useValue: themeManagerSpy },
        { provide: SocketService, useClass: MockSocketService }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    themeManager = TestBed.inject(ThemeManager) as jasmine.SpyObj<ThemeManager>;
    router = TestBed.inject(Router);
    socketService = TestBed.inject(SocketService) as unknown as MockSocketService;

    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isDark$ observable on init', () => {
    component.ngOnInit();
    component.isDark$.subscribe(isDark => {
      expect(isDark).toBeFalse();
    });
  });

  it('should emit menuToggled event when toggleMenu is called', () => {
    spyOn(component.menuToggled, 'emit');
    component.toggleMenu();
    expect(component.menuToggled.emit).toHaveBeenCalled();
  });

  describe('toggleTheme', () => {
    it('should change theme from dark to light', () => {
      themeManager.getPreferredTheme.and.returnValue('dark');
      component.toggleTheme();
      expect(themeManager.changeTheme).toHaveBeenCalledWith('light');
    });

    it('should change theme from light to dark', () => {
      themeManager.getPreferredTheme.and.returnValue('light');
      component.toggleTheme();
      expect(themeManager.changeTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      component.isLoggingOut = false;
      snackBar.open.calls.reset();
    });

    it('should not proceed if already logging out', fakeAsync(() => {
      const logoutSpy = spyOn(authService, 'logout');
      component.isLoggingOut = true;
      
      component.logout();
      
      expect(logoutSpy).not.toHaveBeenCalled();
      flush();
    }));

    it('should handle successful logout', fakeAsync(() => {
      const logoutSpy = spyOn(authService, 'logout').and.returnValue(of(void 0));
      
      component.logout();
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(component.isLoggingOut).toBeFalse();
      
      flush();
    }));

    it('should handle logout error', fakeAsync(() => {
      const error = { error: { message: 'Error test' } };
      const logoutSpy = spyOn(authService, 'logout').and.returnValue(throwError(() => error));
      
      component.logout();
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(component.isLoggingOut).toBeFalse();
      
      flush();
    }));

    it('should handle logout error with default message when no error message provided', fakeAsync(() => {
      const logoutSpy = spyOn(authService, 'logout').and.returnValue(throwError(() => ({})));
      
      component.logout();
      tick();
      
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
      expect(component.isLoggingOut).toBeFalse();
      
      flush();
    }));
  });
});
