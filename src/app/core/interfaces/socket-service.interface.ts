import { Observable } from 'rxjs';
import { Notification } from './notification.interface';

export interface ISocketService {
  notifications$: Observable<Notification[]>;
  connect(): void;
  disconnect(): void;
  getNotifications(): Observable<Notification[]>;
  markAsRead(notificationId: string): void;
} 