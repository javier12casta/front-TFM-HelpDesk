import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/material-imports';
import { Role } from '../../../../core/interfaces/role.interface';
import { RoleService } from '../../../../core/services/role.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule]
})
export class RoleListComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['name', 'description', 'actions'];

  constructor(private roleService: RoleService) {}

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.roleService.getAllRoles().subscribe(roles => {
      this.roles = roles;
    });
  }

  deleteRole(id: string) {
    if (confirm('¿Está seguro de eliminar este rol?')) {
      this.roleService.deleteRole(id).subscribe(() => {
        this.loadRoles();
      });
    }
  }
} 