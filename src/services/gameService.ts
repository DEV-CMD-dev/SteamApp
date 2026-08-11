import type { CreateGameDto } from "../DTOs/Game/CreateGameDto";
import type { GameDto } from "../DTOs/Game/GameDto";
import type { PatchGameDto } from "../DTOs/Game/PatchGameDto";
import type { PutGameDto } from "../DTOs/Game/PutGameDto";
import type { PaginatedList } from "../DTOs/PaginatedList";
import type { GameFilters } from "../Extensions/GameParameters";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (res: Response, defaultError: string) => {
    const contentType = res.headers.get("content-type");

    const data =
        contentType && contentType.includes("application/json")
            ? await res.json()
            : null;

    if (!res.ok) {
        if (data?.errors) {
            const parsedErrors = Object.values(data.errors).flat().join(". ");
            throw new Error(parsedErrors);
        }

        throw new Error(data?.detail || data?.message || defaultError
        );
    }

    return data;
};

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const gameService = {
    async getAll(
        pageNumber = 1,
        pageSize = 10,
        filters: GameFilters = {}
    ): Promise<PaginatedList<GameDto>> {

        const params = new URLSearchParams();

        params.append("pageNumber", pageNumber.toString());
        params.append("pageSize", pageSize.toString());

        if (filters.minPrice !== undefined) {
            params.append("MinPrice", filters.minPrice.toString());
        }

        if (filters.maxPrice !== undefined) {
            params.append("MaxPrice", filters.maxPrice.toString());
        }

        if (filters.searchTerm?.trim()) {
            params.append("SearchTerm", filters.searchTerm.trim());
        }

        if (filters.onSaleOnly !== undefined) {
            params.append("OnSaleOnly", filters.onSaleOnly.toString());
        }

        if (filters.tagIds?.length) {
            filters.tagIds.forEach(tagId => {
                params.append("TagIds", tagId.toString());
            });
        }

        const res = await fetch(
            `${API_BASE_URL}/Game?${params.toString()}`
        );

        return handleResponse(res, "Failed to load games.");
    },

    async getById(id: number): Promise<GameDto> {
        const res = await fetch(`${API_BASE_URL}/Game/${id}`);

        return handleResponse(res, "Failed to load game.");
    },

    async create(dto: CreateGameDto): Promise<GameDto> {
        const res = await fetch(`${API_BASE_URL}/Game`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        return handleResponse(res, "Failed to create game.");
    },

    async put(id: number, dto: PutGameDto) {
        const res = await fetch(`${API_BASE_URL}/Game/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        return handleResponse(res, "Failed to update game.");
    },

    async patch(id: number, dto: PatchGameDto) {
        const res = await fetch(`${API_BASE_URL}/Game/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        return handleResponse(res, "Failed to update game.");
    },

    async delete(id: number) {
        const res = await fetch(`${API_BASE_URL}/Game/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        return handleResponse(res, "Failed to delete game.");
    },
};