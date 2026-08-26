export type LoginResponseDto = {
  accessToken: string | null;
  expirationTime: Date | null;
  userName: string | null;

  requireTwoFactorAuth: boolean;
  message: string | null;
};