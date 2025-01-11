export const mockLoginResponse = {
  token: 'mock-jwt-token',
  user: {
    id: '123',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user',
    mfaEnabled: false,
    mfaSetup: false,
    mfaValidated: false
  },
  requiresMfaSetup: false,
  requiresMfaValidation: false
};

export const mockMfaResponse = {
  data: {
    qrCodeUrl: 'mock-qr-code-url',
    secret: 'mock-secret'
  }
};

export const mockRegisterData = {
  username: 'newuser',
  email: 'newuser@example.com',
  password: 'Password123!',
  role: 'user'
}; 