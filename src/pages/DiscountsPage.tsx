import { useEffect, useState } from "react";
import { gameService } from "../services/gameService";
import { tagService } from "../services/tagService";
import GameCollectionPage from "../components/Store/GameCollectionPage/GameCollectionPage";
import type { GameDto } from "../DTOs/Game/GameDto";
import type { TagDto } from "../DTOs/Tag/TagDto";

const HERO_POOL_SIZE = 30;
const RANDOM_SECTIONS_COUNT = 2;
const GAMES_PER_SECTION = 12;
const LIST_POOL_SIZE = 30;
const LIST_GAMES_COUNT = 10;

export default function DiscountsPage() {
    const [heroGames, setHeroGames] = useState<GameDto[]>([]);
    const [sections, setSections] = useState<{ title: string; games: GameDto[] }[]>([]);
    const [tagsById, setTagsById] = useState<Record<number, TagDto>>({});
    const [listGames, setListGames] = useState<GameDto[]>([]);

    useEffect(() => {
        gameService.getAll(1, HERO_POOL_SIZE, { onSaleOnly: true }, true).then((res) => {
            const shuffled = [...res.items].sort(() => Math.random() - 0.5);
            setHeroGames(shuffled.slice(0, 4));
        });
        gameService.getAll(1, LIST_POOL_SIZE, { onSaleOnly: true }, true).then((res) => {
            const shuffled = [...res.items].sort(() => Math.random() - 0.5);
            setListGames(shuffled.slice(0, LIST_GAMES_COUNT));
        });
        tagService.getAll(1, 50).then((res) => {
            const map: Record<number, TagDto> = {};
            res.items.forEach((tag) => { map[tag.id] = tag; });
            setTagsById(map);

            const shuffledTags = [...res.items].sort(() => Math.random() - 0.5);
            const chosenTags = shuffledTags.slice(0, RANDOM_SECTIONS_COUNT);

            Promise.all(
                chosenTags.map((tag) =>
                    gameService
                        .getAll(1, GAMES_PER_SECTION, { tagIds: [tag.id], onSaleOnly: true })
                        .then((gamesRes) => ({ title: `${tag.name} Games`, games: gamesRes.items }))
                )
            ).then((results) => setSections(results.filter((s) => s.games.length > 0)));
        });
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
            listGames={listGames}
            tagsById={tagsById}
        />
    );
}