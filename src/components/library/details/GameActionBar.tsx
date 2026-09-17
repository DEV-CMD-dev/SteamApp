import type { FullLibraryGameDto } from '../../../DTOs/Game/FullLibraryGameDto';
import styles from '../../../css/libraryPage/details/GameActionBar.module.css';

interface GameActionBarProps {
  game: FullLibraryGameDto;
}

function formatLastPlayed(dateIso: string) {
  const date = new Date(dateIso);
  return date.toDateString() === new Date().toDateString() ? 'Today' : date.toLocaleDateString();
}

export default function GameActionBar({ game }: GameActionBarProps) {
  return (
    <div className={styles.actionBar}>
      <button type="button" className={styles.playButton}>▶ PLAY</button>
      <div className={styles.stat}>
        <span className={styles.label}>LAST PLAYED</span>
        <span>{formatLastPlayed(game.lastPlayDate)}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>PLAY TIME</span>
        <span>{(game.playTimeMinutes / 60).toFixed(1)} hours</span>
      </div>
      <div className={styles.icons}>
        <button type="button" aria-label="Settings">⚙</button>
        <button type="button" aria-label="Info">ⓘ</button>
        <button type="button" aria-label="Favorite">♡</button>
      </div>
    </div>
  );
}