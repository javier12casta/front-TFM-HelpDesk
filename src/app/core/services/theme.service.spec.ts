import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem']);
    Object.defineProperty(window, 'localStorage', { value: spy });
    localStorageSpy = window.localStorage as jasmine.SpyObj<Storage>;

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with saved theme from localStorage', () => {
    localStorageSpy.getItem.and.returnValue('dark');
    service = TestBed.inject(ThemeService);
    expect(service.isDarkMode()).toBeTrue();
  });

  it('should toggle dark mode', () => {
    service = TestBed.inject(ThemeService);
    const initialState = service.isDarkMode();
    service.toggleDarkMode();
    expect(service.isDarkMode()).toBe(!initialState);
  });

  it('should set dark mode', () => {
    service = TestBed.inject(ThemeService);
    service.setDarkMode(true);
    expect(service.isDarkMode()).toBeTrue();
    expect(localStorageSpy.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should update body class when setting dark mode', () => {
    service = TestBed.inject(ThemeService);
    service.setDarkMode(true);
    expect(document.body.classList.contains('dark-theme')).toBeTrue();
    
    service.setDarkMode(false);
    expect(document.body.classList.contains('dark-theme')).toBeFalse();
  });
}); 