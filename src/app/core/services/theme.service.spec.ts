import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { ThemeManager } from './theme-manager.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
    document.body.classList.remove('dark-theme');

    TestBed.configureTestingModule({
      providers: [ThemeService, ThemeManager]
    });
    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark-theme');
    document.body.classList.remove('dark-theme');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize from bankticket-theme in localStorage', () => {
    localStorage.setItem('bankticket-theme', 'dark');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ThemeService, ThemeManager]
    });
    const s = TestBed.inject(ThemeService);
    expect(s.isDarkMode()).toBeTrue();
    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();
  });

  it('should toggle dark mode via ThemeManager', () => {
    const initial = service.isDarkMode();
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBe(!initial);
  });

  it('should set dark mode and persist bankticket-theme', () => {
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBeTrue();
    expect(localStorage.getItem('bankticket-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark-theme')).toBeTrue();

    service.setDarkMode(false);
    expect(service.isDarkMode()).toBeFalse();
    expect(localStorage.getItem('bankticket-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark-theme')).toBeFalse();
  });

  it('should not use body.dark-theme (solo html)', () => {
    service.setDarkMode(true);
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });
});
