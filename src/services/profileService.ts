import type { ProfileDto } from "../DTOs/Profile/ProfileDto";

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
};
