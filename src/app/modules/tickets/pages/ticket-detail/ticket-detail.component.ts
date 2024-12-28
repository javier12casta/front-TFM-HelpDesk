import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/interfaces/ticket.interface';
import { RoleService } from '../../../../core/services/role.service';
import { RouterModule } from '@angular/router';

interface TicketResponse {
  success: boolean;
  data: Ticket;
}

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule]
})
export class TicketDetailComponent implements OnInit {
  ticket?: Ticket;
  ticketComments: any[] = [];
  commentForm: FormGroup;
  canChangeStatus = false;
  canEdit = false;
  availableStatuses = ['Pendiente', 'En Proceso', 'Resuelto', 'Cancelado'];
  user: any;
  selectedFile?: File;
  selectedStatus?: string = '';

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
    this.checkUserPermissions();
  }

  ngOnInit() {
    const ticketId = this.route.snapshot.params['id'];
    this.loadTicket(ticketId);
    this.loadComments(ticketId);
  }

  checkUserPermissions() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.roleService.getRoleById(this.user.role).subscribe((role: any) => {
        const roleName = role?.name?.toLowerCase();
        this.canChangeStatus = ['admin', 'supervisor', 'soporte'].includes(roleName);
        this.canEdit = this.ticket?.clientId?._id === this.user.id || ['admin', 'supervisor'].includes(roleName);
      });
    }
  }

  loadTicket(id: string) {
    this.ticketService.getTicketById(id).subscribe((response: any) => {
      if (response.data) {
        this.ticket = response.data;
        this.selectedStatus = this.ticket?.status;
      } else {
        this.ticket = {} as Ticket;
      }
      this.checkUserPermissions();
    });
  }

  loadComments(ticketId: string) {
    this.ticketService.getTicketComments(ticketId).subscribe({
      next: (response) => {
        this.ticketComments = Array.isArray(response) ? response : [];
        console.log('Comments loaded:', this.ticketComments); // Para debug
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.ticketComments = [];
      }
    });
  }

  updateStatus(newStatus: string) {
    if (this.ticket && this.canChangeStatus) {
      this.ticketService.updateTicketStatus(
        this.ticket._id, 
        newStatus,
        `Estado actualizado a: ${newStatus}`
      ).subscribe(() => {
        this.loadTicket(this.ticket!._id);
        this.loadComments(this.ticket!._id); // Recargar comentarios para ver el cambio de estado
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  getFileIcon(mimetype: string): string {
    if (mimetype.includes('image')) return 'image';
    if (mimetype.includes('pdf')) return 'picture_as_pdf';
    if (mimetype.includes('word')) return 'description';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'table_chart';
    return 'insert_drive_file';
  }

  addComment() {
    if (this.commentForm.valid && this.ticket) {
      const comment = {
        text: this.commentForm.value.content,
        attachment: this.selectedFile
      };

      this.ticketService.addTicketComment(this.ticket._id, comment).subscribe(() => {
        this.loadComments(this.ticket!._id);
        this.commentForm.reset();
        this.selectedFile = undefined;
      });
    }
  }
} 