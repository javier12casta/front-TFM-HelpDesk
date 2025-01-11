import { Notification } from '../../../interfaces/notification.interface';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Test Notification 1',
    message: 'This is a test notification 1',
    read: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Test Notification 2',
    message: 'This is a test notification 2',
    read: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Test Notification 3',
    message: 'This is a test notification 3',
    read: false,
    createdAt: new Date().toISOString()
  }
]; 