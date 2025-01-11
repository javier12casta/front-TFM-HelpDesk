import { Ticket } from '../../../interfaces/ticket.interface';

export const mockTicketsTest: Ticket[] = [
  {
    _id: '1',
    ticketNumber: 'TK-001',
    description: 'Test ticket 1',
    status: 'Pendiente',
    priority: 'Alta',
    category: {
      _id: '1',
      nombre_categoria: 'Hardware',
      descripcion_categoria: 'Hardware issues',
      color_categoria: '#FF0000',
      subcategorias: []
    },
    subcategory: {
      _id: '1',
      nombre_subcategoria: 'PC',
      descripcion_subcategoria: 'PC issues',
      subcategoria_detalle: {
        _id: '1',
        nombre_subcategoria_detalle: 'PC Hardware',
        descripcion: 'PC Hardware issues'
      }
    },
    clientId: {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      isActive: true
    },
    assignedTo: {
      _id: '2',
      username: 'support',
      email: 'support@example.com',
      role: 'support',
      isActive: true
    },
    attachment: {
      filename: 'test.txt',
      mimetype: 'text/plain',
      downloadUrl: 'http://test.com/test.txt'
    },
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date().toISOString(),
    createdBy: '1'
  },
  {
    _id: '2',
    ticketNumber: 'TK-002',
    description: 'Test ticket 2',
    status: 'En Proceso',
    priority: 'Media',
    category: {
      _id: '2',
      nombre_categoria: 'Software',
      descripcion_categoria: 'Software issues',
      color_categoria: '#00FF00',
      subcategorias: []
    },
    subcategory: {
      _id: '2',
      nombre_subcategoria: 'Windows',
      descripcion_subcategoria: 'Windows issues',
      subcategoria_detalle: {
        _id: '2',
        nombre_subcategoria_detalle: 'Windows OS',
        descripcion: 'Windows operating system issues'
      }
    },
    clientId: {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      isActive: true
    },
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date().toISOString(),
    createdBy: '1'
  }
];

export const mockTicketTest = mockTicketsTest[0];

export const mockTicketComments = [
  {
    _id: '1',
    text: 'Test comment 1',
    userId: {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      isActive: true
    },
    attachment: null,
    statusChange: null,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    text: 'Test comment 2',
    userId: {
      _id: '2',
      username: 'support',
      email: 'support@example.com',
      role: 'support',
      isActive: true
    },
    attachment: null,
    statusChange: {
      oldStatus: 'Pendiente',
      newStatus: 'En Proceso'
    },
    createdAt: new Date().toISOString()
  }
]; 