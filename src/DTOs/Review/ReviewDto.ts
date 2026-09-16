export type ReviewDto = {
    id: number;
    userId: string;
    userName: string;
    gameId: number;
    isRecommended: boolean;
    content: string;
    hoursPlayed: number;
    createdAt: string;
    updatedAt: string | null;
    isEdited: boolean;

    userAvatarUrl: string | null;
    userGamesOwnedCount: number;
    userReviewsCount: number;
};

