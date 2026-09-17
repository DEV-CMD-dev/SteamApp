import type { LibraryGameVersionDto } from '../../../DTOs/GameVersion/LibraryGameVersionDto';
import styles from '../../../css/libraryPage/home/NewsCard.module.css';

interface NewsCardProps {
  version: LibraryGameVersionDto;
  onSelect: (gameId: number) => void;
}

export default function NewsCard({ version, onSelect }: NewsCardProps) {
  return (
    <button type="button" className={styles.card} onClick={() => onSelect(version.gameId)}>
      <img src={version.gameImageUrl} alt={version.gameTitle} className={styles.image} />
      <p className={styles.title}>Update {version.version}</p>
      <div className={styles.game}>
        <span>{version.gameTitle}</span>
      </div>
    </button>
  );
}