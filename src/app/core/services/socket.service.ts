import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  ticketId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;
  private notifications = new BehaviorSubject<Notification[]>([]);

  constructor() {
    this.socket = io(environment.wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true
    });

    // Eventos básicos del socket
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de socket');
      
      // Obtener el userId del localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user && user.id) {
            // Unirse a la sala personal del usuario
            this.socket.emit('joinRoom', user.id);
          }
        } catch (error) {
          console.error('Error al parsear usuario:', error);
        }
      }
    });

    // Escuchar las notificaciones almacenadas
    this.socket.on('stored-notifications', (storedNotifications: any[]) => {
      console.log('Notificaciones almacenadas recibidas:', storedNotifications);
      const formattedNotifications = storedNotifications.map(notification => ({
        id: notification._id || crypto.randomUUID(),
        message: notification.message,
        type: notification.type || 'info',
        timestamp: new Date(notification.createdAt || notification.timestamp),
        read: notification.read || false,
        ticketId: notification.ticketId || undefined
      }));
      this.notifications.next(formattedNotifications);
    });

    // Resto de la configuración de eventos...
    const ticketEvents = [
      'ticketCreated',
      'ticketAssigned',
      'ticketUpdated',
      'ticketDeleted',
      'ticketCommented'
    ];

    ticketEvents.forEach(event => {
      this.socket.on(event, (data: any) => {
        console.log(`Evento ${event} recibido:`, data);
        const notification: Notification = {
          id: crypto.randomUUID(),
          message: this.getMessageForEvent(event, data),
          type: this.getTypeForEvent(event),
          timestamp: new Date(),
          read: false,
          ticketId: data.ticketId || data._id
        };
        const currentNotifications = this.notifications.value;
        this.notifications.next([notification, ...currentNotifications]);
      });
    });

    // Eventos de prueba
    this.socket.on('test', (data) => {
      console.log('Test recibido:', data);
    });

    this.socket.on('test-response', (data) => {
      console.log('Test response recibido:', data);
    });
  }

  private getMessageForEvent(event: string, data: any): string {
    switch (event) {
      case 'ticketCreated':
        return `Nuevo ticket creado: ${data.description || 'Sin descripción'}`;
      case 'ticketAssigned':
        return `Ticket asignado a ${data.assignedTo || 'alguien'}`;
      case 'ticketUpdated':
        return `Ticket actualizado: ${data.message || 'Sin descripción'}`;
      case 'ticketDeleted':
        return `Ticket eliminado`;
      case 'ticketCommented':
        return `Nuevo comentario en ticket: ${data.comment || 'Sin contenido'}`;
      default:
        return `Evento de ticket: ${event}`;
    }
  }

  private getTypeForEvent(event: string): 'info' | 'success' | 'warning' | 'error' {
    switch (event) {
      case 'ticketCreated':
        return 'success';
      case 'ticketAssigned':
        return 'info';
      case 'ticketUpdated':
        return 'info';
      case 'ticketDeleted':
        return 'warning';
      case 'ticketCommented':
        return 'info';
      default:
        return 'info';
    }
  }

  // Método para enviar mensaje de prueba
  sendTestMessage() {
    this.socket.emit('test-message', {
      text: 'Mensaje de prueba',
      timestamp: new Date()
    });
  }

  // Obtener notificaciones
  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  // Marcar notificación como leída
  markAsRead(notificationId: string) {
    const userStr = localStorage.getItem('user');
    let userId = null;
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userId = user.id;
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }

    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    this.notifications.next(updatedNotifications);
    
    // Emitir evento al servidor con userId
    this.socket.emit('markNotificationAsRead', { 
      notificationId,
      userId 
    });
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