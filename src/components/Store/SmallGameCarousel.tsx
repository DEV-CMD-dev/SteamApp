import { useEffect, useState } from "react";
import { gameService } from "../../services/gameService";
import styles from "../../css/Store/SmallGameCarousel.module.css"
import arrow from "../../assets/store/arrow.svg";
import type { GameDto } from "../../DTOs/Game/GameDto";
import Game from "./Game";

export default function SmallGameCarousel() {
    const [items, setItems] = useState<GameDto[]>([]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const games = await gameService.getAll(1, 20, {maxPrice: 5, onSaleOnly: true});
                setItems(games.items);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGames();
    }, []);

    const handleScroll = (direction: "left" | "right") => {
        setItems((prevItems) => {
            if (prevItems.length <= 5) {
                return prevItems;
            }

            const copy = [...prevItems];

            if (direction === "right") {
                copy.push(...copy.splice(0, 5));
            } else {
                copy.unshift(...copy.splice(-5));
            }

            return copy;
        });
    };

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.carouselContent}>

                <h3 className={styles.carouselTitle}>
                    Games Under 5$
                </h3>

                <button
                    className={styles.scrollButton}
                    onClick={() => handleScroll("left")}
                    aria-label="Previous">
                    <img
                        src={arrow}
                        className={styles.scrollButtonImageLeft}
                        alt=""/>
                </button>

                <div className={styles.carouselWrapper}>
                    <div className={styles.carouselRow}>
                        {items.map((item) => (
                            <div
                                className={styles.cardWrapper}
                                key={item.id}>
                                <Game 
                                    game={item}
                                    isVerticalCoverImage={false}/>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={styles.scrollButton}
                    onClick={() => handleScroll("right")}
                    aria-label="Next">
                    <img
                        src={arrow}
                        className={styles.scrollButtonImageRight}
                        alt=""/>
                </button>

            </div>
        </div>
    );
}