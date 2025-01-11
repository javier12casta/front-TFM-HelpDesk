import { Component, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { SharedModule } from '../../material-imports';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { NotificationsComponent } from '../notifications/notifications.component';
import { ThemeManager } from '../../../core/services/theme-manager.service';
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
  isDark$!: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private themeManager: ThemeManager
  ) {}

  ngOnInit() {
    this.isDark$ = this.themeManager.isDark$;
  }

  toggleMenu() {
    this.menuToggled.emit();
  }

  toggleTheme() {
    const newTheme = this.themeManager.getPreferredTheme() === 'dark' ? 'light' : 'dark';
    this.themeManager.changeTheme(newTheme);
  }

  logout() {
    if (this.isLoggingOut) return;

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
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
