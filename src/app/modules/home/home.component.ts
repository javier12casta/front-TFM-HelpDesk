import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService, Ticket } from '../../core/services/ticket.service';
import { SharedModule } from '../../shared/material-imports';
import { FormsModule } from '@angular/forms';

interface TicketStats {
  total: number;
  pendientes: number;
  resueltos: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [SharedModule, FormsModule]
})
export class HomeComponent implements OnInit {
  tickets: Ticket[] = [];
  stats: TicketStats = { total: 0, pendientes: 0, resueltos: 0 };

  constructor(
    private ticketService: TicketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTickets();
    this.loadStats();
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  loadStats() {
    this.ticketService.getStats().subscribe(stats => {
      this.stats = stats;
    });
  }

  createNewTicket() {
    this.router.navigate(['/tickets/new']);
  }
}
