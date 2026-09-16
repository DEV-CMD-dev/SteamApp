import type { ReviewDto } from "../DTOs/Review/ReviewDto";
import type { CreateReviewDto } from "../DTOs/Review/CreateReviewDto";
import type { UpdateReviewDto } from "../DTOs/Review/UpdateReviewDto";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/Review`;

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const message = await res.text().catch(() => "");

        throw new Error(
            message || `Request failed with status ${res.status}`
        );
    }

    if (res.status === 204) {
        return undefined as T;
    }

    return res.json();
}

export const reviewService = {
    async create(dto: CreateReviewDto): Promise<ReviewDto> {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        return handleResponse<ReviewDto>(res);
    },

    async getByGame(
        gameId: number,
        pageNumber = 1,
        pageSize = 10
    ) {
        const res = await fetch(
            `${BASE_URL}/game/${gameId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );

        return handleResponse<{
            items: ReviewDto[];
            totalCount: number;
        }>(res);
    },

    async update(
        reviewId: number,
        dto: UpdateReviewDto
    ): Promise<ReviewDto> {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${BASE_URL}/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dto),
        });

        return handleResponse<ReviewDto>(res);
    },

    async delete(reviewId: number): Promise<void> {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${BASE_URL}/${reviewId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return handleResponse<void>(res);
    },
};