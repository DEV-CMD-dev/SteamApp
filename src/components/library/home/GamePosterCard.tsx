import type { LibraryGameDto } from '../../../DTOs/Game/LibraryGameDto';
import styles from '../../../css/libraryPage/home/GamePosterCard.module.css';

interface GamePosterCardProps {
  game: LibraryGameDto;
  isFeatured?: boolean;
  onSelect: (gameId: number) => void;
}

export default function GamePosterCard({ game, isFeatured, onSelect }: GamePosterCardProps) {
  const totalHours = (game.playTimeMinutes / 60).toFixed(1);

  return (
    <button type="button" className={styles.card} onClick={() => onSelect(game.id)}>
      <img src={game.coverImageVertical} alt={game.title} className={styles.cover} />
      {isFeatured && (
        <div className={styles.overlay}>
          <span className={styles.playButton} aria-hidden>▶</span>
          <div className={styles.playInfo}>
            <span className={styles.label}>PLAYED TIME</span>
            <span>Total: {totalHours} hours</span>
          </div>
        </div>
      )}
    </button>
  );
}