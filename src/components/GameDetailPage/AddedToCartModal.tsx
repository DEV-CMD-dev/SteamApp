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
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                <div className={styles.header}>
                    <span className={styles.title}>Added to Cart!</span>
                    <button className={styles.closeBtn} onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className={styles.body}>
                    <img
                        src={game.coverImageHorizontal}
                        alt={game.title || "Game cover"}
                        className={styles.thumbnail}
                    />

                    <div className={styles.info}>
                        <div className={styles.gameTitle}>
                            {game.title}
                        </div>

                        <div className={styles.pricing}>
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
                </div>

                <div className={styles.footer}>
                    <button className={styles.secondaryBtn} onClick={onClose}>
                        Continue Shopping
                    </button>
                    <button className={styles.primaryBtn} onClick={onGoToCart}>
                        Go to Cart
                    </button>
                </div>

            </div>
        </div>
    );
}