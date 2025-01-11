import { User } from '../../../interfaces/user.interface';

export const mockProfileUser: User = {
  _id: '1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'admin',
  isActive: true,
  mfaEnabled: false
}; 