import { useState, useEffect } from "react";
import "../css/gamePage.css";
import GameGallery from "../components/GameDetailPage/GameGallery";
import type { GameDto, GameRating } from "../DTOs/Game/GameDto";
import { wishlistService } from "../services/wishListService";
import Bag from "../assets/detail-page/solar_bag-bold.png";
import RatingBadge from "../components/GameDetailPage/RatingBadge";


type GamePageProps = {
    gameDto: GameDto;
};

const ratingText = (rating: GameRating): string => {
    switch (rating) {
        case 9:
            return "Overwhelmingly Positive";
        case 8:
            return "Very Positive";
        case 7:
            return "Positive";
        case 6:
            return "Mostly Positive";
        case 5:
            return "Mixed";
        case 4:
            return "Mostly Negative";
        case 3:
            return "Negative";
        case 2:
            return "Very Negative";
        case 1:
            return "Overwhelmingly Negative";
        case 0:
            return "No Rating";
        default:
            return "Unknown";
    }
};

export default function GamePage({ gameDto }: GamePageProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const [wishlistError, setWishlistError] = useState<string | null>(null);

    const rawRequirements = (gameDto.systemRequirements ?? "")
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter(Boolean);

    const parsedRequirements = rawRequirements
        .map((item) => {
            const separatorIndex = item.indexOf(":");

            if (separatorIndex === -1) {
                return {
                    label: "",
                    value: item.trim(),
                };
            }

            return {
                label: item.substring(0, separatorIndex).trim(),
                value: item.substring(separatorIndex + 1).trim(),
            };
        })
        .filter((item) => item.label || item.value);

    const shouldShowToggle =
        gameDto.description &&
        gameDto.description.length > 220;

    const handleWishlistToggle = async () => {
        try {
            setIsWishlistLoading(true);
            setWishlistError(null);

            if (isInWishlist) {
                await wishlistService.removeGame(gameDto.id);
                setIsInWishlist(false);
            } else {
                await wishlistService.addGame(gameDto.id);
                setIsInWishlist(true);
            }
        } catch (err) {
            setWishlistError(
                err instanceof Error
                    ? err.message
                    : "Failed to update wishlist."
            );
        } finally {
            setIsWishlistLoading(false);
        }
    };
    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const wishlist = await wishlistService.getMyWishlist();

                const exists = wishlist.some(
                    game => game.id === gameDto.id
                );

                setIsInWishlist(exists);
            } catch (err) {
                console.error("Failed to check wishlist:", err);
            }
        };

        checkWishlist();
    }, [gameDto.id]);

    return (
        <div className="game-page">
            <h1 className="game-title">{gameDto.title}</h1>

            <div className="game-page-grid">
                <div className="game-main">

                    <GameGallery
                        slides={[gameDto.coverImageHorizontal, ...gameDto.screenshots.map((s) => s.url)]}
                        title={gameDto.title}
                    />

                    <div className="game-description-wrapper">
                        <p className={`game-description ${!isExpanded && shouldShowToggle ? "collapsed" : ""}`}>
                            {gameDto.description}
                        </p>
                        {shouldShowToggle && (
                            <button
                                className="show-more-btn"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? "Show less" : "Show more"}
                            </button>
                        )}
                    </div>
                </div>

                <aside className="game-sidebar">

                    <div className="game-sidebar-image">
                        <img
                            src={gameDto.coverImageVertical}
                            alt={gameDto.title}
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                            }}
                        />
                    </div>

                    <p className="game-sidebar-summary">
                        {gameDto.description}
                    </p>

                    <div className="game-sidebar-buy-box">

                        <button className="game-sidebar-buy-btn">
                            <img src={Bag} alt="" />Buy Now
                        </button>

                        <button
                            className="game-sidebar-wishlist-btn"
                            onClick={handleWishlistToggle}
                            disabled={isWishlistLoading}
                        >
                            {isWishlistLoading
                                ? "Loading..."
                                : isInWishlist
                                    ? "★ Remove from Wishlist"
                                    : "★ Add to Wishlist"}
                        </button>
                        {wishlistError && (
                            <p className="wishlist-error">
                                {wishlistError}
                            </p>
                        )}

                    </div>

                    <div className="game-sidebar-review-row">

                        <span className="game-sidebar-review-label">
                            RECENT REVIEWS
                        </span>

                        {gameDto.totalReviews > 0 ? (
                            <span className={`game-sidebar-review-value ${ratingText(gameDto.rating)}`}>
                                {ratingText(gameDto.rating)} ({gameDto.totalReviews.toLocaleString()})
                            </span>
                        ) : (
                            <span className="game-sidebar-review-value review-not-enough">
                                No user reviews yet
                            </span>
                        )}

                    </div>

                    <div className="game-sidebar-metadata-list">

                        <div className="game-sidebar-info-row">
                            <span className="game-sidebar-info-label">
                                RELEASE DATE
                            </span>
                            <span className="game-sidebar-info-value">
                                {new Date(gameDto.releaseDate).toLocaleDateString(
                                    "en-GB",
                                    { day: "2-digit", month: "short", year: "numeric" }
                                )}
                            </span>
                        </div>

                        <div className="game-sidebar-info-row">
                            <span className="game-sidebar-info-label">
                                DEVELOPER
                            </span>
                            <span className="game-sidebar-info-value">
                                {gameDto?.developerName?.trim() ? gameDto.developerName : "Unknown"}
                            </span>
                        </div>
                        <div className="game-sidebar-info-row">
                            <span className="game-sidebar-info-label">
                                Publisher
                            </span>
                            <span className="game-sidebar-info-value">
                                {gameDto?.developerName?.trim() ? gameDto.developerName : "Unknown"}
                            </span>
                        </div>

                    </div>

                </aside>
            </div>

            <div className="game-bottom-section">

                <section className="requirements-block">

                    <h2>Requirements</h2>

                    <div className="requirements-columns">
                        <div className="req-col">

                            <div className="req-col-title">
                                Minimum
                            </div>

                            <ul className="req-list">

                                <li className="req-item">
                                    <span className="req-item-label">
                                        OS
                                    </span>
                                    <span className="req-item-value">
                                        Windows 10 / 11
                                    </span>
                                </li>

                                <li className="req-item">
                                    <span className="req-item-label">
                                        CPU
                                    </span>
                                    <span className="req-item-value">
                                        Intel Core i5
                                    </span>
                                </li>

                                <li className="req-item">
                                    <span className="req-item-label">
                                        RAM
                                    </span>
                                    <span className="req-item-value">
                                        8 GB
                                    </span>
                                </li>

                                <li className="req-item">
                                    <span className="req-item-label">
                                        GPU
                                    </span>
                                    <span className="req-item-value">
                                        GTX 1060
                                    </span>
                                </li>

                                <li className="req-item">
                                    <span className="req-item-label">
                                        Storage
                                    </span>
                                    <span className="req-item-value">
                                        50 GB SSD
                                    </span>
                                </li>

                            </ul>

                        </div>

                        <div className="req-col">

                            <div className="req-col-title">
                                Recommended
                            </div>

                            <ul className="req-list">

                                {parsedRequirements.length > 0 ? (

                                    parsedRequirements.map((req, index) => (

                                        <li
                                            key={index}
                                            className="req-item"
                                        >
                                            <span className="req-item-label">
                                                {req.label}
                                            </span>

                                            <span className="req-item-value">
                                                {req.value}
                                            </span>
                                        </li>

                                    ))

                                ) : (

                                    <>
                                        <li className="req-item">
                                            <span className="req-item-label">
                                                OS
                                            </span>
                                            <span className="req-item-value">
                                                Windows 10 / 11
                                            </span>
                                        </li>

                                        <li className="req-item">
                                            <span className="req-item-label">
                                                CPU
                                            </span>
                                            <span className="req-item-value">
                                                Intel Core i5
                                            </span>
                                        </li>

                                        <li className="req-item">
                                            <span className="req-item-label">
                                                RAM
                                            </span>
                                            <span className="req-item-value">
                                                8 GB
                                            </span>
                                        </li>

                                        <li className="req-item">
                                            <span className="req-item-label">
                                                GPU
                                            </span>
                                            <span className="req-item-value">
                                                GTX 1060
                                            </span>
                                        </li>

                                        <li className="req-item">
                                            <span className="req-item-label">
                                                Storage
                                            </span>
                                            <span className="req-item-value">
                                                50 GB SSD
                                            </span>
                                        </li>
                                    </>

                                )}

                            </ul>

                        </div>

                    </div>

                </section>

                <section className="nexus-ratings-block">
                    <div className="nexus-ratings-title-row">
                        <h2>Player Ratings</h2>
                        <RatingBadge
                            rating={gameDto.rating}
                            totalReviews={gameDto.totalReviews}
                            recommendationPercentage={gameDto.recommendationPercentage}
                        />
                    </div>

                    <div className="tags-grid">

                        {[
                            "Great for Beginners",
                            "Highly Recommended",
                            "Immersive",
                            "Excellent Gameplay",
                            "Atmospheric",
                            "Fun with Friends",
                        ].map((tag) => (

                            <div className="rating-tag-card" key={tag}>
                                <div className="tag-sub">The game is</div>
                                <div className="tag-main">{tag}</div>
                            </div>

                        ))}

                    </div>

                </section>

            </div>
        </div>
    );
}