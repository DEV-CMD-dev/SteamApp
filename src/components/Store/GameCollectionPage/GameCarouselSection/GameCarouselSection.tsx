import { useState } from "react";
import type { GameDto } from "../../../../DTOs/Game/GameDto";
import styles from "./GameCarouselSection.module.css";
import ArrowLeft from "../../../../assets/discounts&events-page/arrow-left.png";
import ArrowRight from "../../../../assets/discounts&events-page/arrow-right.png";
import { Link } from "react-router-dom";

type GameCarouselSectionProps = {
    title: string;
    games: GameDto[];
};

const GAMES_PER_PAGE = 3;

export default function GameCarouselSection({ title, games }: GameCarouselSectionProps) {
    const [page, setPage] = useState(0);

    if (games.length === 0) return null;

    const totalPages = Math.ceil(games.length / GAMES_PER_PAGE);
    const visibleGames = games.slice(page * GAMES_PER_PAGE, page * GAMES_PER_PAGE + GAMES_PER_PAGE);

    const goToPrev = () => {
        setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const goToNext = () => {
        setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.row}>
                <button className={styles.arrow} onClick={goToPrev} aria-label="Previous games">
                    <img src={ArrowLeft} alt="" />
                </button>

                <div className={styles.cards}>
                    {visibleGames.map((game) => {
                        const discountedPrice =
                            game.discount > 0
                                ? Math.round(game.price * (1 - game.discount / 100) * 100) / 100
                                : game.price;

                        return (
                            <Link key={game.id} to={`/game/${game.id}`} className={styles.card}>
                                <img
                                    className={styles.cardImage}
                                    src={game.coverImageHorizontal}
                                    alt={game.title}
                                />
                                {game.discount > 0 ? (
                                    <div className={styles.priceRow}>
                                        <span className={styles.discountBadge}>-{game.discount}%</span>
                                        <span className={styles.oldPrice}>${game.price.toFixed(2)}</span>
                                        <span className={styles.newPrice}>${discountedPrice.toFixed(2)}</span>
                                    </div>
                                ) : (
                                    <div className={styles.priceRow}>
                                        <span className={styles.newPrice}>${game.price.toFixed(2)}</span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <button className={styles.arrow} onClick={goToNext} aria-label="Next games">
                    <img src={ArrowRight} alt="" />
                </button>
            </div>

            <div className={styles.dots}>
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === page ? styles.dotActive : ""}`}
                        onClick={() => setPage(index)}
                        aria-label={`Go to page ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}