import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { TicketService } from '../../../../core/services/ticket.service';
import { UserService } from '../../../../core/services/user.service';
import { Ticket } from '../../../../core/interfaces/ticket.interface';
import { MatDialog } from '@angular/material/dialog';
import { AssignTicketDialogComponent } from '../../components/assign-ticket-dialog/assign-ticket-dialog.component';
import { RoleService } from '../../../../core/services/role.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  encapsulation: ViewEncapsulation.None
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];
  displayedColumns = ['ticketNumber', 'description', 'category', 'subcategory', 'status', 'priority', 'assignedTo', 'actions'];
  isSupervisor = false;
  user: any;

  constructor(
    private ticketService: TicketService,
    private dialog: MatDialog,
    private roleService: RoleService
  ) {
    this.checkSupervisorRole();
  }

  checkSupervisorRole() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      const user = JSON.parse(userData);
      this.roleService.getRoleById(user.role).subscribe(role => {
        this.isSupervisor = (role?.name?.toLowerCase() === 'supervisor' || role?.name?.toLowerCase() === 'admin');
        console.log('Es supervisor:', this.isSupervisor);
      });
    }
  }

  openAssignDialog(ticket: Ticket) {
    const dialogRef = this.dialog.open(AssignTicketDialogComponent, {
      width: '400px',
      data: { ticketId: ticket._id, ticket: ticket }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTickets();
      }
    });
  }

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