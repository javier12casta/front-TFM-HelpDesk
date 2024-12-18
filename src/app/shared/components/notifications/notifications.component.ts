import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService, Notification } from '../../../core/services/socket.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [CommonModule, MatBadgeModule, MatIconModule, MatMenuModule, MatButtonModule],
  providers: [SocketService],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private notificationSubscription?: Subscription;

  constructor(
    private socketService: SocketService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Conectar al socket cuando el usuario esté autenticado
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          this.socketService.emit('authenticate', { userId: user.id });
        }
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }

    // Suscribirse a las notificaciones
    this.notificationSubscription = this.socketService.getNotifications().subscribe(
      notifications => {
        this.notifications = notifications;
        this.unreadCount = notifications.filter(n => !n.read).length;

        // Mostrar notificación en el snackbar cuando llegue una nueva
        if (notifications.length > 0) {
          const lastNotification = notifications[notifications.length - 1];
          if (!lastNotification.read) {
            this.showNotificationSnackbar(lastNotification);
          }
        }
      },
      error => {
        console.error('Error al recibir notificaciones:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  markAsRead(id: string) {
    this.socketService.markAsRead(id);
  }

  clearAll() {
    this.socketService.clearNotifications();
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  }

  private showNotificationSnackbar(notification: Notification) {
    this.snackBar.open(notification.message, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`notification-${notification.type}`]
    });
  }
} 