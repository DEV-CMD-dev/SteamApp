import type { MiniProfileDto } from "../DTOs/Profile/MiniProfileDto";
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

export const orderService = {
    async getBalance(): Promise<number> {
        const res = await fetch(`${API_BASE_URL}/Order/GetBalance`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load balance.");
    },
    async getUser(): Promise<MiniProfileDto> {
        const res = await fetch(`${API_BASE_URL}/Profiles/GetMyProfile`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load balance.");
    },
};