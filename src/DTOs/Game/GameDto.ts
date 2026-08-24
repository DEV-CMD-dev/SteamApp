export const GameRating = {
    None: 0,
    OverwhelminglyNegative: 1,
    VeryNegative: 2,
    Negative: 3,
    MostlyNegative: 4,
    Mixed: 5,
    MostlyPositive: 6,
    Positive: 7,
    VeryPositive: 8,
    OverwhelminglyPositive: 9,
} as const;

export type ScreenshotDto = {
    id: number;
    url: string;
    gameId: number;
};

export type GameRating = (typeof GameRating)[keyof typeof GameRating];

export type GameDto = {
    id: number;
    title: string;
    description: string;
    developerId: string;
    developerName: string;
    releaseDate: Date | string;
    price: number;
    discount: number;
    systemRequirements: string;
    coverImageHorizontal: string;
    coverImageVertical: string;
    tagIds: [];
    screenshots: ScreenshotDto[];
     
    totalReviews: number;
    recommendedReviews: number;
    recommendationPercentage: number;
    rating: GameRating;
}