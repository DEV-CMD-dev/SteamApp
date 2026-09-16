import { useContext, useEffect, useState } from "react";
import type { ReviewDto } from "../../../DTOs/Review/ReviewDto";
import { reviewService } from "../../../services/reviewService";
import { AuthContext } from "../../../contexts/AuthContext";

import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

type ReviewsProps = {
    gameId: number;
};

export default function Reviews({ gameId }: ReviewsProps) {
    const { username } = useContext(AuthContext);

    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadReviews = async () => {
        try {
            setIsLoading(true);

            const response = await reviewService.getByGame(gameId);

            setReviews(response.items);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, [gameId]);

    const myReview = username
        ? reviews.find((review) => review.userName === username)
        : undefined;

    const otherReviews = reviews.filter(
        (review) => review.id !== myReview?.id
    );

    if (isLoading) {
        return (
            <section className="reviews-section">
                <div className="reviews-loading">
                    Loading reviews...
                </div>
            </section>
        );
    }

    return (
        <section className="reviews-section">

            {myReview ? (
                <div className="my-review-section">
                    <h2>YOUR REVIEW</h2>

                    <ReviewItem
                        review={myReview}
                        isOwnReview={true}
                        onChanged={loadReviews}
                    />
                </div>
            ) : (
                <ReviewForm
                    gameId={gameId}
                    onSubmitted={loadReviews}
                />
            )}

            <div className="recent-reviews-section">
                <h2>RECENT REVIEWS</h2>

                {otherReviews.length > 0 ? (
                    <div className="reviews-list">
                        {otherReviews.map((review) => (
                            <ReviewItem
                                key={review.id}
                                review={review}
                                isOwnReview={false}
                                onChanged={loadReviews}
                            />
                        ))}
                    </div>
                ) : (
                    !myReview && (
                        <div className="no-reviews">
                            No user reviews yet
                        </div>
                    )
                )}
            </div>

        </section>
    );
}