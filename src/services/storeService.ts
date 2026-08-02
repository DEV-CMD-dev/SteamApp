import type { PaginatedResponse } from '../DTOs/PaginatedList';
import type { GameDto } from '../DTOs/GameDto';
import type { TagDto } from '../DTOs/TagDto';

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

export const storeService = {
    async fetchGames(pageNumber: number, pageSize: number = 3): Promise<PaginatedResponse<GameDto>> {
        const res = await fetch(`${API_BASE_URL}/Game?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        return handleResponse(res, "Failed to fetch games.");
    },

    async fetchTags(pageNumber: number, pageSize: number = 5): Promise<PaginatedResponse<TagDto>> {
        const res = await fetch(`${API_BASE_URL}/Tag?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        return handleResponse(res, "Failed to fetch tags.");
    }
};