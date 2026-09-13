import { useEffect, useState } from "react";
import { gameService } from "../../../../services/gameService";
import { GameRating } from "../../../../DTOs/Game/GameDto";
import type { GameDto } from "../../../../DTOs/Game/GameDto";
import type { TagDto } from "../../../../DTOs/Tag/TagDto";
import type { GameFilters } from "../../../../Extensions/GameParameters";
import ListTabs, { type ListTab } from "./ListTabs";
import FiltersSidebar from "./FiltersSidebar";
import GameListItem from "./GameListItem";
import styles from "./GameListPanel.module.css";

type GameListPanelProps = {
    baseFilters: GameFilters;
    tagsById: Record<number, TagDto>;
};

const PAGE_SIZE = 50;

export const MIN_RATING_OPTIONS = [
    { label: "Any", value: GameRating.None },
    { label: "Positive and above", value: GameRating.Positive },
    { label: "Very Positive and above", value: GameRating.VeryPositive },
    { label: "Overwhelmingly Positive", value: GameRating.OverwhelminglyPositive },
];

export default function GameListPanel({ baseFilters, tagsById }: GameListPanelProps) {
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
    const [minRating, setMinRating] = useState<number>(GameRating.None);
    const [fetchedGames, setFetchedGames] = useState<GameDto[]>([]);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<ListTab>("ALL");

    const toggleGenre = (tagId: number) => {
        setSelectedGenreIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    useEffect(() => {
        const combinedFilters: GameFilters = {
            ...baseFilters,
            tagIds: [...(baseFilters.tagIds ?? []), ...selectedGenreIds],
            minPrice,
            maxPrice,
        };

        let cancelled = false;

        const fetchAllPages = async () => {
            const allItems: GameDto[] = [];
            let pageNumber = 1;

            while (!cancelled) {
                const res = await gameService.getAll(pageNumber, PAGE_SIZE, combinedFilters);
                allItems.push(...res.items);

                if (!res.hasNextPage) break;
                pageNumber += 1;
            }

            if (!cancelled) setFetchedGames(allItems);
        };

        fetchAllPages();

        return () => {
            cancelled = true;
        };
        // baseFilters приходить від батька як новий об'єкт на кожен рендер —
        // batьківські сторінки мають обгортати його в useMemo, інакше цей ефект зациклиться
    }, [baseFilters, selectedGenreIds, minPrice, maxPrice]);

    const visibleGames = fetchedGames.filter((game) => game.rating >= minRating);
    const genreOptions = Object.values(tagsById);

    const sortedGames = [...visibleGames].sort((a, b) => {
        if (activeTab === "NEW & TRENDING") {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }
        if (activeTab === "TOP RATED") {
            return b.rating - a.rating;
        }
        return 0; // ALL — порядок від бекенду
    });

    return (
        <div className={styles.panel}>
            <ListTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className={styles.body}>
                <FiltersSidebar
                    matchesCount={sortedGames.length}
                    genreOptions={genreOptions}
                    selectedGenreIds={selectedGenreIds}
                    onToggleGenre={toggleGenre}
                    selectedMinRating={minRating}
                    onSelectMinRating={setMinRating}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onMinPriceChange={setMinPrice}
                    onMaxPriceChange={setMaxPrice}
                />

                <div className={styles.list}>
                    {sortedGames.map((game) => (
                        <GameListItem key={game.id} game={game} tagsById={tagsById} />
                    ))}
                </div>
            </div>
        </div>
    );
}