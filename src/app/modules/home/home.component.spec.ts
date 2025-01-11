/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TicketService } from '../../core/services/ticket.service';
import { CategoryService } from '../../core/services/category.service';
import { AreaService } from '../../core/services/area.service';
import { MockTicketService } from '../../core/testing/mocks/services/ticket.service.mock';
import { MockCategoryService } from '../../core/testing/mocks/services/category.service.mock';
import { MockAreaService } from '../../core/testing/mocks/services/area.service.mock';
import { mockTickets, mockCategories, mockAreas, mockStats } from '../../core/testing/mocks/data/tickets.mock';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/material-imports';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let ticketService: MockTicketService;
  let categoryService: MockCategoryService;
  let areaService: MockAreaService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        { provide: TicketService, useClass: MockTicketService },
        { provide: CategoryService, useClass: MockCategoryService },
        { provide: AreaService, useClass: MockAreaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    ticketService = TestBed.inject(TicketService) as unknown as MockTicketService;
    categoryService = TestBed.inject(CategoryService) as unknown as MockCategoryService;
    areaService = TestBed.inject(AreaService) as unknown as MockAreaService;
    router = TestBed.inject(Router);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all data on init', () => {
    spyOn(ticketService, 'getAllTickets').and.callThrough();
    spyOn(categoryService, 'getAllCategories').and.callThrough();
    spyOn(areaService, 'getAllAreas').and.callThrough();
    spyOn(ticketService, 'getStats').and.callThrough();

    component.ngOnInit();

    expect(ticketService.getAllTickets).toHaveBeenCalled();
    expect(categoryService.getAllCategories).toHaveBeenCalled();
    expect(areaService.getAllAreas).toHaveBeenCalled();
    expect(ticketService.getStats).toHaveBeenCalled();
  });

  it('should process categories correctly', () => {
    component.ngOnInit();
    
    expect(component.categories.length).toBe(mockCategories.length);
    expect(component.categories[0].nombre_categoria).toBe(mockCategories[0].nombre_categoria);
    expect(component.categories[0].count).toBeDefined();
    expect(component.categories[0].icon).toBeDefined();
  });

  it('should process areas correctly', () => {
    component.ngOnInit();
    
    expect(component.areas.length).toBe(mockAreas.length);
    expect(component.areas[0].area).toBe(mockAreas[0].area);
    expect(component.areas[0].count).toBeDefined();
    expect(component.areas[0].icon).toBeDefined();
  });

  it('should calculate stats correctly', () => {
    component.ngOnInit();
    
    expect(component.stats).toEqual(mockStats);
  });

  it('should navigate to new ticket page', () => {
    spyOn(router, 'navigate');
    
    component.createNewTicket();
    
    expect(router.navigate).toHaveBeenCalledWith(['/app/tickets/new']);
  });

  it('should count tickets by category correctly', () => {
    component.ngOnInit();
    const hardwareTickets = component.categories.find(c => c.nombre_categoria === 'Hardware');
    expect(hardwareTickets?.count).toBe(2); // Based on mock data
  });

  it('should count tickets by area correctly', () => {
    component.ngOnInit();
    const techArea = component.areas.find(a => a.area === 'Tecnología y Sistemas');
    expect(techArea?.count).toBe(2); // Based on mock data
  });

});
