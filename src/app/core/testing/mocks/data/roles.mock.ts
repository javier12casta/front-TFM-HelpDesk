import { Role } from '../../../interfaces/role.interface';
import { mockMenus } from './menus.mock';

export const mockRoles: Role[] = [
  {
    _id: '1',
    name: 'Admin',
    description: 'Administrator role',
    permissions: ['ver', 'crear', 'editar', 'borrar', 'reportes', 'dashboard'],
    menus: mockMenus.map(menu => ({
      _id: menu._id!,
      name: menu.name,
      icon: menu.icon || '',
      path: menu.path,
    })),
    isActive: true
  },
  {
    _id: '2',
    name: 'User',
    description: 'Basic user role',
    permissions: ['ver'],
    menus: mockMenus.map(menu => ({
      _id: menu._id!,
      name: menu.name,
      icon: menu.icon || '',
      path: menu.path,
    })),
    isActive: true
  }
];

export const mockRole: Role = mockRoles[0]; 