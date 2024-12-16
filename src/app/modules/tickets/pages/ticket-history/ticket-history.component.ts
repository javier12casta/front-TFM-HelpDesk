import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';

@Component({
  selector: 'app-ticket-history',
  standalone: true,
  imports: [CommonModule, SharedModule],
  template: `
    <div class="ticket-history-container">
      <h2>Historial del Ticket</h2>
      <!-- Historial -->
    </div>
  `,
  styles: [`
    .ticket-history-container {
      padding: 20px;
    }
  `]
})
export class TicketHistoryComponent {
} 