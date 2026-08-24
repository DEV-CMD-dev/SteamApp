export const GameRating = {
  OverwhelminglyNegative: 0,
  VeryNegative: 1,
  Negative: 2,
  MostlyNegative: 3,
  Mixed: 4,
  MostlyPositive: 5,
  Positive: 6,
  VeryPositive: 7,
  OverwhelminglyPositive: 8,
} as const;

export type GameRating = (typeof GameRating)[keyof typeof GameRating];

export type GameDto = {
  id: number;
  title: string;
  description: string;
  developerId: string;
  developerName: string; 
  releaseDate: string;
  price: number;
  discount: number;
  systemRequirements: string;
  coverImageVertical: string;
  coverImageHorizontal: string;
  screenshots: string[]; 

  totalReviews: number;
  recommendedReviews: number;
  recommendationPercentage: number;
  rating: GameRating;
  hasRating: boolean;
};