import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService, Notification } from '../../../core/services/socket.service';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [CommonModule, MatBadgeModule, MatIconModule, MatMenuModule, MatButtonModule],
  encapsulation: ViewEncapsulation.None
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount = 0;
  private notificationSubscription?: Subscription;
  private lastNotificationId?: string;

  constructor(
    private socketService: SocketService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.notificationSubscription = this.socketService.getNotifications().subscribe(
      notifications => {
        console.log('Notificaciones actualizadas:', notifications);
        this.notifications = notifications || [];
        this.unreadCount = (notifications || []).filter(n => !n.read).length;

        // Mostrar snackbar solo para notificaciones nuevas
        if (notifications.length > 0) {
          const latestNotification = notifications[0];
          if (!latestNotification.read && latestNotification.id !== this.lastNotificationId) {
            this.lastNotificationId = latestNotification.id;
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

  markAsRead(notification: Notification) {
    this.socketService.markAsRead(notification.id);
    
    // Si la notificación tiene ticketId y es de tipo creación o actualización
    if (notification.ticketId && 
       (notification.message.includes('creado') || notification.message.includes('actualizado'))) {
      this.router.navigate(['/app/tickets', notification.ticketId]);
    }
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

} 