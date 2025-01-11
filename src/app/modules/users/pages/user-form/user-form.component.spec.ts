import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserFormComponent } from './user-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserService } from '../../../../core/services/user.service';
import { RoleService } from '../../../../core/services/role.service';
import { AreaService } from '../../../../core/services/area.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mockUser } from '../../../../core/testing/mocks/data/users.mock';
import { mockRoles } from '../../../../core/testing/mocks/data/roles.mock';
import { mockAreas } from '../../../../core/testing/mocks/data/tickets.mock';
import { of } from 'rxjs';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let roleService: jasmine.SpyObj<RoleService>;
  let areaService: jasmine.SpyObj<AreaService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUserById', 'createUser', 'updateUser']);
    const roleSpy = jasmine.createSpyObj('RoleService', ['getAllRoles']);
    const areaSpy = jasmine.createSpyObj('AreaService', ['getAllAreas']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userSpy.getUserById.and.returnValue(of({ data: mockUser }));
    userSpy.createUser.and.returnValue(of(mockUser));
    userSpy.updateUser.and.returnValue(of(mockUser));
    roleSpy.getAllRoles.and.returnValue(of(mockRoles));
    areaSpy.getAllAreas.and.returnValue(of(mockAreas));

    await TestBed.configureTestingModule({
      imports: [
        UserFormComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: RoleService, useValue: roleSpy },
        { provide: AreaService, useValue: areaSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    areaService = TestBed.inject(AreaService) as jasmine.SpyObj<AreaService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    const newComponent = TestBed.createComponent(UserFormComponent).componentInstance;
    expect(newComponent.userForm.value).toEqual({
      username: '',
      email: '',
      role: '',
      area: '',
      isActive: true,
      mfaEnabled: false
    });
  });

  it('should load roles and areas', () => {
    expect(roleService.getAllRoles).toHaveBeenCalled();
    expect(areaService.getAllAreas).toHaveBeenCalled();
    expect(component.roles).toEqual(mockRoles);
    expect(component.areas).toEqual(mockAreas);
  });

  it('should create new user', fakeAsync(() => {
    const newComponent = TestBed.createComponent(UserFormComponent).componentInstance;
    const newUser = {
      username: 'newuser',
      email: 'new@test.com',
      role: '1',
      area: '1',
      isActive: true,
      mfaEnabled: false
    };

    newComponent.userForm.patchValue(newUser);
    newComponent.onSubmit();
    tick();

    expect(userService.createUser).toHaveBeenCalledWith(newUser);
    expect(router.navigate).toHaveBeenCalledWith(['/app/users']);
  }));

  it('should update existing user', fakeAsync(() => {
    const updatedUser = {
      username: 'updated',
      email: 'updated@test.com',
      role: '2',
      area: '2',
      isActive: false,
      mfaEnabled: true
    };

    component.userForm.patchValue(updatedUser);
    component.onSubmit();
    tick();

    expect(userService.updateUser).toHaveBeenCalledWith('1', updatedUser);
    expect(router.navigate).toHaveBeenCalledWith(['/app/users']);
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['app/users']);
  });

  it('should validate required fields', () => {
    const form = component.userForm;
    expect(form.valid).toBeFalsy();

    form.patchValue({
      username: 'test',
      email: 'test@test.com',
      role: '1'
    });

    expect(form.valid).toBeTruthy();
  });
}); 