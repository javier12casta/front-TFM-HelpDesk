import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/interfaces/ticket.interface';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule]
})
export class TicketDetailComponent implements OnInit {
  ticket?: Ticket;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit() {
    const ticketId = this.route.snapshot.params['id'];
    this.loadTicket(ticketId);
  }

  loadTicket(id: string) {
    this.ticketService.getTicketById(id).subscribe(ticket => {
      this.ticket = ticket;
    });
  }
} 