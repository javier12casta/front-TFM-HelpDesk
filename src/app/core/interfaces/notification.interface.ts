export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  read: boolean;
  timestamp: Date;
  ticketId?: string;
} 