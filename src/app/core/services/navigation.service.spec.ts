import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavigationService } from './navigation.service';

describe('NavigationService', () => {
  let service: NavigationService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: Router, useValue: spy }
      ]
    });
    service = TestBed.inject(NavigationService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should navigate to specified route on cancel', () => {
    const route = '/home';
    service.cancel(route);
    expect(routerSpy.navigate).toHaveBeenCalledWith([route]);
  });
}); 