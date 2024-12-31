import { SubCategory, SubCategoryDetail } from './category.interface';

export type TicketStatus = 'Pendiente' | 'En Proceso' | 'Resuelto' | 'Cancelado';
export type TicketPriority = 'Baja' | 'Media' | 'Alta';

export interface TicketSubCategoryDetail {
  _id: string;
  nombre_subcategoria_detalle: string;
  descripcion: string;
}

export interface TicketSubCategoryDTO {
  nombre_subcategoria: string;
  descripcion_subcategoria: string;
  subcategoria_detalle: {
    nombre_subcategoria_detalle: string;
    descripcion: string;
  }
}

export interface TicketSubCategory {
  _id: string;
  nombre_subcategoria: string;
  descripcion_subcategoria: string;
  subcategoria_detalle: TicketSubCategoryDetail;
}

export interface TicketCategory {
  _id: string;
  nombre_categoria: string;
  descripcion_categoria: string;
  color_categoria: string;
}

export interface Attachment {
  filename: string;
  path: string;
  mimetype: string;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  description: string;
  category?: any;
  clientId?: any;
  subcategory: TicketSubCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdBy: string;
  assignedTo?: any;
  createdAt: Date;
  updatedAt: string;
  comments?: string[];
  attachments?: string[];
  permissions?: any;
  attachment?: any;
  area?: any;
}

export interface CreateTicketDTO {
  description: string;
  categoryId: string;
  subcategory: TicketSubCategoryDTO;
  priority: TicketPriority;
}

export interface UpdateTicketDTO extends Partial<CreateTicketDTO> {
  status?: TicketStatus;
  assignedTo?: string;
  comments?: string[];
  attachments?: string[];
} 