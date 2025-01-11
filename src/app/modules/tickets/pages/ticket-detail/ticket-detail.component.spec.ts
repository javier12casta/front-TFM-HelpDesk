import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketDetailComponent } from './ticket-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TicketService } from '../../../../core/services/ticket.service';
import { RoleService } from '../../../../core/services/role.service';
import { ActivatedRoute } from '@angular/router';
import { mockTicketTest, mockTicketComments } from '../../../../core/testing/mocks/data/tickets-test.mock';
import { of } from 'rxjs';

describe('TicketDetailComponent', () => {
  let component: TicketDetailComponent;
  let fixture: ComponentFixture<TicketDetailComponent>;
  let ticketService: jasmine.SpyObj<TicketService>;
  let roleService: jasmine.SpyObj<RoleService>;

  beforeEach(async () => {
    const ticketSpy = jasmine.createSpyObj('TicketService', [
      'getTicketById',
      'getTicketComments',
      'addTicketComment',
      'updateTicketStatus'
    ]);
    const roleSpy = jasmine.createSpyObj('RoleService', ['getRoleById']);

    ticketSpy.getTicketById.and.returnValue(of({ data: mockTicketTest }));
    ticketSpy.getTicketComments.and.returnValue(of(mockTicketComments));
    ticketSpy.addTicketComment.and.returnValue(of(mockTicketComments[0]));
    ticketSpy.updateTicketStatus.and.returnValue(of(mockTicketTest));
    roleSpy.getRoleById.and.returnValue(of({ name: 'admin' }));

    await TestBed.configureTestingModule({
      imports: [
        TicketDetailComponent,
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: TicketService, useValue: ticketSpy },
        { provide: RoleService, useValue: roleSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } }
        }
      ]
    }).compileComponents();

    ticketService = TestBed.inject(TicketService) as jasmine.SpyObj<TicketService>;
    roleService = TestBed.inject(RoleService) as jasmine.SpyObj<RoleService>;
  });

  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: '1', role: 'admin' }));
    fixture = TestBed.createComponent(TicketDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load ticket and comments on init', () => {
    expect(ticketService.getTicketById).toHaveBeenCalledWith('1');
    expect(ticketService.getTicketComments).toHaveBeenCalledWith('1');
    expect(component.ticket).toEqual(mockTicketTest);
    expect(component.ticketComments).toEqual(mockTicketComments);
  });

  it('should add comment', () => {
    component.commentForm.patchValue({ content: 'Test comment' });
    component.ticket = mockTicketTest;
    component.addComment();
    expect(ticketService.addTicketComment).toHaveBeenCalled();
  });

  it('should update ticket status', () => {
    component.ticket = mockTicketTest;
    component.updateStatus('Resuelto');
    expect(ticketService.updateTicketStatus).toHaveBeenCalledWith(
      mockTicketTest._id,
      'Resuelto',
      'Estado actualizado a: Resuelto'
    );
  });

  it('should get correct file icon', () => {
    expect(component.getFileIcon('image/png')).toBe('image');
    expect(component.getFileIcon('application/pdf')).toBe('picture_as_pdf');
    expect(component.getFileIcon('application/msword')).toBe('description');
    expect(component.getFileIcon('application/vnd.ms-excel')).toBe('table_chart');
    expect(component.getFileIcon('unknown')).toBe('insert_drive_file');
  });
}); 