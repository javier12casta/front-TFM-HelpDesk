import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService } from './menu.service';
import { environment } from '../../../environments/environment';
import { Menu, CreateMenuDTO } from '../interfaces/menu.interface';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all menus', () => {
    const mockMenus: Menu[] = [
      { _id: '1', name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
      { _id: '2', name: 'Tickets', path: '/tickets', icon: 'ticket' }
    ];

    service.getAllMenus().subscribe(menus => {
      expect(menus).toEqual(mockMenus);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/menus`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMenus);
  });

  it('should create a menu', () => {
    const mockMenu: CreateMenuDTO = {
      name: 'New Menu',
      path: '/new',
      icon: 'new'
    };

    service.createMenu(mockMenu).subscribe(menu => {
      expect(menu).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/menus`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: '3', ...mockMenu });
  });
}); 