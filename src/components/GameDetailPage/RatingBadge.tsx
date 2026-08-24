import "../../css/ratingBadge.css";
import { GameRating } from "../../DTOs/Game/GameDto";

type RatingConfig = {
  label: string;
  className: string;
};

const RATING_MAP: Record<number, RatingConfig> = {
  [GameRating.OverwhelminglyNegative]: { label: "Overwhelmingly Negative", className: "rating-tier-1" },
  [GameRating.VeryNegative]: { label: "Very Negative", className: "rating-tier-1" },
  [GameRating.Negative]: { label: "Negative", className: "rating-tier-2" },
  [GameRating.MostlyNegative]: { label: "Mostly Negative", className: "rating-tier-2" },
  [GameRating.Mixed]: { label: "Mixed", className: "rating-tier-3" },
  [GameRating.MostlyPositive]: { label: "Mostly Positive", className: "rating-tier-4" },
  [GameRating.Positive]: { label: "Positive", className: "rating-tier-4" },
  [GameRating.VeryPositive]: { label: "Very Positive", className: "rating-tier-5" },
  [GameRating.OverwhelminglyPositive]: { label: "Overwhelmingly Positive", className: "rating-tier-5" },
};

type RatingBadgeProps = {
  rating: GameRating;
  totalReviews: number;
  recommendationPercentage: number;
};

export default function RatingBadge({
  rating,
  totalReviews,
  recommendationPercentage,
}: RatingBadgeProps) {
  if (totalReviews === 0) {
    return (
      <div className="rating-row">
        <span className="rating-badge rating-tier-none">No user reviews yet</span>
      </div>
    );
  }

  const config = RATING_MAP[rating];

  return (
    <div className="rating-row">
      <span className={`rating-badge ${config.className}`}>
        {config.label}
      </span>
      <span className="rating-percentage">
        {recommendationPercentage.toFixed(0)}% Positive
      </span>
    </div>
  );
}