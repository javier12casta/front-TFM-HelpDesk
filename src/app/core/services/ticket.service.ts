import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ticket, TicketStatus } from '../interfaces/ticket.interface';
import { TicketHistory } from '../interfaces/ticket-history.interface';
import { CreateTicketDTO } from '../interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = `${environment.baseAPI}/tickets`;
  private assign = `${environment.baseAPI}/assign-support`;

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl, { withCredentials: true });
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createTicket(ticket: CreateTicketDTO): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}`, ticket, { withCredentials: true });
  }

  updateTicket(id: string, ticket: Partial<CreateTicketDTO>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket, { withCredentials: true });
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  getTicketsByCategory(category: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/category/${category}`, { withCredentials: true });
  }

  getTicketHistory(id: string): Observable<TicketHistory[]> {
    return this.http.get<TicketHistory[]>(`${this.apiUrl}/${id}/history`, { withCredentials: true });
  }

  getStats(): Observable<TicketStatus[]> {
    return of(['Pendiente', 'En Proceso', 'Resuelto', 'Cancelado']);
  }

  assignTicket(ticketId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, { ticketId: ticketId, userId: userId }, { withCredentials: true });
  }

  assignTicketSupport(ticketId: string, supportUserId: string ): Observable<any> {
    return this.http.post(`${this.apiUrl}/support-assign`, { ticketId: ticketId, supportUserId: supportUserId }, { withCredentials: true });
  }

} 