import { Link } from 'react-router-dom';
import { Play, Settings, Info, Heart } from 'lucide-react';
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
      <button type="button" className={styles.playButton}>
        <Play size={18} fill="currentColor" /> PLAY
      </button>

      <div className={styles.stat}>
        <span className={styles.label}>LAST PLAYED</span>
        <span>{formatLastPlayed(game.lastPlayDate)}</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.label}>PLAY TIME</span>
        <span>{(game.playTimeMinutes / 60).toFixed(1)} hours</span>
      </div>

      <div className={styles.icons}>
        <Link to="/settings" aria-label="Settings" className={styles.iconLink}>
          <Settings size={20} />
        </Link>
        <Link to={`/game/${game.id}`} aria-label="Info" className={styles.iconLink}>
          <Info size={20} />
        </Link>
        <Link to={`#`} aria-label="Favorite" className={styles.iconLink}>
          <Heart size={20} />
        </Link>
      </div>
    </div>
  );
}