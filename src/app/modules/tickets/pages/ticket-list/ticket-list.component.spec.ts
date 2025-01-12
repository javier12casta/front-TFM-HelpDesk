import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListComponent } from './ticket-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TicketService } from '../../../../core/services/ticket.service';
import { RoleService } from '../../../../core/services/role.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { mockTicketsTest } from '../../../../core/testing/mocks/data/tickets-test.mock';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../../../../core/services/auth.service';
import { AssignTicketDialogComponent } from '../../components/assign-ticket-dialog/assign-ticket-dialog.component';
import { setupTestLocalStorage } from '../../../../core/testing/local-storage.mock';
import { SharedModule } from '../../../../shared/material-imports';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let roleService: jasmine.SpyObj<RoleService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialog: MatDialog;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    setupTestLocalStorage();

    const ticketSpy = jasmine.createSpyObj('TicketService', ['getAllTickets', 'deleteTicket', 'assignTicket']);
    const roleSpy = jasmine.createSpyObj('RoleService', ['getRoleById']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getItem', 'isAuthenticated']);

    ticketSpy.getAllTickets.and.returnValue(of(mockTicketsTest));
    ticketSpy.deleteTicket.and.returnValue(of(void 0));
    ticketSpy.assignTicket.and.returnValue(of({}));
    roleSpy.getRoleById.and.returnValue(of({ name: 'supervisor' }));

    authSpy.getItem.and.returnValue({
      _id: 'user123',
      username: 'testuser',
      role: 'admin',
      email: 'test@test.com',
      isActive: true
    });
    authSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        TicketListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        MatDialogModule,
        SharedModule
      ],
      providers: [
        { provide: TicketService, useValue: ticketSpy },
        { provide: RoleService, useValue: roleSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    ticketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
    dialog = TestBed.inject(MatDialog);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    overlayContainer = TestBed.inject(OverlayContainer);
    
    fixture = TestBed.createComponent(TicketListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  beforeEach(() => {
    component.user = {
      _id: 'user123',
      role: 'admin'
    };
    fixture.detectChanges();
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

  it('should open assign dialog and assign ticket', () => {
    const ticket = mockTicketsTest[0];
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of({ userId: 'support123' }),
      componentInstance: {},
      close: () => {}
    } as MatDialogRef<typeof AssignTicketDialogComponent>);

    component.openAssignDialog(ticket);
    
    expect(dialog.open).not.toHaveBeenCalled();
  });

  it('should check user permissions', () => {
    expect(component.user.role).toBe('admin');
  });

  it('should handle ticket status colors', () => {
    const ticket = mockTicketsTest[0];
    expect(component.getStatusColor(ticket.status)).toBeDefined();
  });

  it('should handle ticket priority colors', () => {
    const ticket = mockTicketsTest[0];
    expect(component.getPriorityColor(ticket.priority)).toBeDefined();
  });
});
