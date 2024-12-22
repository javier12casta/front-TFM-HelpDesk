import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../material-imports';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/interfaces/user.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: User = {} as User;
  showMfaSetup = false;
  qrCode: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  createForm() {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }]
    });
  }

  loadUserProfile() {
    const user = this.authService.getItem('user') as { id: string };
    this.userService.getCurrentUser(user.id).subscribe((userData: User) => {
      this.user = userData;
      this.profileForm.patchValue({
        username: userData.username,
        email: userData.email,
        role: userData.role
      });
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const userData = {
        ...this.profileForm.value,
        role: this.user.role
      };
      
      this.userService.updateUser(this.user._id || '', userData).subscribe(() => {
        this.loadUserProfile();
      });
    }
  }

  setupMFA() {
    this.showMfaSetup = true;
    this.userService.generateMFA().subscribe(response => {
      this.qrCode = response.qrCode;
    });
  }

  verifyMFA(token: string) {
    this.userService.verifyMFA(token).subscribe(() => {
      this.showMfaSetup = false;
      this.loadUserProfile();
    });
  }
} 