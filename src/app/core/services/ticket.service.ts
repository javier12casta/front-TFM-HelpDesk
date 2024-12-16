import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Ticket {
  _id?: string;
  ticketNumber: string;
  category: 'Atención al Cliente' | 'Operaciones Bancarias' | 'Reclamos' | 'Servicios Digitales';
  description: string;
  status: 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Cancelado';
  priority: 'Baja' | 'Media' | 'Alta';
  clientId: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private tickets: Ticket[] = [
    {
      _id: '1',
      ticketNumber: 'TK-001',
      category: 'Atención al Cliente',
      description: 'Problema con acceso a la cuenta',
      status: 'Pendiente',
      priority: 'Alta',
      clientId: 'user123',
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-03-10')
    },
    {
      _id: '2',
      ticketNumber: 'TK-002',
      category: 'Operaciones Bancarias',
      description: 'Consulta sobre préstamo',
      status: 'En Proceso',
      priority: 'Media',
      clientId: 'user456',
      assignedTo: 'agent789',
      createdAt: new Date('2024-03-11'),
      updatedAt: new Date('2024-03-11')
    },
    {
      _id: '3',
      ticketNumber: 'TK-003',
      category: 'Reclamos',
      description: 'Cargo no reconocido',
      status: 'Resuelto',
      priority: 'Alta',
      clientId: 'user789',
      assignedTo: 'agent123',
      createdAt: new Date('2024-03-12'),
      updatedAt: new Date('2024-03-13')
    }
  ];

  getTickets(): Observable<Ticket[]> {
    return of(this.tickets);
  }

  getStats() {
    const total = this.tickets.length;
    const pendientes = this.tickets.filter(t => t.status === 'Pendiente').length;
    const resueltos = this.tickets.filter(t => t.status === 'Resuelto').length;
    
    return of({ total, pendientes, resueltos });
  }
} 