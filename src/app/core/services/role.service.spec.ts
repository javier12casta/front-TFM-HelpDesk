import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RoleService } from './role.service';
import { environment } from '../../../environments/environment';
import { Role, CreateRoleDTO } from '../interfaces/role.interface';

describe('RoleService', () => {
  let service: RoleService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RoleService]
    });
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all roles', () => {
    const mockRoles: Role[] = [
      { _id: '1', name: 'Admin', permissions: ['read', 'write'], description: 'Admin role', menus: [], isActive: true },
      { _id: '2', name: 'User', permissions: ['read'], description: 'User role', menus: [], isActive: true }
    ];

    service.getAllRoles().subscribe(roles => {
      expect(roles).toEqual(mockRoles);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/roles`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRoles);
  });

  it('should get role by id', () => {
    const mockRole: Role = { _id: '1', name: 'Admin', permissions: ['read', 'write'], description: 'Admin role', menus: [], isActive: true };

    service.getRoleById('1').subscribe(role => {
      expect(role).toEqual(mockRole);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/roles/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRole);
  });

  it('should create role', () => {
    const createRoleDTO: CreateRoleDTO = {
      name: 'New Role',
      permissions: ['read'],
      description: 'New role description',
      menus: [],
      isActive: true
    };

    const mockRole: Role = { _id: '3', name: 'New Role', permissions: ['read'], description: 'New role description', menus: [], isActive: true };

    service.createRole(createRoleDTO).subscribe(role => {
      expect(role).toEqual(mockRole);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/roles`);
    expect(req.request.method).toBe('POST');
    req.flush(mockRole);
  });

  it('should delete role', () => {
    service.deleteRole('1').subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/roles/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
}); 