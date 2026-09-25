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

export const friendsService = {
    async GetIncomingInvites(pageNumber: number = 1, pageSize: number = 4): Promise<PaginatedList<ProfileDto>> {
        const queryParams = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
        });

        const res = await fetch(`${API_BASE_URL}/Friendship/incoming-requests?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to load friends.");
    },

    async SendFriendRequest(userName: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Friendship/send-request?userName=${encodeURIComponent(userName)}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to send friend request.");
    },

    async AcceptFriendRequest(friendId: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Friendship/accept-request?friendId=${encodeURIComponent(friendId)}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to accept friend request.");
    },

    async DeclineFriendRequest(friendId: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/Friendship/decline-request?friendId=${encodeURIComponent(friendId)}`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        return handleResponse(res, "Failed to decline friend request.");
    }
};