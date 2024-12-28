import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../../shared/material-imports';
import { RoleService } from '../../../../core/services/role.service';
import { MenuService } from '../../../../core/services/menu.service';
import { Menu } from '../../../../core/interfaces/menu.interface';

@Component({
  selector: 'app-role-form',
  templateUrl: './role-form.component.html',
  styleUrls: ['./role-form.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class RoleFormComponent implements OnInit {
  roleForm!: FormGroup;
  isEditMode = false;
  roleId!: string;
  availableMenus: Menu[] = [];
  
  permissions: { value: string, label: string }[] = [
    { value: 'ver', label: 'Ver' },
    { value: 'crear', label: 'Crear' },
    { value: 'editar', label: 'Editar' },
    { value: 'borrar', label: 'Borrar' },
    { value: 'reportes', label: 'Reportes' },
    { value: 'dashboard', label: 'Dashboard' }
  ];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private menuService: MenuService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadMenus();
    this.roleId = this.route.snapshot.params['id'];
    if (this.roleId) {
      this.isEditMode = true;
      this.loadRole();
    }
  }

  createForm() {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      permissions: [[]],
      menus: [[]],
      isActive: [true]
    });
  }

  loadMenus() {
    this.menuService.getAllMenus().subscribe(menus => {
      this.availableMenus = menus;
    });
  }

  loadRole() {
    this.roleService.getRoleById(this.roleId).subscribe(role => {
      this.roleForm.patchValue({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        menus: role.menus.map(menu => menu.path),
        isActive: role.isActive
      });
    });
  }

  onSubmit() {
    if (this.roleForm.valid) {
      if (this.isEditMode) {
        this.roleService.updateRole(this.roleId, this.roleForm.value).subscribe(() => {
          this.router.navigate(['/app/roles']);
        });
      } else {
        this.roleService.createRole(this.roleForm.value).subscribe(() => {
          this.router.navigate(['/app/roles']);
        });
      }
    }
  }
} 