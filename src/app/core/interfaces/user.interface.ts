export interface UserResponse {
  success: boolean;
  data: User;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  mfaSetup: boolean;
  mfaValidated: boolean;
} 