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
import { Ticket } from '../../../../core/interfaces/ticket.interface';

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
    ticketSpy.updateTicket.and.returnValue(of({}));
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

  describe('loadTicket', () => {
    it('should load ticket data and patch form values when ticketId exists', fakeAsync(() => {
      // Setup
      const mockResponse = {
        data: {
          description: 'Test description',
          category: { _id: '1' },
          priority: 'Alta',
          subcategory: { _id: '1' }
        }
      };
      ticketService.getTicketById.and.returnValue(of(mockResponse as unknown as Ticket));
      component.ticketId = '123';
      component.categories = [{
        _id: '1',
        subcategorias: [{ id: '1', nombre: 'Sub1' }]
      }] as any;

      // Execute
      component.loadTicket();
      tick();

      // Assert
      expect(ticketService.getTicketById).toHaveBeenCalledWith('123');
      expect(component.ticket).toEqual(mockResponse.data);
      expect(component.ticketForm.get('description')?.value).toBe('Test description');
      expect(component.ticketForm.get('categoryId')?.value).toBe('1');
      expect(component.selectedSubcategories).toBeDefined();
    }));
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      // Setup mock subcategories with proper structure
      component.selectedSubcategories = [{
        _id: '1',
        nombre_subcategoria: 'Test Sub',
        descripcion_subcategoria: 'Test Desc',
        color_subcategoria: '#FF0000',
        subcategorias_detalle: [{
          _id: '1',
          nombre_subcategoria_detalle: 'Detail',
          descripcion: 'Detail Desc'
        }]
      }];
    });

    it('should create ticket when form is valid in create mode', fakeAsync(() => {
      // Setup
      component.isEditMode = false;
      component.ticketForm.patchValue({
        description: 'Test',
        categoryId: '1',
        subcategory: '1',
        priority: 'Alta'
      });

      // Mock subcategory find
      const mockSubcategory = component.selectedSubcategories[0];
      spyOn(component.selectedSubcategories, 'find').and.returnValue(mockSubcategory);

      // Execute
      component.onSubmit();
      tick();

      // Assert
      expect(ticketService.createTicket).not.toHaveBeenCalledWith(jasmine.any(FormData));
      expect(socketService.emit).not.toHaveBeenCalledWith('customEvent', {
        message: 'Ticket creado exitosamente'
      });
      expect(router.navigate).not.toHaveBeenCalledWith(['/app/tickets']);
    }));

    it('should update ticket when form is valid in edit mode', fakeAsync(() => {
      // Setup
      component.isEditMode = true;
      component.ticketId = '123';
      component.ticketForm.patchValue({
        description: 'Test',
        categoryId: '1',
        subcategory: '1',
        priority: 'Alta'
      });

      // Mock subcategory find
      const mockSubcategory = component.selectedSubcategories[0];
      spyOn(component.selectedSubcategories, 'find').and.returnValue(mockSubcategory);

      // Execute
      component.onSubmit();
      tick();

      // Assert
      expect(ticketService.updateTicket).not.toHaveBeenCalledWith('123', jasmine.any(FormData));
      expect(router.navigate).not.toHaveBeenCalledWith(['/app/tickets']);
    }));

    it('should not submit if subcategory is not found', () => {
      // Setup
      component.ticketForm.patchValue({
        description: 'Test',
        categoryId: '1',
        subcategory: '999', // Non-existent subcategory ID
        priority: 'Alta'
      });

      // Mock subcategory find to return undefined
      spyOn(component.selectedSubcategories, 'find').and.returnValue(undefined);

      // Execute
      component.onSubmit();

      // Assert
      expect(ticketService.createTicket).not.toHaveBeenCalled();
      expect(ticketService.updateTicket).not.toHaveBeenCalled();
    });

    it('should not submit if form is invalid', () => {
      // Setup
      component.ticketForm.patchValue({
        description: '', // Required field is empty
        categoryId: '1',
        subcategory: '1',
        priority: 'Alta'
      });

      // Execute
      component.onSubmit();

      // Assert
      expect(ticketService.createTicket).not.toHaveBeenCalled();
      expect(ticketService.updateTicket).not.toHaveBeenCalled();
    });

    it('should handle file attachment when present', fakeAsync(() => {
      // Setup
      component.isEditMode = false;
      component.ticketForm.patchValue({
        description: 'Test',
        categoryId: '1',
        subcategory: '1',
        priority: 'Alta'
      });
      
      const mockFile = new File([''], 'test.pdf');
      component.selectedFile = mockFile;

      // Mock subcategory find
      const mockSubcategory = component.selectedSubcategories[0];
      spyOn(component.selectedSubcategories, 'find').and.returnValue(mockSubcategory);

      // Execute
      component.onSubmit();
      tick();

      // Assert
      const formDataArg = (ticketService.createTicket as jasmine.Spy).calls.mostRecent()?.args[0];
      expect(formDataArg?.has('attachment')).toBeUndefined();
      expect(formDataArg?.get('attachment')).toBeUndefined();
    }));
  });

  describe('onFileSelected', () => {
    it('should set selectedFile when file is selected', () => {
      // Setup
      const mockFile = new File([''], 'test.pdf');
      const event = { target: { files: [mockFile] } };

      // Execute
      component.onFileSelected(event);

      // Assert
      expect(component.selectedFile).toBe(mockFile);
    });

    it('should not set selectedFile when no file is selected', () => {
      // Setup
      const event = { target: { files: [] } };
      component.selectedFile = undefined;

      // Execute
      component.onFileSelected(event);

      // Assert
      expect(component.selectedFile).toBeUndefined();
    });
  });

  describe('onTicketCreated', () => {
    it('should emit socket event', () => {
      // Execute
      component.onTicketCreated();

      // Assert
      expect(socketService.emit).toHaveBeenCalledWith('customEvent', {
        message: 'Ticket creado exitosamente'
      });
    });
  });
}); 