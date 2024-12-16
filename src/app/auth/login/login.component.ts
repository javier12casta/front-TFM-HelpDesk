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
      
          if (response && !response['requiresMfaSetup']) {
            this.handleMfaSetup(response['user']['id']);
          } else if (response && !response['requiresMfaValidation']) {
            this.showMfaInput = true;
            this.isLoading = false;
            this.snackBar.open('Por favor ingrese el código de verificación', 'Cerrar', {
              duration: 5000
            });
            this.validateMfa(this.userId);
          }
        },
        error: (error) => {
          console.error('Error en login:', error);
          
          this.snackBar.open(
            error.error?.message || 'Error al iniciar sesión', 
            'Cerrar',
            {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top'
            }
          );
          
          this.isLoading = false;
        }
      });
    }
  }
  
  private handleMfaSetup(userId: string) {
    this.mfaService.generateMFA(userId).subscribe({
      next: (response: any) => {
        this.qrCodeUrl = response['data']['qrCodeUrl'];
        this.mfaSecret = response['data']['secret'];
        this.showMfaSetup = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al generar MFA', 'Cerrar', {
          duration: 5000
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

        if (response['data']['verified']) {
          this.snackBar.open('MFA configurado exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.handleSuccessfulLogin(response);
        } else {
          this.snackBar.open('Código inválido', 'Cerrar', {
            duration: 3000
          });
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.snackBar.open('Código inválido', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  validateMfa(userId: string) {
    const token = this.loginForm.get('mfaToken')?.value;
    if (!token) {
      this.snackBar.open('Por favor ingrese el código de verificación', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;
    this.mfaService.validateMFA(userId, token).subscribe({
      next: (response) => {
        this.handleSuccessfulLogin(response);
      },
      error: (error) => {
        this.snackBar.open('Código inválido', 'Cerrar', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  handleSuccessfulLogin(response: any) {
    console.log('Login exitoso:', response);
    
    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });

    this.router.navigate(['/app']);
  }
  
  register(){
    this.router.navigate(['/auth/register']);
  }
  
}
