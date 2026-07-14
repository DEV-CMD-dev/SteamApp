import type { LoginRequestDto } from "../DTOs/LoginRequestDto";
import type { RegisterRequestDto } from "../DTOs/RegisterRequestDto";

const API_BASE_URL = "http://localhost:5215/api/Auth";

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
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Login failed. Please check your credentials.");
  },

  async register(dto: RegisterRequestDto) {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    return handleResponse(res, "Registration failed. Try again.");
  }
};