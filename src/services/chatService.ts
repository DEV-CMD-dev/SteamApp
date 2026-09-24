import type { MessageDto } from "../DTOs/MessageDto";
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

export const chatService = {
    async getMessages(receiverId?: string, pageNumber: number = 1, pageSize: number = 4): Promise<PaginatedList<MessageDto>> {
        const queryParams = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
        });

        if (receiverId) {
            queryParams.append("receiverId", receiverId);
        }

        const res = await fetch(`${API_BASE_URL}/Message?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load friends.");
    },
};
