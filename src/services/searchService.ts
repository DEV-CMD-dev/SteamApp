import type { TagDto } from "../DTOs/Tag/TagDto";
import type { GameDto } from "../DTOs/Game/GameDto";
import type { PaginatedList } from "../DTOs/PaginatedList";

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

export const searchService = {
    async getAll(searchTerm?: string): Promise<PaginatedList<TagDto>> {
        const params = new URLSearchParams({
            pageNumber: "1",
            pageSize: "5",
        });

        if (searchTerm?.trim()) {
            params.append("searchTerm", searchTerm.trim());
        }

        const res = await fetch(`${API_BASE_URL}/Tags?${params.toString()}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load tags.");
    },

    async searchGames(searchTerm: string): Promise<PaginatedList<GameDto>> {
        const res = await fetch(`${API_BASE_URL}/Games?SearchTerm=${searchTerm}&pageSize=4`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to search games.");
    },

    async getPopularGames(): Promise<PaginatedList<GameDto>> {
        const res = await fetch(`${API_BASE_URL}/Games?OnSaleOnly=true&pageNumber=1&pageSize=4`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load popular games.");
    },
};