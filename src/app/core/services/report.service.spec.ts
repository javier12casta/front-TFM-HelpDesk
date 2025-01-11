import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReportService } from './report.service';
import { environment } from '../../../environments/environment';
import { TicketStats, AreaStats, CategoryStats } from '../interfaces/report.interface';

describe('ReportService', () => {
  let service: ReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportService]
    });
    service = TestBed.inject(ReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get ticket stats', () => {
    const mockStats: TicketStats = {
      totalTickets: 100,
      pendingTickets: 30,
      inProgressTickets: 40,
      resolvedTickets: 20,
      avgResolutionTime: 10,
      resolutionRate: 80
    };

    const params = {
      startDate: '2024-01-01',
      endDate: '2024-03-31'
    };

    service.getTicketStats(params).subscribe(stats => {
      expect(stats).toEqual(mockStats);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/reports/tickets?startDate=2024-01-01&endDate=2024-03-31`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStats);
  });

  it('should get area stats', () => {
    const mockAreaStats: AreaStats[] = [
      { area: 'IT', total: 50, resolved: 30, pending: 20, inProgress: 10, resolutionRate: 80 },
      { area: 'HR', total: 30, resolved: 20, pending: 10, inProgress: 0, resolutionRate: 100 }
    ];

    service.getAreaStats({}).subscribe(stats => {
      expect(stats).toEqual(mockAreaStats);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/reports/areas`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAreaStats);
  });

  it('should get category stats', () => {
    const mockCategoryStats: CategoryStats[] = [
      { _id: '1', categoryName: 'Hardware', total: 40, resolved: 20, pending: 10, inProgress: 0 },
      { _id: '2', categoryName: 'Software', total: 60, resolved: 30, pending: 20, inProgress: 10 }
    ];

    service.getCategoryStats({}).subscribe(stats => {
      expect(stats).toEqual(mockCategoryStats);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/reports/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategoryStats);
  });

  it('should download report', () => {
    const mockBlob = new Blob(['test data'], { type: 'application/pdf' });
    const params = { startDate: '2024-01-01', endDate: '2024-03-31' };

    service.downloadReport(params).subscribe(response => {
      expect(response).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/reports/download?startDate=2024-01-01&endDate=2024-03-31`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBlob);
  });
}); 