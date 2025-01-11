import { User } from '../../../interfaces/user.interface';
import { mockRole } from './roles.mock';

export const mockUsers: User[] = [
  {
    _id: '1',
    username: 'admin',
    email: 'admin@test.com',
    role: "admin",
    isActive: true,
    mfaEnabled: true,
  },
  {
    _id: '2',
    username: 'user',
    email: 'user@test.com',
    role: "user",
    isActive: true,
    mfaEnabled: false,
  }
];

export const mockUser = mockUsers[0]; 