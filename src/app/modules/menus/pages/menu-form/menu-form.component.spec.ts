import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuFormComponent } from './menu-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuService } from '../../../../core/services/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { mockMenu, mockMenus } from '../../../../core/testing/mocks/data/menus.mock';

describe('MenuFormComponent', () => {
  let component: MenuFormComponent;
  let fixture: ComponentFixture<MenuFormComponent>;
  let menuService: jasmine.SpyObj<MenuService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const menuSpy = jasmine.createSpyObj('MenuService', ['getAllMenus', 'getMenuById', 'createMenu', 'updateMenu']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    menuSpy.getAllMenus.and.returnValue(of(mockMenus));
    menuSpy.getMenuById.and.returnValue(of(mockMenu));
    menuSpy.createMenu.and.returnValue(of(mockMenu));
    menuSpy.updateMenu.and.returnValue(of(mockMenu));

    await TestBed.configureTestingModule({
      imports: [
        MenuFormComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MenuService, useValue: menuSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    menuService = TestBed.inject(MenuService) as jasmine.SpyObj<MenuService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    const newComponent = TestBed.createComponent(MenuFormComponent).componentInstance;
    expect(newComponent.menuForm.value).toEqual({
      name: '',
      path: '',
      icon: '',
      parentId: ''
    });
  });

  it('should load menu data in edit mode', () => {
    expect(menuService.getMenuById).toHaveBeenCalledWith('1');
    expect(component.menuForm.value).toEqual({
      name: mockMenu.name,
      path: mockMenu.path,
      icon: mockMenu.icon,
      parentId: mockMenu.parentId
    });
  });

  it('should load parent menus', () => {
    expect(menuService.getAllMenus).toHaveBeenCalled();
    expect(component.parentMenus).toEqual(mockMenus);
  });

  it('should create new menu', fakeAsync(() => {
    const newComponent = TestBed.createComponent(MenuFormComponent).componentInstance;
    newComponent.menuForm.patchValue({
      name: 'New Menu',
      path: '/new',
      icon: 'new',
      parentId: undefined
    });

    newComponent.onSubmit();
    tick();

    expect(menuService.createMenu).toHaveBeenCalledWith({
      name: 'New Menu',
      path: '/new',
      icon: 'new',
      parentId: undefined,
    });
    expect(router.navigate).toHaveBeenCalledWith(['/app/menus']);
  }));

  it('should update existing menu', fakeAsync(() => {
    component.menuForm.patchValue({
      name: 'Updated Menu',
      path: '/updated',
      icon: 'update',
      parentId: undefined
    });

    component.onSubmit();
    tick();

    expect(menuService.updateMenu).toHaveBeenCalledWith('1', {
      name: 'Updated Menu',
      path: '/updated',
      icon: 'update',
      parentId: undefined
    });
    expect(router.navigate).toHaveBeenCalledWith(['/app/menus']);
  }));

  it('should navigate back on cancel', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/app/menus']);
  });
}); 