import type { LoginRequestDto } from "../DTOs/LoginRequestDto";
import type { RegisterRequestDto } from "../DTOs/RegisterRequestDto";
import type { TwoFactorLoginRequestDto } from "../DTOs/UserHelper/TwofactorLoginRequestDto";

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

export const authService = {
  async login(dto: LoginRequestDto) {
    const res = await fetch(`${API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Login failed. Please check your credentials.");
  },

  async loginTwoFactor(dto: TwoFactorLoginRequestDto) {
  const res = await fetch(`${API_BASE_URL}/Auth/login-2FA`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });

  return handleResponse(res, "Failed to verify 2FA code.");
},

  async register(dto: RegisterRequestDto) {
    const res = await fetch(`${API_BASE_URL}/Auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Registration failed. Try again.");
  }
};