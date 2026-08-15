import { useEffect, useState } from "react";
import type { GameDto } from "../../DTOs/Game/GameDto";
import type { TagDto } from "../../DTOs/Tag/TagDto";
import { gameService } from "../../services/gameService";
import { tagService } from "../../services/tagService";
import GameListItem from "./GameListItem";
import styles from "../../css/Store/GameList.module.css";

interface GameListProps {
    wishlist?: boolean;
    games?: GameDto[];
}

export default function GameList({wishlist = false, games: providedGames}: GameListProps) {
    const [games, setGames] = useState<GameDto[]>([]);
    const [tags, setTags] = useState<TagDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                let gamesToDisplay: GameDto[];

                if (wishlist) {
                    gamesToDisplay = providedGames ?? [];
                } else {
                    const gamesResult = await gameService.getAll(3, 10, {minPrice: 1});

                    gamesToDisplay = gamesResult.items;
                }

                const uniqueTagIds = [
                    ...new Set(
                        gamesToDisplay.flatMap(game => game.tagIds ?? [])
                    )
                ];

                const tagsResult = await Promise.all(
                    uniqueTagIds.map(id => tagService.getById(id))
                );

                setGames(gamesToDisplay);
                setTags(tagsResult);
            } catch (err) {
                setError(
                    (err as Error).message || "Failed to load games."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [wishlist, providedGames]);

    if (loading) {
        return (
            <div className={styles.gameList}>
                <div className={styles.message}>
                    Loading games
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.gameList}>
                <div className={styles.error}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gameList}>
            <h3 className={styles.carouselTitle}>
                {wishlist ? "My Wishlist" : "Popular New Releases"}
            </h3>

            {games.map(game => (
                <GameListItem
                    key={game.id}
                    game={game}
                    tags={tags}/>
            ))}
        </div>
    );
}