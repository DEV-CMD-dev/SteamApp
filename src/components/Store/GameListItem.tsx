import type { GameDto } from "../../DTOs/Game/GameDto";
import type { TagDto } from "../../DTOs/Tag/TagDto";
import styles from "../../css/Store/GameListItem.module.css";

export default function GameListItem({game,tags}: {game: GameDto; tags: TagDto[]}) {
    const hasDiscount = game.discount > 0;

    const finalPrice = hasDiscount
        ? (game.price * (1 - game.discount / 100)).toFixed(2)
        : game.price.toFixed(2);

    const gameTags = game.tagIds
        ?.map(id => tags.find(tag => tag.id === id)?.name)
        .filter(Boolean)
        .join(", ");

    return (
        <div className={styles.gameItem}>
            <div className={styles.imageContainer}>
                <img
                    src={game.coverImageHorizontal}
                    alt={game.title || "Game cover"}
                    className={styles.coverImage}/>
            </div>

            <div className={styles.gameInfo}>
                <div className={styles.title}>
                    {game.title}
                </div>

                <div className={styles.tags}>
                    {gameTags || "No tags"}
                </div>

                <div className={styles.releaseDate}>
                    Released:{" "}
                    {game.releaseDate
                        ? new Date(game.releaseDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        })
                        : "Unknown"}
                </div>
            </div>

            <div className={styles.purchaseSection}>
                {hasDiscount && (
                    <span className={styles.discountBadge}>
                        -{game.discount}%
                    </span>
                )}

                <div className={styles.pricing}>
                    {hasDiscount && (
                        <span className={styles.originalPrice}>
                            {game.price.toFixed(2)}$
                        </span>
                    )}

                    <span className={styles.finalPrice}>
                        {finalPrice}$
                    </span>
                </div>
            </div>
        </div>
    );
}