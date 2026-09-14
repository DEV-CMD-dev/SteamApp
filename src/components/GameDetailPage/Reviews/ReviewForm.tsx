import { useState } from "react";
import "../../../css/reviews/reviewForm.css";
import { reviewService } from "../../../services/reviewService";

type ReviewFormProps = {
    gameId: number;
    onSubmitted?: () => void;
};

export default function ReviewForm({ gameId, onSubmitted }: ReviewFormProps) {
    const [isRecommended, setIsRecommended] = useState<boolean | null>(null);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isRecommended === null) {
            setError("Please choose whether you recommend this game.");
            return;
        }

        if (!content.trim()) {
            setError("Review content cannot be empty.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await reviewService.create({
                gameId,
                isRecommended,
                content: content.trim(),
            });

            setSuccess(true);
            setContent("");
            setIsRecommended(null);
            onSubmitted?.();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to submit review."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="review-form-block">
            <h2>Write a Review</h2>

            <form onSubmit={handleSubmit} className="review-form">

                <div className="review-form-recommend">
                    <button
                        type="button"
                        className={`recommend-btn ${isRecommended === true ? "active-yes" : ""}`}
                        onClick={() => setIsRecommended(true)}
                    >
                        👍 Recommended
                    </button>

                    <button
                        type="button"
                        className={`recommend-btn ${isRecommended === false ? "active-no" : ""}`}
                        onClick={() => setIsRecommended(false)}
                    >
                        👎 Not Recommended
                    </button>
                </div>

                <textarea
                    className="review-form-textarea"
                    placeholder="Share your thoughts about this game..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={2000}
                    rows={5}
                />

                <div className="review-form-footer">
                    <span className="review-form-count">
                        {content.length}/2000
                    </span>

                    <button
                        type="submit"
                        className="review-form-submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                </div>

                {error && <p className="review-form-error">{error}</p>}
                {success && (
                    <p className="review-form-success">
                        Your review has been submitted!
                    </p>
                )}

            </form>
        </section>
    );
}