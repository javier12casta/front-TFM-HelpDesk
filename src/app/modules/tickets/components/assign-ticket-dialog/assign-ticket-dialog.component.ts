import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { TicketService } from '../../../../core/services/ticket.service';

@Component({
  selector: 'app-assign-ticket-dialog',
  templateUrl: './assign-ticket-dialog.component.html',
  styleUrls: ['./assign-ticket-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class AssignTicketDialogComponent implements OnInit {
  assignForm: FormGroup;
  supportUsers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private ticketService: TicketService,
    private dialogRef: MatDialogRef<AssignTicketDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { ticketId: string }
  ) {
    this.assignForm = this.fb.group({
      userId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadSupportUsers();
  }

  loadSupportUsers() {
    this.userService.getUsers().subscribe((response: any) => {
      // Filtramos usuarios que tengan rol de soporte
      this.supportUsers = response.data.filter((user: any) => 
        user.role?.name?.toLowerCase() === 'soporte'
      );
    });
  }

  onSubmit() {
    if (this.assignForm.valid) {
      this.ticketService.assignTicketSupport(
        this.data.ticketId, 
        this.assignForm.value.userId
      ).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
} 