import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../../core/interfaces/user.interface';
import { UserService } from '../../../../core/services/user.service';
import { SharedModule } from '../../../../shared/material-imports';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class UsersListComponent implements OnInit {
  private usersService = inject(UserService);
  
  users: User[] = [];
  displayedColumns = ['username', 'email', 'role', 'area', 'isActive', 'mfaEnabled', 'actions'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe((response: any) => {
      this.users = response.data;
    });
  }

  deleteUser(id: string): void {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usersService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
} 