import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket, TicketCategory, TicketPriority } from '../../../../core/interfaces/ticket.interface';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html',
  styleUrls: ['./ticket-form.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class TicketFormComponent implements OnInit {
  ticketForm!: FormGroup;
  isEditMode = false;
  ticketId!: string;

  categories: TicketCategory[] = [
    'Atención al Cliente',
    'Operaciones Bancarias',
    'Reclamos',
    'Servicios Digitales'
  ];

  priorities: TicketPriority[] = ['Baja', 'Media', 'Alta'];

  constructor(
    private fb: FormBuilder,
    private ticketService: TicketService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['id'];
    if (this.ticketId) {
      this.isEditMode = true;
      this.loadTicket();
    }
  }

  createForm() {
    this.ticketForm = this.fb.group({
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }
  loadTicket() {
    if (this.ticketId) {
      this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {
        if (ticket && this.ticketForm) {
          this.ticketForm.patchValue(ticket);
        }
      });
    }
  }
  onSubmit() {
    if (this.ticketForm && this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      
      if (this.isEditMode && this.ticketId) {
        this.ticketService.updateTicket(this.ticketId, ticketData).subscribe(() => {
          this.router.navigate(['/app/tickets']);
        });
      } else {
        this.ticketService.createTicket(ticketData).subscribe(() => {
          this.router.navigate(['/app/tickets']);
        });
      }
    }
  }
} 