import { useEffect, useState } from "react";
import { gameService } from "../../services/gameService";
import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/Store/DiscountGames.module.css"
import Game from "./Game";

export default function DiscountGames(){
    const [items, setItems] = useState<GameDto[]>([]);
    
        useEffect(() => {
        const fetchGames = async () => {
            try {
            const games = await gameService.getAll(2, 12);
            setItems(games.items);gameService
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
                        {items.slice(0, Math.ceil(items.length / 2)).map((item) => (
                            <Game
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                developerId={item.developerId}
                                releaseDate={item.releaseDate}
                                coverImage={item.coverImage}
                                price={item.price}
                                discount={item.discount}
                                systemRequirements={item.systemRequirements}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.discountsBlock}>
                    <div className={styles.title}>
                        First person shooters
                    </div>
                    <div className={styles.games}>
                        {items.slice(Math.ceil(items.length / 2)).map((item) => (
                            <Game
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                developerId={item.developerId}
                                releaseDate={item.releaseDate}
                                coverImage={item.coverImage}
                                price={item.price}
                                discount={item.discount}
                                systemRequirements={item.systemRequirements}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}