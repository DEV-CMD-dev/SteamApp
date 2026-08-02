import { useState } from "react";
import Game from "./Game";
import type { GameDto } from "../../DTOs/Game/GameDto";
import styles from "../../css/Game/GameCarousel.module.css";
import arrow from "../../assets/store/arrow.svg";

const mockGames: GameDto[] = [
    { id: 1, title: "Shedule I", description: "...", developerId: "dev-101", releaseDate: "2025-05-12", price: 5, discount: 30, systemRequirements: "...", coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/spotlights/8094bc326c7792c469b9783a/5492d38482a2af357bce08a0e94e1eaaae83e283/vertical_capsule_english.png?t=1784743042" },
    { id: 2, title: "Baldur's Gate", description: "...", developerId: "dev-102", releaseDate: "2024-11-20", price: 10, discount: 30, systemRequirements: "...", coverImage: "https://shared.akamai.steamstatic.com/store_item_assets/steam/spotlights/dc8a6db3a7818246648ae1ff/10cf89ebb2c3dd3515aae7376746b81eb27d7b02/vertical_capsule_english.png?t=1780508517" },
    { id: 11, title: "Project Zomboid", description: "...", developerId: "dev-111", releaseDate: "2024-07-22", price: 15, discount: 10, systemRequirements: "...", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSCjN8Ml4q4n1KG0GHjnixBqw40VUIImkPIbrALkublA&s=10" },
    { id: 4, title: "Dead by daylight 4", description: "...", developerId: "dev-104", releaseDate: "2023-08-05", price: 4, discount: 15, systemRequirements: "...", coverImage: "https://store-images.s-microsoft.com/image/apps.16719.64366672042187759.733004ed-c696-44cf-98cc-30eddf2375a8.3dd6c96e-e0c3-4a0b-aeb0-810f815a6d37" },
    { id: 5, title: "Need for speed Most Wanted 2012", description: "...", developerId: "dev-105", releaseDate: "2022-12-01", price: 5, discount: 10, systemRequirements: "...", coverImage: "https://store-images.s-microsoft.com/image/apps.17761.14069096992387554.077406c6-5eaa-418e-9391-587c0870beb5.79b26811-1ced-4993-8ca6-adf5558a9ef3" },
    { id: 6, title: "Forza Horizon 6", description: "...", developerId: "dev-106", releaseDate: "2024-03-10", price: 6, discount: 25, systemRequirements: "...", coverImage: "https://sous-buy.com.ua/uploads/games/forza-horizon-6-obschiy-oflayn-account/avatar/1776026121967_the_second_car_on_the_forza_horizon_6_leaked_cover_is_v0_st1b606w3xeg1.jpeg" },
    { id: 7, title: "Peak", description: "...", developerId: "dev-107", releaseDate: "2025-08-19", price: 7, discount: 10, systemRequirements: "...", coverImage: "https://upload.wikimedia.org/wikipedia/ru/9/9a/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_%D0%B8%D0%B3%D1%80%D1%8B_Peak.jpg" },
    { id: 10, title: "Subnautica", description: "...", developerId: "dev-110", releaseDate: "2022-10-31", price: 10, discount: 75, systemRequirements: "...", coverImage: "https://store-images.s-microsoft.com/image/apps.24838.63409341877910445.4fd452e1-c3ee-4448-a0f8-ac6eb6bdaabf.d531d87c-d1b7-497f-b802-baabfb728090" },
    { id: 12, title: "Rust", description: "...", developerId: "dev-112", releaseDate: "2025-09-05", price: 20, discount: 40, systemRequirements: "...", coverImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjd5KNOI43P4gzo90kawPEJWo5upFfm59dfz0VLZ0pHg&s=10" },
    { id: 3, title: "NBA Basketball", description: "...", developerId: "dev-103", releaseDate: "2026-01-15", price: 3, discount: 50, systemRequirements: "...", coverImage: "https://image.api.playstation.com/vulcan/ap/rnd/202406/0521/47126dbd889a804f04e5b80ea35973622b041c060c9e1249.jpg" },
    { id: 8, title: "Dota 2", description: "...", developerId: "dev-108", releaseDate: "2023-06-14", price: 0, discount: 0, systemRequirements: "...", coverImage: "https://upload.wikimedia.org/wikipedia/ru/thumb/8/8e/%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_Dota_2.jpg/330px-%D0%9E%D0%B1%D0%BB%D0%BE%D0%B6%D0%BA%D0%B0_Dota_2.jpg" },
    { id: 9, title: "CS 2", description: "...", developerId: "dev-109", releaseDate: "2026-02-28", price: 0, discount: 0, systemRequirements: "...", coverImage: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/CS2_Cover_Art.jpg/250px-CS2_Cover_Art.jpg" }
];

export default function GameCarousel() {
    const [items, setItems] = useState<GameDto[]>(mockGames);

    const handleScroll = (direction: "left" | "right") => {
    setItems((prevItems) => {
        const copy = [...prevItems];

        if (direction === "right") {
            copy.push(...copy.splice(0, 3));
        } else {
            copy.unshift(...copy.splice(-3));
        }

        return copy;
    });
};

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.carouselWrapper}>
                <button 
                    className={`${styles.scrollButton} ${styles.leftButton}`} 
                    onClick={() => handleScroll("left")}
                    aria-label="Scroll left">
                    <img className={styles.scrollButtonImageLeft} src={arrow} alt="" />
                </button>

                <div className={styles.carouselRow}>
                    {items.map((game, index) => (
                        <div className={styles.cardWrapper} key={`${game.id}-${index}`}>
                            <Game {...game} />
                        </div>
                    ))}
                </div>

                <button 
                    className={`${styles.scrollButton} ${styles.rightButton}`} 
                    onClick={() => handleScroll("right")}
                    aria-label="Scroll right">
                    <img className={styles.scrollButtonImageRight} src={arrow} alt="" />
                </button>
            </div>
        </div>
    );
}