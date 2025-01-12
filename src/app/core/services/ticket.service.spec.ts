import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TicketService } from './ticket.service';
import { environment } from '../../../environments/environment';
import { Ticket } from '../interfaces/ticket.interface';
import { TicketHistory } from '../interfaces/ticket-history.interface';

describe('TicketService', () => {
  let service: TicketService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TicketService]
    });
    service = TestBed.inject(TicketService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tickets', () => {
    const mockTickets: Ticket[] = [
      {
        _id: '1',
        ticketNumber: '1',
        subcategory: {
          _id: '1',
          nombre_subcategoria: 'Test Subcategory',
          descripcion_subcategoria: 'Test Description',
          subcategoria_detalle: {
            _id: '1',
            nombre_subcategoria_detalle: 'Test Detail',
            descripcion: 'Test Detail Description'
          }
        },
        createdAt: new Date(),
        updatedAt: new Date().toISOString(),
        description: 'Test Description 1',
        status: 'Pendiente',
        priority: 'Alta',
        category: 'Hardware',
        createdBy: 'user1',
        assignedTo: 'support1',
        area: 'IT'
      }
    ];

    service.getAllTickets().subscribe(tickets => {
      expect(tickets).toEqual(mockTickets);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/tickets`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTickets);
  });

  it('should create ticket', () => {
    const mockTicket = new FormData();
    mockTicket.append('title', 'New Ticket');
    mockTicket.append('description', 'New Description');

    const mockResponse: Ticket = {
      _id: '2',
      ticketNumber: '2',
      subcategory: {
        _id: '1',
        nombre_subcategoria: 'Test Subcategory',
        descripcion_subcategoria: 'Test Description',
        subcategoria_detalle: {
          _id: '1',
          nombre_subcategoria_detalle: 'Test Detail',
          descripcion: 'Test Detail Description'
        },
      },
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
      description: 'New Description',
      status: 'Pendiente',
      priority: 'Media',
      category: 'Software',
      createdBy: 'user1',
      assignedTo: 'support1',
      area: 'IT'
    };

    service.createTicket(mockTicket).subscribe(ticket => {
      expect(ticket).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/tickets`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get ticket history', () => {
    const ticketId = '1';
    const mockHistory = [
      {
        _id: '1',
        ticketId: '1',
        action: 'created',
        timestamp: new Date().toISOString(),
        user: 'user1'
      }
    ];

    service.getTicketHistory(ticketId).subscribe(history => {
      expect(history).toEqual(mockHistory as unknown as TicketHistory[]);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/tickets/${ticketId}/history`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHistory);
  });

  it('should assign ticket', () => {
    const ticketId = '1';
    const userId = 'user1';

    service.assignTicket(ticketId, userId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/tickets/assign`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ ticketId, userId });
    req.flush({ success: true });
  });

  it('should get ticket comments', () => {
    const ticketId = '1';
    const mockComments = {
      data: [
        {
          _id: '1',
          text: 'Test comment',
          user: 'user1',
          createdAt: new Date().toISOString()
        }
      ]
    };

    service.getTicketComments(ticketId).subscribe(comments => {
      expect(comments).toEqual(mockComments.data);
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/tickets/${ticketId}/comments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComments);
  });

  it('should update ticket status', () => {
    const ticketId = '1';
    const newStatus = 'En Proceso';
    const commentText = 'Status update comment';

    service.updateTicketStatus(ticketId, newStatus, commentText).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.baseAPI}/tickets/${ticketId}/status`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ newStatus, commentText });
    req.flush({ success: true });
  });
}); 