import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/AddedToCartModal.module.css";

type AddedToCartModalProps = {
    game: GameDto;
    isOpen: boolean;
    onClose: () => void;
    onGoToCart: () => void;
};

export default function AddedToCartModal({ game, isOpen, onClose, onGoToCart }: AddedToCartModalProps) {

    if (!isOpen) {
        return null;
    }

    const price = typeof game.price === "number" ? game.price : 0;
    const discount = typeof game.discount === "number" ? game.discount : 0;
    const hasDiscount = discount > 0;

    const finalPrice = hasDiscount
        ? (price * (1 - discount / 100)).toFixed(2)
        : price.toFixed(2);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.ticket} onClick={(e) => e.stopPropagation()}>

                <div className={styles.artZone}>
                    <img
                        src={game.coverImageHorizontal}
                        alt={game.title || "Game cover"}
                        className={styles.art}
                    />
                    <div className={styles.artGradient} />

                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>

                    <div className={styles.stamp}>
                        Added
                    </div>

                    <div className={styles.gameTitle}>
                        {game.title}
                    </div>
                </div>

                <div className={styles.perforation}/>

                <div className={styles.actionZone}>

                    <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>Total</span>
                        <div className={styles.priceRow}>
                            {hasDiscount && (
                                <span className={styles.discountBadge}>
                                    -{discount}%
                                </span>
                            )}
                            {hasDiscount && (
                                <span className={styles.originalPrice}>
                                    {price.toFixed(2)}$
                                </span>
                            )}
                            <span className={styles.finalPrice}>
                                {finalPrice}$
                            </span>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button className={styles.secondaryBtn} onClick={onClose}>
                            Keep Browsing
                        </button>
                        <button className={styles.primaryBtn} onClick={onGoToCart}>
                            View Cart →
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}