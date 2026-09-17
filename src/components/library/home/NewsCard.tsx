import type { LibraryGameVersionDto } from "../../../DTOs/GameVersion/LibraryGameVersionDto";

import styles from "../../../css/libraryPage/home/NewsCard.module.css";

interface NewsCardProps {
    version: LibraryGameVersionDto;
    onSelect: (gameId: number) => void;
}

export default function NewsCard({
    version,
    onSelect,
}: NewsCardProps) {
    return (
        <button
            type="button"
            className={styles.card}
            onClick={() => onSelect(version.gameId)}
        >
            <div className={styles.imageContainer}>
                <img
                    src={version.gameImageUrl}
                    alt={version.gameTitle}
                    className={styles.image}
                />
            </div>

            <div className={styles.content}>
                <p className={styles.title}>
                    {version.version} Update
                </p>

                <div className={styles.game}>
                    <span className={styles.gameIcon}>
                        <img
                            src={version.gameImageUrl}
                            alt=""
                        />
                    </span>

                    <span className={styles.gameTitle}>
                        {version.gameTitle}
                    </span>
                </div>
            </div>
        </button>
    );
}