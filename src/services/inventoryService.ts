import type { InventoryItemDto } from "../DTOs/InventoryItem/InventoryItemDto";
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

export const inventoryService = {
    async getMyInventory(pageNumber = 1, pageSize = 50): Promise<PaginatedList<InventoryItemDto>> {
        const res = await fetch(`${API_BASE_URL}/InventoryItem?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load inventory.");
    },

    async sellItem(inventoryItemId: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/InventoryItem/sell/${inventoryItemId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        await handleResponse(res, "Failed to sell item.");
    },
        async getUserInventory(userId: string, pageNumber = 1, pageSize = 50): Promise<PaginatedList<InventoryItemDto>> {
        const res = await fetch(
            `${API_BASE_URL}/InventoryItem/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );

        return handleResponse(res, "Failed to load user inventory.");
    },
};