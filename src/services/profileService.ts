import type { PaginatedList } from "../DTOs/PaginatedList";
import type { FriendProfileDto } from "../DTOs/Profile/FriendProfileDto";
import type { ProfileDto } from "../DTOs/Profile/ProfileDto";
import type { ProfileSearchResultDto } from "../DTOs/Profile/ProfileSearchResultDto";

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

type UpdateProfilePayload = {
    avatar?: string;
    badges?: string;
    showcase?: string;
};

export const profileService = {
    async getProfile(userId: string): Promise<ProfileDto> {
        const res = await fetch(`${API_BASE_URL}/Profiles/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load profile.");
    },

    async updateProfile(payload: UpdateProfilePayload): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Profiles`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(payload),
        });

        await handleResponse(res, "Failed to update profile.");
    },
    async GetFriends(userId?: string, pageNumber: number = 1, pageSize: number = 4): Promise<PaginatedList<FriendProfileDto>> {
        const queryParams = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
        });

        if (userId) {
            queryParams.append("userId", userId);
        }

        const res = await fetch(`${API_BASE_URL}/Friendship/friends?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load friends.");
    },

    async search(query: string): Promise<ProfileSearchResultDto[]> {
        const res = await fetch(`${API_BASE_URL}/Profiles/search?query=${encodeURIComponent(query)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to search users.");
    },
};
