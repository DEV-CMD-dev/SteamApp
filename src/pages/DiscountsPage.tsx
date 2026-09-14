import { useEffect, useState, useMemo } from "react";
import { gameService } from "../services/gameService";
import { tagService } from "../services/tagService";
import GameCollectionPage from "../components/Store/GameCollectionPage/GameCollectionPage";
import type { GameDto } from "../DTOs/Game/GameDto";
import type { TagDto } from "../DTOs/Tag/TagDto";

const HERO_POOL_SIZE = 30;
const RANDOM_SECTIONS_COUNT = 2;
const GAMES_PER_SECTION = 12;

export default function DiscountsPage() {
    const [heroGames, setHeroGames] = useState<GameDto[]>([]);
    const [sections, setSections] = useState<{ title: string; games: GameDto[] }[]>([]);
    const [tagsById, setTagsById] = useState<Record<number, TagDto>>({});

    const baseFilters = useMemo(() => ({ onSaleOnly: true }), []);

    useEffect(() => {
        let cancelled = false;

        gameService.getAll(1, HERO_POOL_SIZE, { onSaleOnly: true }, true).then((res) => {
            if (cancelled) return;
            const shuffled = [...res.items].sort(() => Math.random() - 0.5);
            setHeroGames(shuffled.slice(0, 4));
        });
        tagService.getAll(1, 50).then((res) => {
            const map: Record<number, TagDto> = {};
            res.items.forEach((tag) => { map[tag.id] = tag; });
            setTagsById(map);

            const shuffledTags = [...res.items].sort(() => Math.random() - 0.5);
            const collectSections = async () => {
                const found: { title: string; games: GameDto[] }[] = [];

                for (const tag of shuffledTags) {
                    if (found.length >= RANDOM_SECTIONS_COUNT) break;
                    if (cancelled) return;

                    const gamesRes = await gameService.getAll(1, GAMES_PER_SECTION, {
                        tagIds: [tag.id],
                        onSaleOnly: true,
                    });

                    if (gamesRes.items.length > 0) {
                        found.push({ title: `${tag.name} Games`, games: gamesRes.items });
                    }
                }

                if (!cancelled) setSections(found);
            };

            collectSections();
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <GameCollectionPage
            pageTitle="Discounts & Events"
            subNavItems={Object.values(tagsById).map((tag) => ({
                label: tag.name.toUpperCase(),
                tagId: tag.id,
            }))}
            heroGames={heroGames}
            carouselSections={sections}
            baseFilters={baseFilters}
            tagsById={tagsById}
        />
    );
}