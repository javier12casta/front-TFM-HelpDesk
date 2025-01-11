/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LayoutComponent } from './layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ThemeService } from '../../../core/services/theme.service';
import { MockThemeService } from '../../../core/testing/mocks/services/theme.service.mock';
import { Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let breakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let themeService: MockThemeService;
  let breakpointSubject: Subject<BreakpointState>;

  beforeEach(waitForAsync(() => {
    breakpointSubject = new Subject<BreakpointState>();
    breakpointObserver = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    breakpointObserver.observe.and.returnValue(breakpointSubject);

    TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserver },
        { provide: ThemeService, useClass: MockThemeService }
      ]
    }).compileComponents();

    themeService = TestBed.inject(ThemeService) as unknown as MockThemeService;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isDarkMode$ observable on init', () => {
    component.ngOnInit();
    component.isDarkMode$.subscribe(isDark => {
      expect(isDark).toBeFalse();
    });
  });

  describe('Responsive behavior', () => {
    it('should handle mobile layout', fakeAsync(() => {
      // Mock sidenav
      component.sidenav = {
        mode: 'side',
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
      } as unknown as MatSidenav;

      // Emit mobile breakpoint
      breakpointSubject.next({
        matches: true,
        breakpoints: { '(max-width: 800px)': true }
      });
      
      tick(1); // Account for the delay(1)

      expect(component.isMobile).toBeTrue();
      expect(component.sidenav.mode).toBe('over');
      expect(component.sidenav.close).toHaveBeenCalled();
    }));

    it('should handle desktop layout', fakeAsync(() => {
      // Mock sidenav
      component.sidenav = {
        mode: 'over',
        close: jasmine.createSpy('close'),
        open: jasmine.createSpy('open')
      } as unknown as MatSidenav;

      // Emit desktop breakpoint
      breakpointSubject.next({
        matches: false,
        breakpoints: { '(max-width: 800px)': false }
      });
      
      tick(1); // Account for the delay(1)

      expect(component.isMobile).toBeFalse();
      expect(component.sidenav.mode).toBe('side');
      expect(component.sidenav.open).toHaveBeenCalled();
    }));
  });

  describe('toggleSidenav', () => {
    it('should toggle sidenav', () => {
      component.sidenav = {
        toggle: jasmine.createSpy('toggle')
      } as unknown as MatSidenav;

      component.toggleSidenav();
      
      expect(component.sidenav.toggle).toHaveBeenCalled();
    });
  });
});
