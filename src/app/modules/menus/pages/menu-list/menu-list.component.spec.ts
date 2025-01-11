import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuListComponent } from './menu-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuService } from '../../../../core/services/menu.service';
import { MockMenuService } from '../../../../core/testing/mocks/services/menu.service.mock';
import { mockMenus } from '../../../../core/testing/mocks/data/menus.mock';
import { of } from 'rxjs';

describe('MenuListComponent', () => {
  let component: MenuListComponent;
  let fixture: ComponentFixture<MenuListComponent>;
  let menuService: jasmine.SpyObj<MenuService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MenuService', ['getAllMenus', 'deleteMenu']);
    spy.getAllMenus.and.returnValue(of(mockMenus));
    spy.deleteMenu.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        MenuListComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MenuService, useValue: spy }
      ]
    }).compileComponents();

    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load menus on init', () => {
    expect(menuService.getAllMenus).toHaveBeenCalled();
    expect(component.menus).toEqual(mockMenus);
  });

  it('should display menus in table', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr.mat-mdc-row');
    expect(rows.length).toBe(mockMenus.length);
  });

  it('should delete menu when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteMenu('1');
    expect(menuService.deleteMenu).toHaveBeenCalledWith('1');
  });

  it('should not delete menu when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteMenu('1');
    expect(menuService.deleteMenu).not.toHaveBeenCalled();
  });
});
