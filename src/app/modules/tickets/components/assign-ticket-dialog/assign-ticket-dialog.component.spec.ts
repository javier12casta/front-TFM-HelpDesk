import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AssignTicketDialogComponent } from './assign-ticket-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { TicketService } from '../../../../core/services/ticket.service';
import { mockTicketTest } from '../../../../core/testing/mocks/data/tickets-test.mock';
import { mockUsers } from '../../../../core/testing/mocks/data/users.mock';
import { of } from 'rxjs';

describe('AssignTicketDialogComponent', () => {
  let component: AssignTicketDialogComponent;
  let fixture: ComponentFixture<AssignTicketDialogComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<AssignTicketDialogComponent>>;

  beforeEach(async () => {
    const userSpy = jasmine.createSpyObj('UserService', ['getUsers']);
    const ticketSpy = jasmine.createSpyObj('TicketService', ['assignTicketSupport']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    userSpy.getUsers.and.returnValue(of({ data: mockUsers }));
    ticketSpy.assignTicketSupport.and.returnValue(of(mockTicketTest));

    await TestBed.configureTestingModule({
      imports: [
        AssignTicketDialogComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: TicketService, useValue: ticketSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: { ticketId: '1', ticket: mockTicketTest }
        }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    ticketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AssignTicketDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load support users', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.supportUsers.length).toEqual(0);
  });

  it('should initialize form with current assignee', () => {
    expect(component.assignForm.get('userId')?.value).toBe(mockTicketTest.assignedTo?._id);
  });

  it('should assign ticket when form is submitted', fakeAsync(() => {
    component.assignForm.patchValue({
      userId: '1'
    });
    component.onSubmit();
    tick();

    expect(ticketService.assignTicketSupport).toHaveBeenCalledWith(
      mockTicketTest._id,
      '1'
    );
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('should not submit if form is invalid', () => {
    component.assignForm.patchValue({
      userId: ''
    });
    component.onSubmit();
    expect(ticketService.assignTicketSupport).not.toHaveBeenCalled();
  });
}); 