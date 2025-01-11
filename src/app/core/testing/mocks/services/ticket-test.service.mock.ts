import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ticket } from '../../../interfaces/ticket.interface';
import { mockTicketsTest, mockTicketTest, mockTicketComments } from '../data/tickets-test.mock';

@Injectable({
  providedIn: 'root'
})
export class MockTicketTestService {
  getAllTickets(): Observable<Ticket[]> {
    return of(mockTicketsTest);
  }

  getTicketById(id: string): Observable<{ data: Ticket }> {
    return of({ data: mockTicketTest });
  }

  createTicket(ticket: FormData): Observable<Ticket> {
    return of(mockTicketTest);
  }

  updateTicket(id: string, ticket: FormData): Observable<Ticket> {
    return of(mockTicketTest);
  }

  deleteTicket(id: string): Observable<void> {
    return of(void 0);
  }

  getTicketComments(id: string): Observable<any[]> {
    return of(mockTicketComments);
  }

  addTicketComment(id: string, comment: any): Observable<any> {
    return of(mockTicketComments[0]);
  }

  updateTicketStatus(id: string, status: string, comment: string): Observable<Ticket> {
    return of(mockTicketTest);
  }

  assignTicketSupport(ticketId: string, userId: string): Observable<Ticket> {
    return of(mockTicketTest);
  }
} 