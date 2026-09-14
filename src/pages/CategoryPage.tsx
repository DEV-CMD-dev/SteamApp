import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { gameService } from "../services/gameService";
import { tagService } from "../services/tagService";
import GameCollectionPage from "../components/Store/GameCollectionPage/GameCollectionPage";
import MixedGameCarouselSection from "../components/Store/GameCollectionPage/GameCarouselSection/MixedGameCarouselSection";
import type { GameDto } from "../DTOs/Game/GameDto";
import type { TagDto } from "../DTOs/Tag/TagDto";

export default function CategoryPage() {
    const { tagId } = useParams<{ tagId: string }>();
    const [heroGames, setHeroGames] = useState<GameDto[]>([]);
    const [currentTag, setCurrentTag] = useState<TagDto | null>(null);
    const [tagsById, setTagsById] = useState<Record<number, TagDto>>({});
    const [popularDiscounted, setPopularDiscounted] = useState<GameDto[]>([]);

    const baseFilters = useMemo(
        () => (tagId ? { tagIds: [Number(tagId)] } : {}),
        [tagId]
    );

    useEffect(() => {
        if (!tagId) return;

        gameService
            .getAll(1, 4, { tagIds: [Number(tagId)] }, true)
            .then((res) => setHeroGames(res.items));

        gameService
            .getAll(1, 12, { tagIds: [Number(tagId)], onSaleOnly: true })
            .then((res) => setPopularDiscounted(res.items));

        tagService.getById(Number(tagId)).then(setCurrentTag);

        tagService.getAll(1, 50).then((res) => {
            const map: Record<number, TagDto> = {};
            res.items.forEach((tag) => { map[tag.id] = tag; });
            setTagsById(map);
        });
    }, [tagId]);

    return (
        <GameCollectionPage
            pageTitle={currentTag?.name.toUpperCase() ?? ""}
            subNavItems={Object.values(tagsById).map((tag) => ({
                label: tag.name.toUpperCase(),
                tagId: tag.id,
            }))}
            heroGames={heroGames}
            carouselSections={[]}
            baseFilters={baseFilters}
            tagsById={tagsById}
            extraContent={<MixedGameCarouselSection title="Popular Discounted" games={popularDiscounted} />}
        />
    );
}