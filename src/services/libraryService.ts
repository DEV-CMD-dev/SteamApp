import type { LibraryGameDto } from "../DTOs/Game/LibraryGameDto";
import type { FullLibraryGameDto } from "../DTOs/Game/FullLibraryGameDto";
import type { LibraryGameVersionDto } from "../DTOs/GameVersion/LibraryGameVersionDto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (res: Response, defaultError: string) => {
    const contentType = res.headers.get("content-type");

    const data =
        contentType && contentType.includes("application/json")
            ? await res.json()
            : null;

    if (!res.ok) {
        if (data?.errors) {
            const parsedErrors = Object.values(data.errors)
                .flat()
                .join(". ");

            throw new Error(parsedErrors);
        }

        throw new Error(
            data?.detail ||
            data?.message ||
            defaultError
        );
    }

    return data;
};

export const libraryService = {
    async getLibraryGames(): Promise<LibraryGameDto[]> {
        const res = await fetch(`${API_BASE_URL}/Library`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load library.");
    },

    async getLibraryGameById(gameId: number): Promise<FullLibraryGameDto> {
        const res = await fetch(
            `${API_BASE_URL}/Library/GetById?gameId=${gameId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );

        return handleResponse(res, "Failed to load game.");
    },

    async getRecentGameVersions(
        take: number = 10
    ): Promise<LibraryGameVersionDto[]> {
        const res = await fetch(
            `${API_BASE_URL}/GameVersion/recent?take=${take}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            }
        );

        return handleResponse(res, "Failed to load recent updates.");
    },
};

