export interface Ticket {
  _id?: string;
  ticketNumber: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  clientId: string;
  assignedTo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TicketCategory = 'Atención al Cliente' | 'Operaciones Bancarias' | 'Reclamos' | 'Servicios Digitales';
export type TicketStatus = 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Cancelado';
export type TicketPriority = 'Baja' | 'Media' | 'Alta'; 