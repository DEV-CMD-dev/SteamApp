import { useEffect, useState } from "react";
import { gameService } from "../../services/gameService";
import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/Store/DiscountGames.module.css";
import Game from "./Game";

export default function DiscountGames(){
    const [items, setItems] = useState<GameDto[]>([]);
    
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const games = await gameService.getAll(2, 8);
                setItems(games.items);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchGames();
    }, []); 

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.discountsBlock}>
                    <div className={styles.title}>
                        Fighting games
                    </div>
                    <div className={styles.games}>
                        {items.slice(0, Math.ceil(items.length / 2)).map((item, index) => (
                            <Game
                                key={`${item.id}-${index}`}
                                game={item}
                                isVerticalCoverImage={false}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.discountsBlock}>
                    <div className={styles.title}>
                        First person shooters
                    </div>
                    <div className={styles.games}>
                        {items.slice(Math.ceil(items.length / 2)).map((item, index) => (
                            <Game
                                key={`${item.id}-${index}`}
                                game={item}
                                isVerticalCoverImage={false}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}