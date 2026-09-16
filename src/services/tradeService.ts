import type { TradeOfferDto } from "../DTOs/TradeOffer/TradeOfferDto";
import type { CreateTradeOfferDto } from "../DTOs/TradeOffer/CreateTradeOfferDto";
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

const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const tradeService = {
    async getTradeOffers(pageNumber = 1, pageSize = 50): Promise<PaginatedList<TradeOfferDto>> {
        const res = await fetch(`${API_BASE_URL}/Trade?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            method: "GET",
            headers: authHeaders(),
        });

        return handleResponse(res, "Failed to load trade offers.");
    },

    async createTradeOffer(dto: CreateTradeOfferDto): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Trade/create`, {
            method: "POST",
            headers: authHeaders(),
            body: JSON.stringify(dto),
        });

        await handleResponse(res, "Failed to create trade offer.");
    },

    async acceptTradeOffer(id: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Trade/${id}/accept`, {
            method: "POST",
            headers: authHeaders(),
        });

        await handleResponse(res, "Failed to accept trade offer.");
    },

    async cancelTradeOffer(id: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Trade/${id}/cancel`, {
            method: "POST",
            headers: authHeaders(),
        });

        await handleResponse(res, "Failed to cancel trade offer.");
    },
};