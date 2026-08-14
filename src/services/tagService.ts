import type { CreateTagDto } from "../DTOs/Tag/CreateTagDto";
import type { TagDto } from "../DTOs/Tag/TagDto";
import type { PatchTagDto } from "../DTOs/Tag/PatchTagDto";
import type { PutTagDto } from "../DTOs/Tag/PutTagDto";
import type { PaginatedList } from "../DTOs/PaginatedList";

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

        throw new Error(
            data?.detail || data?.message || defaultError
        );
    }

    return data;
};

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const tagService = {
    async getAll(
        pageNumber = 1,
        pageSize = 10
    ): Promise<PaginatedList<TagDto>> {
        const params = new URLSearchParams();

        params.append("pageNumber", pageNumber.toString());
        params.append("pageSize", pageSize.toString());

        const res = await fetch(
            `${API_BASE_URL}/Tags?${params.toString()}`
        );

        return handleResponse(res, "Failed to load tags.");
    },

    async getById(id: number): Promise<TagDto> {
        const res = await fetch(`${API_BASE_URL}/Tags/${id}`);

        return handleResponse(res, "Failed to load tag.");
    },

    async create(dto: CreateTagDto): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Tags`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        return handleResponse(res, "Failed to create tag.");
    },

    async put(id: number, dto: PutTagDto): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Tags/${id}`, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        return handleResponse(res, "Failed to update tag.");
    },

    async patch(id: number, dto: PatchTagDto): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Tags/${id}`, {
            method: "PATCH",
            headers: getAuthHeaders(),
            body: JSON.stringify(dto),
        });

        return handleResponse(res, "Failed to update tag.");
    },

    async delete(id: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Tags/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        return handleResponse(res, "Failed to delete tag.");
    },
};