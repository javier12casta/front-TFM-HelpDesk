import { User } from '../../../interfaces/user.interface';

export const mockUser: User = {
  _id: '123',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  isActive: true,
  mfaEnabled: false,
  mfaSetup: false,
  mfaValidated: false,
};