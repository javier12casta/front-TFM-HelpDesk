import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListComponent } from './ticket-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TicketService } from '../../../../core/services/ticket.service';
import { RoleService } from '../../../../core/services/role.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { mockTicketsTest } from '../../../../core/testing/mocks/data/tickets-test.mock';
import { of } from 'rxjs';
import { AssignTicketDialogComponent } from '../../components/assign-ticket-dialog/assign-ticket-dialog.component';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let roleService: jasmine.SpyObj<RoleService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const ticketSpy = jasmine.createSpyObj('TicketService', ['getAllTickets', 'deleteTicket']);
    const roleSpy = jasmine.createSpyObj('RoleService', ['getRoleById']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    ticketSpy.getAllTickets.and.returnValue(of(mockTicketsTest));
    ticketSpy.deleteTicket.and.returnValue(of(void 0));
    roleSpy.getRoleById.and.returnValue(of({ name: 'supervisor' }));
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
      componentInstance: {}
    });

    await TestBed.configureTestingModule({
      imports: [
        TicketListComponent,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatDialogModule
      ],
      providers: [
        { provide: TicketService, useValue: ticketSpy },
        { provide: RoleService, useValue: roleSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    ticketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: '1', role: 'supervisor' }));
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tickets on init', () => {
    expect(ticketService.getAllTickets).toHaveBeenCalled();
    expect(component.tickets).toEqual(mockTicketsTest);
  });

  it('should delete ticket when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteTicket('1');
    expect(ticketService.deleteTicket).toHaveBeenCalledWith('1');
  });

  it('should not delete ticket when not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteTicket('1');
    expect(ticketService.deleteTicket).not.toHaveBeenCalled();
  });

});
