import type { ConfirmEmailDto } from "../DTOs/UserHelper/ConfirmEmailDto";
import type { PasswordResetDto } from "../DTOs/UserHelper/PasswordResetDto";
import type { RequestPasswordResetTokenDto } from "../DTOs/UserHelper/RequestPasswordResetTokenDto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (res: Response, defaultError: string) => {
  const contentType = res.headers.get("content-type");
  const data = contentType && contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    if (data?.errors) {
      const parsedErrors = Object.values(data.errors).flat().join(". ");
      throw new Error(parsedErrors);
    }
    throw new Error(data?.detail || data?.message || defaultError);
  }
  return data;
};

export const userHelperService = {
  async requestResetPassword(dto: RequestPasswordResetTokenDto) {
    const res = await fetch(`${API_BASE_URL}/UserHelper/request-reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Failed to send reset link. Try again.");
  },

  async resetPassword(dto: PasswordResetDto) {
    const res = await fetch(`${API_BASE_URL}/UserHelper/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Failed to reset password. Try again.");
  },

  async confirmEmail(dto: ConfirmEmailDto) {
    const res = await fetch(`${API_BASE_URL}/UserHelper/confirm-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Failed to confirm email. Try again.");
  }
};