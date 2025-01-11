import { Category } from '../../../interfaces/category.interface';
import { Ticket, TicketStatus, TicketPriority, TicketSubCategory } from '../../../interfaces/ticket.interface';

const mockSubCategory: TicketSubCategory = {
  _id: '1',
  nombre_subcategoria: 'Test Subcategory',
  descripcion_subcategoria: 'Test Description',
  subcategoria_detalle: {
    _id: '1',
    nombre_subcategoria_detalle: 'Test Detail',
    descripcion: 'Test Detail Description'
  }
};

export const mockTickets: Ticket[] = [
  {
    _id: '1',
    ticketNumber: 'TK-001',
    description: 'Descripción del ticket 1',
    status: 'Pendiente' as TicketStatus,
    priority: 'Alta' as TicketPriority,
    category: { 
      _id: '1', 
      nombre_categoria: 'Hardware',
      descripcion_categoria: 'Hardware issues',
      color_categoria: '#FF0000'
    },
    area: { _id: '1', area: 'Tecnología y Sistemas' },
    createdAt: new Date(),
    updatedAt: new Date().toISOString(),
    subcategory: mockSubCategory,
    createdBy: 'user1',
    clientId: 'client1',
    assignedTo: 'tech1',
    comments: [],
    attachments: []
  },
  {
    _id: '2',
    ticketNumber: 'TK-002',
    description: 'Description of ticket 2',
    status: 'Resuelto' as TicketStatus,
    priority: 'Media' as TicketPriority,
    category: { 
      _id: '2', 
      nombre_categoria: 'Software',
      descripcion_categoria: 'Software issues',
      color_categoria: '#00FF00'
    },
    area: { _id: '2', area: 'Recursos Humanos' },
    createdAt: new Date(),
    updatedAt: new Date().toISOString(),
    subcategory: mockSubCategory,
    createdBy: 'user2',
    clientId: 'client2',
    assignedTo: 'tech2',
    comments: [],
    attachments: []
  },
  {
    _id: '3',
    ticketNumber: 'TK-003',
    description: 'Description of ticket 3',
    status: 'En Proceso' as TicketStatus,
    priority: 'Baja' as TicketPriority,
    category: { 
      _id: '1', 
      nombre_categoria: 'Hardware',
      descripcion_categoria: 'Hardware issues',
      color_categoria: '#FF0000'
    },
    area: { _id: '1', area: 'Tecnología y Sistemas' },
    createdAt: new Date(),
    updatedAt: new Date().toISOString(),
    subcategory: mockSubCategory,
    createdBy: 'user3',
    clientId: 'client3',
    assignedTo: 'tech3',
    comments: [],
    attachments: []
  }
];

export const mockCategories: Category[] = [
  {
    _id: '1',
    nombre_categoria: 'Hardware',
    descripcion_categoria: 'Hardware related issues',
    color_categoria: '#FF0000',
    subcategorias: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  },
  {
    _id: '2',
    nombre_categoria: 'Software',
    descripcion_categoria: 'Software related issues',
    color_categoria: '#00FF00',
    subcategorias: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0
  }
];

export const mockAreas = [
  { _id: '1', area: 'Tecnología y Sistemas' },
  { _id: '2', area: 'Recursos Humanos' }
];

export const mockStats = {
  total: 3,
  pendientes: 1,
  resueltos: 1,
  inProgress: 1
}; 