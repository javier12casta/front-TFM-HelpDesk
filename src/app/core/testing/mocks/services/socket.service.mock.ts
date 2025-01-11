import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../../services/socket.service';    

@Injectable({
  providedIn: 'root'
})
export class MockSocketService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor() {}

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  markAsRead(notificationId: string) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.notifications.next(updatedNotifications);
  }

  clearNotifications() {
    this.notifications.next([]);
  }

  emit(eventName: string, data: any) {
    // Mock implementation
  }

  listen(eventName: string): Observable<any> {
    return new Observable();
  }

  disconnect() {
    // Mock implementation
  }

  connect() {
    // Mock implementation
  }

  sendTestMessage() {
    // Mock implementation
  }
} 