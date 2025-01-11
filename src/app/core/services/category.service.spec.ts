import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { environment } from '../../../environments/environment';
import { Category } from '../interfaces/category.interface';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryService]
    });
    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all categories', () => {
    const mockCategories: Category[] = [
      { _id: '1', nombre_categoria: 'Hardware', descripcion_categoria: 'Hardware issues', color_categoria: '#FF0000', subcategorias: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), __v: 0 },
      { _id: '2', nombre_categoria: 'Software', descripcion_categoria: 'Software issues', color_categoria: '#00FF00', subcategorias: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString (), __v: 0 }
    ];

    service.getAllCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });
}); 