import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import { SharedModule } from '../../shared/material-imports';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  private resolveHttpMessage(error: unknown, fallback: string): string {
    const err = error as { error?: { message?: string; msg?: string } | string; message?: string };
    const body = err?.error;
    if (typeof body === 'string') {
      return body;
    }
    if (body && typeof body === 'object') {
      if (body.message) {
        return body.message;
      }
      if (body.msg) {
        return body.msg;
      }
    }
    if (err?.message) {
      return err.message;
    }
    return fallback;
  }

  onSubmit() {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      const userData = {
        username: this.registerForm.get('username')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value,
        role: 'user'
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Cuenta creada. Inicie sesión con su correo y contraseña.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open(this.resolveHttpMessage(error, 'No se pudo completar el registro.'), 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  login() {
    this.router.navigate(['/auth/login']);
  }

} 