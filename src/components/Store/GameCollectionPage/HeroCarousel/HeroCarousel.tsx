import { useEffect, useState } from "react";
import type { GameDto } from "../../../../DTOs/Game/GameDto";
import type { TagDto } from "../../../../DTOs/Tag/TagDto";
import styles from "./HeroCarousel.module.css";
import ArrowLeft from "../../../../assets/discounts&events-page/arrow-left.png";
import ArrowRight from "../../../../assets/discounts&events-page/arrow-right.png";
import { Link } from "react-router-dom";

type HeroCarouselProps = {
    games: GameDto[];
    tagsById: Record<number, TagDto>;
};

const SCREENSHOT_INTERVAL_MS = 2000;
const SLIDE_INTERVAL_MS = 14000;

export default function HeroCarousel({ games, tagsById }: HeroCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [screenshotIndex, setScreenshotIndex] = useState(0);
    const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());
    const [transitionEnabled, setTransitionEnabled] = useState(false);

    const activeGame = games[activeIndex];
    const screenshots = (activeGame?.screenshots ?? null)?.filter(
         (s) => !brokenUrls.has(s.url)
     ) ?? null;
 
     useEffect(() => {
         setBrokenUrls(new Set());
     }, [activeIndex]);

    useEffect(() => {
        setScreenshotIndex(0);
    }, [activeIndex]);

    useEffect(() => {
        if (!screenshots || screenshots.length <= 1) return;

        const interval = setInterval(() => {
            setTransitionEnabled(true);
            setScreenshotIndex((prev) => (prev + 1) % screenshots.length);
        }, SCREENSHOT_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [screenshots]);

    useEffect(() => {
        if (games.length <= 1) return;

        const interval = setInterval(() => {
            setTransitionEnabled(true);
            setActiveIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
        }, SLIDE_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [activeIndex, games.length]);

    if (games.length === 0) return null;

    const activeTagIds = activeGame.tagIds as unknown as number[];
    const tagNames = activeTagIds
        .map((id) => tagsById[id]?.name)
        .filter((name): name is string => Boolean(name));

    const discountedPrice =
        activeGame.discount > 0
            ? Math.round(activeGame.price * (1 - activeGame.discount / 100) * 100) / 100
            : activeGame.price;

    const releaseDate = new Date(activeGame.releaseDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const displayImageUrl =
        screenshots && screenshots.length > 0
            ? screenshots[screenshotIndex].url
            : activeGame.coverImageHorizontal;

    const goToPrev = () => {
        setTransitionEnabled(false);
        setActiveIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setTransitionEnabled(false);
        setActiveIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className={styles.carousel}>
            <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={goToPrev}
                aria-label="Previous slide"
            >
                <img src={ArrowLeft} alt="" />
            </button>

            <div className={styles.slide}>
                <Link to={`/game/${activeGame.id}`} className={styles.mainImageWrapper}>
                    <img
                        key={displayImageUrl}
                        className={`${styles.mainImage} ${transitionEnabled ? styles.fadeIn : ""}`}
                        src={displayImageUrl}
                        alt={activeGame.title}
                        onError={() => setBrokenUrls((prev) => new Set(prev).add(displayImageUrl))}
                    />
                </Link>

                <Link to={`/game/${activeGame.id}`} className={styles.infoPanel}>
                    <img
                        className={styles.infoCover}
                        src={activeGame.coverImageHorizontal}
                        alt={activeGame.title}
                    />

                    <p className={styles.description}>{activeGame.description}</p>

                    {tagNames.length > 0 && (
                        <div className={styles.tags}>
                            <span className={styles.tagsLabel}>TAGS</span>
                            <div className={styles.tagsList}>
                                {tagNames.map((name) => (
                                    <span key={name} className={styles.tag}>
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <p className={styles.releaseDate}>Release date: {releaseDate}</p>

                    {activeGame.discount > 0 && (
                        <div className={styles.priceRow}>
                            <span className={styles.discountBadge}>-{activeGame.discount}%</span>
                            <span className={styles.oldPrice}>${activeGame.price.toFixed(2)}</span>
                            <span className={styles.newPrice}>${discountedPrice.toFixed(2)}</span>
                        </div>
                    )}
                </Link>
            </div>

            <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={goToNext}
                aria-label="Next slide"
            >
                <img src={ArrowRight} alt="" />
            </button>

            <div className={styles.dots}>
                {games.map((game, index) => (
                    <button
                        key={game.id}
                        className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}