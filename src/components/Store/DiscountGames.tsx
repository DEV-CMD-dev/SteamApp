import { useEffect, useState } from "react";
import { gameService } from "../../services/gameService";
import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/Store/DiscountGames.module.css";
import Game from "./Game";

export default function DiscountGames(){
    const [fightGames, setfightGames] = useState<GameDto[]>([]);
    const [racingGames, setracingGames] = useState<GameDto[]>([]);
    
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const fightGames = await gameService.getAll(1, 4, {tagIds: [25], onSaleOnly: true});
                setfightGames(fightGames.items);

                const racingGames = await gameService.getAll(1, 4, {tagIds: [11], onSaleOnly: true});
                setracingGames(racingGames.items);
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
                        {fightGames.map((item, index) => (
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
                        Racing games
                    </div>
                    <div className={styles.games}>
                        {racingGames.map((item, index) => (
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