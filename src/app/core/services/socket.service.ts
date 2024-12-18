import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private notifications = new BehaviorSubject<Notification[]>([]);

  constructor() {
    this.socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true
    });

    // Eventos básicos del socket
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de socket');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor de socket');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    // Escuchar eventos de notificaciones del backend
    this.socket.on('notification', (notification: Notification) => {
      const currentNotifications = this.notifications.value;
      this.notifications.next([...currentNotifications, notification]);
    });

    this.socket.on('notifications', (notifications: Notification[]) => {
      this.notifications.next(notifications);
    });

    // Solicitar notificaciones al conectar
    this.socket.on('connect', () => {
      this.socket.emit('getNotifications');
    });
  }

  // Obtener notificaciones
  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  // Marcar notificación como leída
  markAsRead(notificationId: string) {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.notifications.next(updatedNotifications);
    this.socket.emit('markNotificationAsRead', notificationId);
  }

  // Limpiar todas las notificaciones
  clearNotifications() {
    this.notifications.next([]);
    this.socket.emit('clearNotifications');
  }

  // Método para emitir eventos
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Método para escuchar eventos
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  // Método para desconectar el socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
} 