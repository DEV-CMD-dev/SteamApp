import type { GameDto } from "../../../DTOs/Game/GameDto";
import type { TagDto } from "../../../DTOs/Tag/TagDto";
import HeroCarousel from "./HeroCarousel/HeroCarousel";
import styles from "./GameCollectionPage.module.css";
import GameCarouselSection from "./GameCarouselSection/GameCarouselSection";
import { NavLink  } from "react-router-dom";

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
    listGames: GameDto[];
    tagsById: Record<number, TagDto>;
};


export default function GameCollectionPage({
    pageTitle,
    subNavItems,
    heroGames,
    carouselSections,
    listGames,
    tagsById,
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

            {/* GameListPanel(listGames, tagsById) сюди */}
        </div>
    );
}