import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/Store/Game.module.css";

export default function Game({ game, isVerticalCoverImage }: { game: GameDto; isVerticalCoverImage: boolean }) {
    const hasDiscount = game.discount > 0;
    const finalPrice = hasDiscount 
        ? (game.price * (1 - game.discount / 100)).toFixed(2) 
        : game.price.toFixed(2);

    return (
        <div className={styles.gameCard}>
            <div className={styles.imageContainer}>
                <img src={isVerticalCoverImage ? game.coverImageVertical : game.coverImageHorizontal} alt={game.title || "Game cover"} className={styles.coverImage} />
            </div>
            
            <div className={styles.purchaseSection}>
                {hasDiscount && (
                    <span className={styles.discountBadge}>-{game.discount}%</span>
                )}
                <div className={styles.pricing}>
                    {hasDiscount && (
                        <span className={styles.originalPrice}>{game.price.toFixed(2)} $</span>
                    )}
                    <span className={styles.finalPrice}>{finalPrice} $</span>
                </div>
            </div>
        </div>
    );
}