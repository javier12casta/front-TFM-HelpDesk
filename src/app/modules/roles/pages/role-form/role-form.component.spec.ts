import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RoleFormComponent } from './role-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleService } from '../../../../core/services/role.service';
import { MenuService } from '../../../../core/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mockRole } from '../../../../core/testing/mocks/data/roles.mock';
import { mockMenus } from '../../../../core/testing/mocks/data/menus.mock';
import { of } from 'rxjs';

describe('RoleFormComponent', () => {
  let component: RoleFormComponent;
  let fixture: ComponentFixture<RoleFormComponent>;
  let roleService: jasmine.SpyObj<RoleService>;
  let menuService: jasmine.SpyObj<MenuService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const roleSpy = jasmine.createSpyObj('RoleService', ['getRoleById', 'createRole', 'updateRole']);
    const menuSpy = jasmine.createSpyObj('MenuService', ['getAllMenus']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    roleSpy.getRoleById.and.returnValue(of(mockRole));
    roleSpy.createRole.and.returnValue(of(mockRole));
    roleSpy.updateRole.and.returnValue(of(mockRole));
    menuSpy.getAllMenus.and.returnValue(of(mockMenus));

    await TestBed.configureTestingModule({
      imports: [
        RoleFormComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RoleService, useValue: roleSpy },
        { provide: MenuService, useValue: menuSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    const newComponent = TestBed.createComponent(RoleFormComponent).componentInstance;
    expect(newComponent.roleForm.value).toEqual({
      name: '',
      description: '',
      permissions: [],
      menus: [],
      isActive: true
    });
  });

  it('should load role data in edit mode', () => {
    expect(roleService.getRoleById).toHaveBeenCalledWith('1');
    expect(component.roleForm.value).toEqual({
      name: mockRole.name,
      description: mockRole.description,
      permissions: mockRole.permissions,
      menus: mockRole.menus.map(menu => menu.path),
      isActive: mockRole.isActive
    });
  });

  it('should load available menus', () => {
    expect(menuService.getAllMenus).toHaveBeenCalled();
    expect(component.availableMenus).toEqual(mockMenus);
  });

  it('should create new role', fakeAsync(() => {
    const newComponent = TestBed.createComponent(RoleFormComponent).componentInstance;
    const newRole = {
      name: 'New Role',
      description: 'New Description',
      permissions: ['ver'],
      menus: ['/dashboard'],
      isActive: true
    };

    newComponent.roleForm.patchValue(newRole);
    newComponent.onSubmit();
    tick();

    expect(roleService.createRole).toHaveBeenCalledWith(newRole);
    expect(router.navigate).toHaveBeenCalledWith(['/app/roles']);
  }));

  it('should update existing role', fakeAsync(() => {
    const updatedRole = {
      name: 'Updated Role',
      description: 'Updated Description',
      permissions: ['ver', 'editar'],
      menus: ['/dashboard', '/users'],
      isActive: true
    };

    component.roleForm.patchValue(updatedRole);
    component.onSubmit();
    tick();

    expect(roleService.updateRole).toHaveBeenCalledWith('1', updatedRole);
    expect(router.navigate).toHaveBeenCalledWith(['/app/roles']);
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['app/roles']);
  });

  it('should validate required fields', () => {
    const form = component.roleForm;
    expect(form.valid).toBeTrue();

    form.patchValue({
      name: 'Test Role',
      description: 'Test Description'
    });

    expect(form.valid).toBeTruthy();
  });
}); 