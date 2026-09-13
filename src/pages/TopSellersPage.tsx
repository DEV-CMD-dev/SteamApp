import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GameDto } from "../DTOs/Game/GameDto";
import { gameService } from "../services/gameService";
import styles from "../css/Store/TopSellers.module.css";

const TOP_SELLERS_COUNT = 10;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function weeksSinceRelease(releaseDate: Date | string): number {
    const weeks = Math.floor((Date.now() - new Date(releaseDate).getTime()) / MS_PER_WEEK);

    return Math.max(weeks, 1);
}

function formatPrice(game: GameDto): string {
    if (game.price === 0) {
        return "Free to Play";
    }

    const finalPrice = game.discount > 0
        ? game.price * (1 - game.discount / 100)
        : game.price;

    return `$${finalPrice % 1 === 0 ? finalPrice.toFixed(0) : finalPrice.toFixed(2)}`;
}

export default function TopSellersPage() {
    const [games, setGames] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadTopSellers = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await gameService.getTopSellers(1, TOP_SELLERS_COUNT);

                setGames(result.items);
            } catch (err) {
                setError((err as Error).message || "Failed to load top sellers.");
            } finally {
                setLoading(false);
            }
        };

        loadTopSellers();
    }, []);

    return (
        <div className={styles.topSellers}>
            <h1 className={styles.title}>TOP SELLERS</h1>
            <p className={styles.subtitle}>Top 10 selling games right now by revenue</p>

            {loading && <div className={styles.message}>Loading top sellers</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
                <div className={styles.table}>
                    <div className={styles.headerRow}>
                        <span className={styles.rankHeader}>RANK</span>
                        <span className={styles.gameHeader} />
                        <span className={styles.priceHeader}>PRICE</span>
                        <span className={styles.weeksHeader}>WEEKS</span>
                    </div>

                    {games.map((game, index) => {
                        const rank = index + 1;

                        return (
                            <div
                                key={game.id}
                                className={styles.row}
                                onClick={() => navigate(`/game/${game.id}`)}>
                                <span className={styles.rank}>{rank}</span>

                                <div className={styles.gameInfo}>
                                    <div className={`${styles.imageContainer}`}>
                                        <img
                                            src={game.coverImageHorizontal}
                                            alt={game.title || "Game cover"}
                                            className={styles.coverImage} />
                                    </div>

                                    <span className={styles.gameTitle}>{game.title}</span>
                                </div>

                                <span className={styles.price}>
                                    <span className={styles.priceBadge}>{formatPrice(game)}</span>
                                </span>

                                <span className={styles.weeks}>
                                    {weeksSinceRelease(game.releaseDate).toString().padStart(3, "0")}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
