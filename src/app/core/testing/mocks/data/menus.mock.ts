import { Menu } from '../../../interfaces/menu.interface';

export const mockMenus: Menu[] = [
  {
    _id: '1',
    name: 'Dashboard',
    path: '/app/dashboard',
    icon: 'dashboard',
    parentId: undefined
  },
  {
    _id: '2',
    name: 'Tickets',
    path: '/app/tickets',
    icon: 'ticket',
    parentId: undefined
  },
  {
    _id: '3',
    name: 'Crear Ticket',
    path: '/app/tickets/create',
    icon: 'add',
    parentId: '2'
  }
];

export const mockMenu: Menu = {
  _id: '1',
  name: 'Test Menu',
  path: '/test',
  icon: 'test',
  parentId: undefined
}; 