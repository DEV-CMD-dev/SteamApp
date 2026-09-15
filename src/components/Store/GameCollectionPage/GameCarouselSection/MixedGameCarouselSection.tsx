import { useState } from "react";
import type { GameDto } from "../../../../DTOs/Game/GameDto";
import styles from "./MixedGameCarouselSection.module.css";
import { Link } from "react-router-dom";
import ArrowLeft from "../../../../assets/discounts&events-page/arrow-left.png";
import ArrowRight from "../../../../assets/discounts&events-page/arrow-right.png";

type MixedGameCarouselSectionProps = {
    title: string;
    games: GameDto[];
};

const GAMES_PER_PAGE = 5; 

function PriceTag({ game }: { game: GameDto }) {
    const discountedPrice =
        game.discount > 0
            ? Math.round(game.price * (1 - game.discount / 100) * 100) / 100
            : game.price;

    return (
        <div className={styles.priceRow}>
            {game.discount > 0 && <span className={styles.discountBadge}>-{game.discount}%</span>}
            {game.discount > 0 && <span className={styles.oldPrice}>${game.price.toFixed(2)}</span>}
            <span className={styles.newPrice}>${discountedPrice.toFixed(2)}</span>
        </div>
    );
}

export default function MixedGameCarouselSection({ title, games }: MixedGameCarouselSectionProps) {
    const [page, setPage] = useState(0);

    if (games.length === 0) return null;

    const totalPages = Math.ceil(games.length / GAMES_PER_PAGE);
    const pageGames = games.slice(page * GAMES_PER_PAGE, page * GAMES_PER_PAGE + GAMES_PER_PAGE);
    const bigGames = pageGames.slice(0, 2);
    const smallGames = pageGames.slice(2, 5);

    const goToPrev = () => setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    const goToNext = () => setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));

    return (
        <div className={styles.section}>
            <h2 className={styles.title}>{title}</h2>

            <div className={styles.row}>
                <button className={styles.arrow} onClick={goToPrev} aria-label="Previous games">
                    <img src={ArrowLeft} alt="" />
                </button>

                <div className={styles.grid}>
                    <div className={styles.bigRow}>
                        {bigGames.map((game) => (
                            <Link key={game.id} to={`/game/${game.id}`} className={styles.bigCard}>
                                <img className={styles.bigImage} src={game.coverImageHorizontal} alt={game.title} />
                                <PriceTag game={game} />
                            </Link>
                        ))}
                    </div>

                    {smallGames.length > 0 && (
                        <div className={styles.smallRow}>
                            {smallGames.map((game) => (
                                <Link key={game.id} to={`/game/${game.id}`} className={styles.smallCard}>
                                    <img className={styles.smallImage} src={game.coverImageHorizontal} alt={game.title} />
                                    <PriceTag game={game} />
                                </Link>
                            ))}
                        </div>
                    )}
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