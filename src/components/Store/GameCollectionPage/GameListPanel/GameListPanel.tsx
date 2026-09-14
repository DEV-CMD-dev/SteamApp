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

const PAGE_SIZE = 50; // максимум, який дозволяє бекенд (MaxPaginationPageSize)
const TOP_SELLERS_POOL_SIZE = 50;

export const MIN_RATING_OPTIONS = [
    { label: "Any", value: GameRating.None },
    { label: "Positive and above", value: GameRating.Positive },
    { label: "Very Positive and above", value: GameRating.VeryPositive },
    { label: "Overwhelmingly Positive", value: GameRating.OverwhelminglyPositive },
];

// getTopSellers не приймає фільтрів — накладаємо baseFilters/жанри/ціну вручну на фронті
function matchesManualFilters(
    game: GameDto,
    baseFilters: GameFilters,
    selectedGenreIds: number[],
    minPrice: number | undefined,
    maxPrice: number | undefined
): boolean {
    const tagIds = game.tagIds as unknown as number[];

    if (baseFilters.onSaleOnly && game.discount <= 0) return false;

    const requiredTagIds = [...(baseFilters.tagIds ?? []), ...selectedGenreIds];
    if (requiredTagIds.length > 0 && !requiredTagIds.every((id) => tagIds.includes(id))) return false;

    if (minPrice !== undefined && game.price < minPrice) return false;
    if (maxPrice !== undefined && game.price > maxPrice) return false;

    return true;
}

export default function GameListPanel({ baseFilters, tagsById }: GameListPanelProps) {
    const [activeTab, setActiveTab] = useState<ListTab>("ALL");
    const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
    const [minRating, setMinRating] = useState<number>(GameRating.None);
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
    const [fetchedGames, setFetchedGames] = useState<GameDto[]>([]);

    const toggleGenre = (tagId: number) => {
        setSelectedGenreIds((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    useEffect(() => {
        let cancelled = false;

        if (activeTab === "TOP SELLERS") {
            gameService.getTopSellers(1, TOP_SELLERS_POOL_SIZE).then((res) => {
                if (!cancelled) setFetchedGames(res.items);
            });

            return () => {
                cancelled = true;
            };
        }

        const combinedFilters: GameFilters = {
            ...baseFilters,
            tagIds: [...(baseFilters.tagIds ?? []), ...selectedGenreIds],
            minPrice,
            maxPrice,
        };

        const fetchAllPages = async () => {
            const allItems: GameDto[] = [];
            let pageNumber = 1;

            while (!cancelled) {
                const res = await gameService.getAll(pageNumber, PAGE_SIZE, combinedFilters, true);
                allItems.push(...res.items);

                if (!res.hasNextPage) break;
                pageNumber += 1;
            }

            if (cancelled) return;

            const isDefaultView =
                activeTab === "ALL" &&
                selectedGenreIds.length === 0 &&
                minPrice === undefined &&
                maxPrice === undefined;

            setFetchedGames(
                isDefaultView ? [...allItems].sort(() => Math.random() - 0.5) : allItems
            );
        };

        fetchAllPages();

        return () => {
            cancelled = true;
        };
    }, [activeTab, baseFilters, selectedGenreIds, minPrice, maxPrice]);

    const visibleGames = fetchedGames
        .filter((game) => game.rating >= minRating)
        .filter((game) =>
            activeTab === "TOP SELLERS"
                ? matchesManualFilters(game, baseFilters, selectedGenreIds, minPrice, maxPrice)
                : true
        );

    const sortedGames = [...visibleGames].sort((a, b) => {
        if (activeTab === "NEW & TRENDING") {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        }
        if (activeTab === "TOP RATED") {
            return b.rating - a.rating;
        }
        return 0; // ALL / TOP SELLERS — порядок від бекенду
    });

    const genreOptions = Object.values(tagsById);

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