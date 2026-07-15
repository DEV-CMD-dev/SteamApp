export type PasswordResetDto = {
    identifier: string;
    token: string;
    newPassword: string;
};