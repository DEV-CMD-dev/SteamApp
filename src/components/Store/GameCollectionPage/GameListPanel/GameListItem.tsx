import type { GameDto } from "../../../../DTOs/Game/GameDto";
import type { TagDto } from "../../../../DTOs/Tag/TagDto";
import styles from "./GameListItem.module.css";
import WindowsIcon from "../../../../assets/discounts&events-page/windowsIcon.png";
import { useNavigate } from "react-router-dom";

type GameListItemProps = {
    game: GameDto;
    tagsById: Record<number, TagDto>;
};

export default function GameListItem({ game, tagsById }: GameListItemProps) {
    const tagIds = game.tagIds as unknown as number[];
    const tagNames = tagIds
        .map((id) => tagsById[id]?.name)
        .filter((name): name is string => Boolean(name));

    const discountedPrice =
        game.discount > 0
            ? Math.round(game.price * (1 - game.discount / 100) * 100) / 100
            : game.price;

    const releaseDate = new Date(game.releaseDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const screenshots = game.screenshots ?? [];
    const hasScreenshots = screenshots.length > 0;
    const galleryMainImage = hasScreenshots ? screenshots[0].url : game.coverImageHorizontal;
    const galleryThumbUrls = hasScreenshots
        ? screenshots.slice(1, 4).map((s) => s.url)
        : [game.coverImageHorizontal, game.coverImageHorizontal, game.coverImageHorizontal];
    const navigate = useNavigate();

    return (
        <div className={styles.item}
            onClick={() => navigate(`/game/${game.id}`)}>
            <div className={styles.topRow}>
                <img className={styles.cover} src={game.coverImageVertical} alt={game.title} />

                <div className={styles.info}>
                    <p className={styles.description}>{game.description}</p>

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

                    <div className={styles.meta}>
                        <p className={styles.metaRow}>
                            RELEASE DATE: <strong>{releaseDate}</strong>
                        </p>
                        <p className={styles.metaRow}>
                            DEVELOPED BY: <strong>{game.developerName}</strong>
                        </p>
                    </div>

                    {game.totalReviews > 0 && (
                        <p className={styles.reviews}>
                            <span className={styles.reviewsLink}>{game.rating}</span> ({game.totalReviews}+ reviews)
                        </p>
                    )}
                </div>

                <div className={styles.gallery}>
                    <img className={styles.galleryMain} src={galleryMainImage} alt={game.title} />
                    <div className={styles.galleryThumbs}>
                        {galleryThumbUrls.map((url, index) => (
                            <img key={index} className={styles.galleryThumb} src={url} alt="" />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.bottomBar}>
                <img src={WindowsIcon} alt="" className={styles.icon} />

                <div className={styles.priceRow}>
                    {game.discount > 0 && <span className={styles.discountBadge}>-{game.discount}%</span>}
                    {game.discount > 0 && <span className={styles.oldPrice}>${game.price.toFixed(2)}</span>}
                    <span className={styles.newPrice}>${discountedPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}