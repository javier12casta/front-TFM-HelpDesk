import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../material-imports';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { SocketService } from '../../../core/services/socket.service';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ThemeService } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [SharedModule, NotificationsComponent, RouterModule],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Output() menuToggled = new EventEmitter<void>();
  isLoggingOut = false;
  isDarkMode$!: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.isDarkMode$ = this.themeService.darkMode$;
  }

  toggleMenu() {
    this.menuToggled.emit();
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  logout() {
    if (this.isLoggingOut) return; // Prevenir múltiples clicks

    this.isLoggingOut = true;
    this.authService.logout()
      .pipe(
        finalize(() => this.isLoggingOut = false)
      )
      .subscribe({
        next: () => {
          this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Error durante el logout:', error);
          this.snackBar.open(error?.error?.message || 'Error al cerrar sesión', 'Cerrar', {
            duration: 3000
          });
          // Aún en caso de error, redirigimos al login
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
