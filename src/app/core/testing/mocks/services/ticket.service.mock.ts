import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ticket } from '../../../interfaces/ticket.interface';
import { mockTickets, mockStats } from '../data/tickets.mock';

@Injectable({
  providedIn: 'root'
})
export class MockTicketService {
  getAllTickets(): Observable<Ticket[]> {
    return of(mockTickets);
  }

  getStats(): Observable<any> {
    return of(mockStats);
  }
} 