import type { GameDto } from "../DTOs/Game/GameDto";

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
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const wishlistService = {
    async getMyWishlist(): Promise<GameDto[]> {
        const res = await fetch(`${API_BASE_URL}/WishLists`, {
            method: "GET",
            headers: getAuthHeaders(),
        });

        return handleResponse(res, "Failed to load wishlist.");
    },

    async addGame(gameId: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/WishLists/${gameId}`, {
            method: "POST",
            headers: getAuthHeaders(),
        });

        await handleResponse(res, "Failed to add game to wishlist.");
    },

    async removeGame(gameId: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/WishLists/${gameId}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
        });

        await handleResponse(res, "Failed to remove game from wishlist.");
    },
};