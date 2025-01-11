import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReportDashboardComponent } from './report-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReportService } from '../../../../core/services/report.service';
import { AreaService } from '../../../../core/services/area.service';
import { CategoryService } from '../../../../core/services/category.service';
import { mockTicketStats, mockAreaStats, mockCategoryStats } from '../../../../core/testing/mocks/data/reports.mock';
import { mockAreas } from '../../../../core/testing/mocks/data/tickets.mock';
import { mockCategories } from '../../../../core/testing/mocks/data/tickets.mock';
import { of } from 'rxjs';

describe('ReportDashboardComponent', () => {
  let component: ReportDashboardComponent;
  let fixture: ComponentFixture<ReportDashboardComponent>;
  let reportService: jasmine.SpyObj<ReportService>;
  let areaService: jasmine.SpyObj<AreaService>;
  let categoryService: jasmine.SpyObj<CategoryService>;

  beforeEach(async () => {
    const reportSpy = jasmine.createSpyObj('ReportService', [
      'getTicketStats',
      'getAreaStats',
      'getCategoryStats',
      'downloadReport'
    ]);
    const areaSpy = jasmine.createSpyObj('AreaService', ['getAllAreas']);
    const categorySpy = jasmine.createSpyObj('CategoryService', ['getAllCategories']);

    // Setup default returns
    reportSpy.getTicketStats.and.returnValue(of(mockTicketStats));
    reportSpy.getAreaStats.and.returnValue(of(mockAreaStats));
    reportSpy.getCategoryStats.and.returnValue(of(mockCategoryStats));
    reportSpy.downloadReport.and.returnValue(of(new Blob()));
    areaSpy.getAllAreas.and.returnValue(of(mockAreas));
    categorySpy.getAllCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [
        ReportDashboardComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ReportService, useValue: reportSpy },
        { provide: AreaService, useValue: areaSpy },
        { provide: CategoryService, useValue: categorySpy }
      ]
    }).compileComponents();

    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
    areaService = TestBed.inject(AreaService) as jasmine.SpyObj<AreaService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.filterForm.value).toEqual({
      startDate: '',
      endDate: '',
      area: '',
      category: ''
    });
  });

  it('should load initial data on init', () => {
    expect(areaService.getAllAreas).toHaveBeenCalled();
    expect(categoryService.getAllCategories).toHaveBeenCalled();
    expect(reportService.getTicketStats).toHaveBeenCalled();
    expect(reportService.getAreaStats).toHaveBeenCalled();
    expect(reportService.getCategoryStats).toHaveBeenCalled();
  });

  it('should download report', fakeAsync(() => {
    // Mock URL.createObjectURL
    const mockUrl = 'blob:mock-url';
    spyOn(window.URL, 'createObjectURL').and.returnValue(mockUrl);
    spyOn(window.URL, 'revokeObjectURL');
    
    // Mock document.createElement and other DOM operations
    const mockAnchor = document.createElement('a');
    spyOn(document, 'createElement').and.returnValue(mockAnchor);
    spyOn(mockAnchor, 'click');
    spyOn(document.body, 'appendChild');
    spyOn(document.body, 'removeChild');

    component.downloadReport();
    tick();

    expect(reportService.downloadReport).toHaveBeenCalled();
    expect(window.URL.createObjectURL).toHaveBeenCalled();
    expect(mockAnchor.download).toContain('reporte-tickets-');
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(mockUrl);
  }));

  it('should display ticket statistics', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Estadísticas Generales');
    expect(component.ticketStats).toEqual(mockTicketStats);
  });

  it('should display area statistics', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Estadísticas por Área');
    expect(component.areaStats).toEqual(mockAreaStats);
  });

  it('should display category statistics', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Estadísticas por Categoría');
    expect(component.categoryStats).toEqual(mockCategoryStats);
  });
}); 