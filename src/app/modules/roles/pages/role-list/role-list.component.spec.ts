import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleListComponent } from './role-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoleService } from '../../../../core/services/role.service';
import { mockRoles } from '../../../../core/testing/mocks/data/roles.mock';
import { of } from 'rxjs';

describe('RoleListComponent', () => {
  let component: RoleListComponent;
  let fixture: ComponentFixture<RoleListComponent>;
  let roleService: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('RoleService', ['getAllRoles', 'deleteRole']);
    spy.getAllRoles.and.returnValue(of(mockRoles));
    spy.deleteRole.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        RoleListComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RoleService, useValue: spy }
      ]
    }).compileComponents();

    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', () => {
    expect(roleService.getAllRoles).toHaveBeenCalled();
    expect(component.roles).toEqual(mockRoles);
  });

  it('should display roles in table', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(mockRoles.length);
  });

  it('should delete role when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteRole('1');
    expect(roleService.deleteRole).toHaveBeenCalledWith('1');
  });

  it('should not delete role when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteRole('1');
    expect(roleService.deleteRole).not.toHaveBeenCalled();
  });
}); 