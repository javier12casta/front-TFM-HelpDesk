export interface MfaResponse {
  data: {
    qrCodeUrl: string;
    secret: string;
  };
} 