import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { SharedModule } from '../../../../shared/material-imports';
import { RoleService } from '../../../../core/services/role.service';
import { Role } from '../../../../core/interfaces/role.interface';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ]
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UserService);
  private roleService = inject(RoleService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    isActive: [true],
    mfaEnabled: [false]
  });

  roles: Role[] = [];
  isEditing = false;
  userId: string | null = null;

  ngOnInit(): void {
    this.loadRoles();
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditing = true;
      this.loadUser(this.userId);
    }
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe((response: any) => {
      this.roles = response;
    });
  }

  loadUser(id: string): void {
    this.usersService.getUserById(id).subscribe((response: any) => {
      const user = response.data;
      this.userForm.patchValue({
        username: user.username,
        email: user.email,
        role: user.role._id,
        isActive: user.isActive,
        mfaEnabled: user.mfaEnabled
      });
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData = {
        username: this.userForm.value.username || '',
        email: this.userForm.value.email || '',
        role: this.userForm.value.role || '',
        isActive: this.userForm.value.isActive ?? true,
        mfaEnabled: this.userForm.value.mfaEnabled ?? false
      };
      
      if (this.isEditing && this.userId) {
        this.usersService.updateUser(this.userId, userData).subscribe(() => {
          this.router.navigate(['/app/users']);
        });
      } else {
        this.usersService.createUser(userData).subscribe(() => {
          this.router.navigate(['/app/users']);
        });
      }
    }
  }
} 