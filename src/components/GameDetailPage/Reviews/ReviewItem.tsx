import { useState } from "react";
import type { ReviewDto } from "../../../DTOs/Review/ReviewDto";
import { reviewService } from "../../../services/reviewService";
import toast from "react-hot-toast";
import "../../../css/reviews/reviewItem.css";

type ReviewItemProps = {
    review: ReviewDto;
    isOwnReview: boolean;
    onChanged: () => void;
};

export default function ReviewItem({
    review,
    isOwnReview,
    onChanged,
}: ReviewItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isRecommended, setIsRecommended] = useState(review.isRecommended);
    const [content, setContent] = useState(review.content);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [avatarError, setAvatarError] = useState(false);

    const handleUpdate = async () => {
        if (!content.trim()) {
            toast.error("Review content cannot be empty");
            return;
        }

        try {
            setIsLoading(true);

            const promise = reviewService.update(review.id, {
                isRecommended,
                content: content.trim(),
            });

            await toast.promise(promise, {
                loading: "Updating review...",
                success: "Review updated",
                error: "Failed to update review",
            });

            setIsEditing(false);
            onChanged();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);

            const promise = reviewService.delete(review.id);

            await toast.promise(promise, {
                loading: "Deleting review...",
                success: "Review deleted",
                error: "Failed to delete review",
            });

            onChanged();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
            setShowDeleteModal(false);
        }
    };

    const avatarLetter = review.userName?.charAt(0).toUpperCase() ?? "?";
    const showAvatarImage = review.userAvatarUrl && !avatarError;

    const renderAvatar = () => (
        <div className="review-avatar">
            {showAvatarImage ? (
                <img
                    src={review.userAvatarUrl!}
                    alt={review.userName}
                    onError={() => setAvatarError(true)}
                />
            ) : (
                avatarLetter
            )}
        </div>
    );

    const renderUserInfo = () => (
        <div className="review-user-info">
            <strong>{review.userName}</strong>
            <span>{review.hoursPlayed} hrs on record</span>
            <span className="review-user-meta">
                {review.userGamesOwnedCount} games owned
            </span>
            <span className="review-user-meta">
                {review.userReviewsCount} reviews
            </span>
        </div>
    );

    if (isEditing) {
        return (
            <article className="review-item review-item-editing">
                <div className="review-item-body">
                    <div className="review-user-col">
                        {renderAvatar()}
                        {renderUserInfo()}
                    </div>

                    <div className="review-main-col">
                        <div className="review-edit-recommend">
                            <button
                                type="button"
                                className={
                                    isRecommended
                                        ? "review-choice active-positive"
                                        : "review-choice"
                                }
                                onClick={() => setIsRecommended(true)}
                            >
                                👍 Recommended
                            </button>

                            <button
                                type="button"
                                className={
                                    !isRecommended
                                        ? "review-choice active-negative"
                                        : "review-choice"
                                }
                                onClick={() => setIsRecommended(false)}
                            >
                                👎 Not Recommended
                            </button>
                        </div>

                        <textarea
                            className="review-edit-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            maxLength={2000}
                        />

                        <div className="review-edit-footer">
                            <span>{content.length}/2000</span>

                            <div className="review-edit-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setContent(review.content);
                                        setIsRecommended(review.isRecommended);
                                    }}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        );
    }

    return (
        <>
            <article className="review-item">
                <div className="review-item-body">
                    <div className="review-user-col">
                        {renderAvatar()}
                        {renderUserInfo()}
                    </div>

                    <div className="review-main-col">
                        <div
                            className={
                                review.isRecommended
                                    ? "review-verdict positive"
                                    : "review-verdict negative"
                            }
                        >
                            <span className="review-verdict-icon">
                                {review.isRecommended ? "👍" : "👎"}
                            </span>
                            <span className="review-verdict-label">
                                {review.isRecommended
                                    ? "Recommended"
                                    : "Not Recommended"}
                            </span>
                        </div>

                        <p className="review-content">{review.content}</p>

                        <div className="review-item-footer">
                            <span>
                                Posted:{" "}
                                {new Date(review.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}
                                {review.isEdited && " · Edited"}
                            </span>

                            {isOwnReview && (
                                <div className="review-actions">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        disabled={isLoading}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowDeleteModal(true)}
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </article>

            {showDeleteModal && (
                <div
                    className="modal-overlay"
                    onClick={() => !isLoading && setShowDeleteModal(false)}
                >
                    <div
                        className="modal-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="modal-title">Delete review</h3>
                        <p className="modal-text">
                            Are you sure you want to delete this review? This
                            action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="modal-btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="modal-btn-danger"
                                onClick={handleDelete}
                                disabled={isLoading}
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}