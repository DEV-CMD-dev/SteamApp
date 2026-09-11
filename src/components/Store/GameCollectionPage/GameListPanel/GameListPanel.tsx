import type { GameDto } from "../../../../DTOs/Game/GameDto";
import type { TagDto } from "../../../../DTOs/Tag/TagDto";
import ListTabs from "./ListTabs";
import FiltersSidebar from "./FiltersSidebar";
import GameListItem from "./GameListItem";
import styles from "./GameListPanel.module.css";

type GameListPanelProps = {
    games: GameDto[];
    tagsById: Record<number, TagDto>;
};

export default function GameListPanel({ games, tagsById }: GameListPanelProps) {
    return (
        <div className={styles.panel}>
            <ListTabs />

            <div className={styles.body}>
                <FiltersSidebar matchesCount={games.length} />

                <div className={styles.list}>
                    {games.map((game) => (
                        <GameListItem key={game.id} game={game} tagsById={tagsById} />
                    ))}
                </div>
            </div>
        </div>
    );
}