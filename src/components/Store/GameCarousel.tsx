import { useEffect, useState } from "react";
import Game from "./Game";
import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/Store/GameCarousel.module.css";
import arrow from "../../assets/store/arrow.svg";
import { gameService } from "../../services/gameService";


export default function GameCarousel() {

    const [items, setItems] = useState<GameDto[]>([]);

    useEffect(() => {
    const fetchGames = async () => {
        try {
        const games = await gameService.getAll(1, 12, {onSaleOnly: true});
        setItems(games.items);
        } catch (err) {
        console.error(err);
        }
    };

    fetchGames();
    }, []);

    const handleScroll = (direction: "left" | "right") => {
    setItems((prevItems) => {
        const copy = [...prevItems];

        if (direction === "right") {
            copy.push(...copy.splice(0, 3));
        } else {
            copy.unshift(...copy.splice(-3));
        }

        return copy;
    });
};

    return (
        <>
            <div className={styles.carouselContainer}>
                <h3 className={styles.carouselTitle}>Discounts & Events</h3>
                <div className={styles.carouselWrapper}>
                    <button 
                        className={`${styles.scrollButton} ${styles.leftButton}`} 
                        onClick={() => handleScroll("left")}
                        aria-label="Scroll left">
                        <img className={styles.scrollButtonImageLeft} src={arrow} alt="" />
                    </button>

                    <div className={styles.carouselRow}>
                        {items.map((game, index) => (
                            <div className={styles.cardWrapper} key={`${game.id}-${index}`}>
                                <Game game={game} isVerticalCoverImage={true}/>
                            </div>
                        ))}
                    </div>

                    <button 
                        className={`${styles.scrollButton} ${styles.rightButton}`} 
                        onClick={() => handleScroll("right")}
                        aria-label="Scroll right">
                        <img className={styles.scrollButtonImageRight} src={arrow} alt="" />
                    </button>
                </div>
            </div>
        </>
    );
}