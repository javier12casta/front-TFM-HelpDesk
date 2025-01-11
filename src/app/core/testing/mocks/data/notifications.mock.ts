import { Notification } from '../../../interfaces/notification.interface';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'Ticket #123 ha sido creado',
    type: 'success',
    read: false,
    timestamp: new Date(),
    ticketId: '123'
  },
  {
    id: '2',
    message: 'Ticket #456 ha sido actualizado',
    type: 'info',
    read: true,
    timestamp: new Date(),
    ticketId: '456'
  },
  {
    id: '3',
    message: 'Error en el sistema',
    type: 'error',
    read: false,
    timestamp: new Date()
  }
]; 