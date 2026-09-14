import type { GameDto } from "../../../DTOs/Game/GameDto";
import type { TagDto } from "../../../DTOs/Tag/TagDto";
import HeroCarousel from "./HeroCarousel/HeroCarousel";
import styles from "./GameCollectionPage.module.css";
import GameCarouselSection from "./GameCarouselSection/GameCarouselSection";
import { NavLink  } from "react-router-dom";
import GameListPanel from "./GameListPanel/GameListPanel";
import type { ReactNode } from "react";
import type { GameFilters } from "../../../Extensions/GameParameters";

type CarouselSection = {
    title: string;
    games: GameDto[];
};

type SubNavItem = {
    label: string;
    tagId: number;
};
type GameCollectionPageProps = {
    pageTitle: string;
    subNavItems: SubNavItem[];
    heroGames: GameDto[];
    carouselSections: CarouselSection[];
    baseFilters: GameFilters;
    tagsById: Record<number, TagDto>;
    extraContent?: ReactNode;
};


export default function GameCollectionPage({
    pageTitle,
    subNavItems,
    heroGames,
    carouselSections,
    baseFilters,
    tagsById,
    extraContent
}: GameCollectionPageProps) {
    return (
        <div className={styles.page}>
            <h1 className={styles.title}>{pageTitle}</h1>

            <HeroCarousel games={heroGames} tagsById={tagsById} />

            <nav className={styles.subNav}>
                {subNavItems.map((item) => (
                    <NavLink
                        key={item.tagId}
                        to={`/category/${item.tagId}`}
                        className={({ isActive }) =>
                            `${styles.subNavItem} ${isActive ? styles.subNavItemActive : ""}`
                        }
                    >
                         {item.label}
                    </NavLink>
                ))}
            </nav>

            {carouselSections.map((section) => (
                <div key={section.title} className={styles.section}>
                    <GameCarouselSection
                    key={section.title}
                    title={section.title}
                    games={section.games}
                />
                </div>
            ))}
                {extraContent}
            <GameListPanel baseFilters={baseFilters} tagsById={tagsById} />
        </div>
    );
}