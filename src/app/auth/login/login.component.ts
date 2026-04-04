import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/material-imports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MfaService } from '../../core/services/mfa.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  showMfaInput = false;
  showMfaSetup = false;
  qrCodeUrl: string = '';
  mfaSecret: string = '';
  userId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private mfaService: MfaService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      mfaToken: ['']
    });
  }

  ngOnInit() {
  }

  get authTitle(): string {
    if (this.showMfaSetup) {
      return 'Autenticación en dos pasos';
    }
    if (this.showMfaInput) {
      return 'Verificar identidad';
    }
    return 'Iniciar sesión';
  }

  get authSubtitle(): string | null {
    if (this.showMfaSetup) {
      return 'Escanee el código con su app (Google Authenticator, Authy, Microsoft Authenticator…).';
    }
    if (this.showMfaInput) {
      return 'Introduzca el código de 6 dígitos que genera su aplicación.';
    }
    return 'Use el correo y la contraseña de su cuenta.';
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

  login() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response: any) => {
          this.userId = response['user']['id'];

          if (response.user) {
            this.authService.setItem('user',response.user);
          }

          if (response.requiresMfaSetup) {
            this.handleMfaSetup(response.user.id);
          } else if (response.requiresMfaValidation) {
            this.showMfaInput = true;
            this.isLoading = false;
            this.snackBar.open('Por favor ingrese el código de verificación', 'Cerrar', {
              duration: 5000
            });
          } else {
            this.handleSuccessfulLogin({
              data: { verified: true },
              token: response.token
            });
          }
        },
        error: (error) => {
          console.error('Error en login:', error);

          this.snackBar.open(this.resolveHttpMessage(error, 'Error al iniciar sesión'), 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });

          this.isLoading = false;
        }
      });
    }
  }
  
  private handleMfaSetup(userId: string) {
    this.mfaService.generateMFA(userId).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          this.qrCodeUrl = response.data.qrCodeUrl;
          this.mfaSecret = response.data.secret;
          this.showMfaSetup = true;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open(this.resolveHttpMessage(error, 'No se pudo configurar la verificación en dos pasos.'), 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }

  verifyAndEnableMfa(userId: string) {
    const token = this.loginForm.get('mfaToken')?.value;
    if (!token) {
      this.snackBar.open('Por favor ingrese el código de verificación', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;
    this.mfaService.verifyAndEnableMFA(userId, token).subscribe({
      next: (response: any) => {
        if (this.isMfaVerifiedPayload(response)) {
          this.snackBar.open('Verificación en dos pasos activada correctamente.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.handleSuccessfulLogin(response);
        } else {
          this.snackBar.open('El código no es válido. Inténtelo de nuevo.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.snackBar.open(this.resolveHttpMessage(error, 'No se pudo validar el código.'), 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }

  submitMfaCode(): void {
    const token = this.loginForm.get('mfaToken')?.value?.trim();
    if (!token) {
      this.snackBar.open('Por favor ingrese el código de verificación', 'Cerrar', {
        duration: 3000
      });
      return;
    }
    this.validateMfa(this.userId);
  }

  validateMfa(userId: string) {
    const token = this.loginForm.get('mfaToken')?.value?.trim();
    if (!token) {
      this.snackBar.open('Por favor ingrese el código de verificación', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;
    this.mfaService.validateMFA(userId, token).subscribe({
      next: (response: any) => {
        if (response && this.isMfaVerifiedPayload(response)) {
          this.handleSuccessfulLogin(response);
        } else {
          this.snackBar.open('El código no es válido o ha caducado.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.snackBar.open(this.resolveHttpMessage(error, 'No se pudo verificar el código.'), 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        this.isLoading = false;
      }
    });
  }

  private isMfaVerifiedPayload(response: any): boolean {
    const v = response?.data?.verified;
    return v === true || v === 'true';
  }

  handleSuccessfulLogin(response: any) {
    const mfaVerified = this.isMfaVerifiedPayload(response);
    if (!response?.token && !mfaVerified) {
      this.snackBar.open('Error en la autenticación', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top'
      });
      this.isLoading = false;
      return;
    }

    console.log('Login exitoso:', response);
    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    this.isLoading = false;
    this.router.navigate(['/app']);
  }
  
  register(){
    this.router.navigate(['/auth/register']);
  }
  
}
