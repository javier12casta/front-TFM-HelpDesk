import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/interfaces/ticket.interface';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule]
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  displayedColumns = ['ticketNumber', 'description', 'category', 'subcategory', 'status', 'priority', 'actions'];

  constructor(private ticketService: TicketService) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getAllTickets().subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  deleteTicket(id: string) {
    if (confirm('¿Está seguro de eliminar este ticket?')) {
      this.ticketService.deleteTicket(id).subscribe(() => {
        this.loadTickets();
      });
    }
  }

  getStatusColor(status: string): string {
    const colors = {
      'Pendiente': 'warn',
      'En Proceso': 'accent',
      'Resuelto': 'primary',
      'Cancelado': 'default'
    };
    return 'default'//colors[status] || 'default';
  }

  getPriorityColor(priority: string): string {
    const colors = {
      'Alta': 'warn',
      'Media': 'accent',
      'Baja': 'primary'
    };
    return 'default'//colors[priority] || 'default';
  }
} 