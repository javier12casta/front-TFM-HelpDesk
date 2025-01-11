import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TicketFormComponent } from './ticket-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TicketService } from '../../../../core/services/ticket.service';
import { CategoryService } from '../../../../core/services/category.service';
import { NavigationService } from '../../../../core/services/navigation.service';
import { SocketService } from '../../../../core/services/socket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { mockTicketTest } from '../../../../core/testing/mocks/data/tickets-test.mock';
import { of } from 'rxjs';
import { Location } from '@angular/common';

describe('TicketFormComponent', () => {
  let component: TicketFormComponent;
  let fixture: ComponentFixture<TicketFormComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let socketService: jasmine.SpyObj<SocketService>;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const ticketSpy = jasmine.createSpyObj('TicketService', [
      'getTicketById',
      'createTicket',
      'updateTicket'
    ]);
    const categorySpy = jasmine.createSpyObj('CategoryService', ['getAllCategories']);
    const navigationSpy = jasmine.createSpyObj('NavigationService', ['cancel']);
    const socketSpy = jasmine.createSpyObj('SocketService', ['emit']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/app/tickets/new'
    });
    const locationSpy = jasmine.createSpyObj('Location', ['path']);

    locationSpy.path.and.callFake(() => '/app/tickets/new');

    ticketSpy.getTicketById.and.returnValue(of({ data: mockTicketTest }));
    ticketSpy.createTicket.and.returnValue(of(mockTicketTest));
    ticketSpy.updateTicket.and.returnValue(of(mockTicketTest));
    categorySpy.getAllCategories.and.returnValue(of([{
      _id: '1',
      nombre_categoria: 'Hardware',
      descripcion_categoria: 'Hardware issues',
      color_categoria: '#FF0000',
      subcategorias: [{
        _id: '1',
        nombre_subcategoria: 'PC',
        descripcion_subcategoria: 'PC issues',
        subcategoria_detalle: {
          _id: '1',
          nombre_subcategoria_detalle: 'Detail',
          descripcion: 'Description'
        }
      }]
    }]));

    await TestBed.configureTestingModule({
      imports: [
        TicketFormComponent,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TicketService, useValue: ticketSpy },
        { provide: CategoryService, useValue: categorySpy },
        { provide: NavigationService, useValue: navigationSpy },
        { provide: SocketService, useValue: socketSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        {
          provide: ActivatedRoute,
          useValue: { 
            snapshot: { 
              params: { id: null },
              url: [{ path: 'new' }]
            } 
          }
        }
      ]
    }).compileComponents();

    ticketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    socketService = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.ticketForm.value).toEqual({
      description: '',
      categoryId: '',
      subcategory: '',
      priority: ''
    });
  });

  it('should load categories on init', () => {
    expect(categoryService.getAllCategories).toHaveBeenCalled();
  });

  it('should cancel form', () => {
    component.cancel();
    expect(navigationService.cancel).toHaveBeenCalled();
  });
}); 