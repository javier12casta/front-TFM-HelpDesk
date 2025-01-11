import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { first } from 'rxjs/operators';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService]
    });
    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with loading false', (done) => {
    service.loading$.pipe(first()).subscribe(loading => {
      expect(loading).toBeFalse();
      done();
    });
  });

  it('should show loader', (done) => {
    service.show();
    service.loading$.pipe(first()).subscribe(loading => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it('should hide loader', (done) => {
    service.show();
    service.hide();
    service.loading$.pipe(first()).subscribe(loading => {
      expect(loading).toBeFalse();
      done();
    });
  });
}); 