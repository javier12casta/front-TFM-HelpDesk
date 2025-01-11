import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AreaService } from './area.service';
import { environment } from '../../../environments/environment';

describe('AreaService', () => {
  let service: AreaService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AreaService]
    });
    service = TestBed.inject(AreaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all areas', () => {
    const mockAreas = [
      { id: '1', name: 'IT' },
      { id: '2', name: 'HR' }
    ];

    service.getAllAreas().subscribe(areas => {
      expect(areas).toEqual(mockAreas);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/areas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAreas);
  });
}); 