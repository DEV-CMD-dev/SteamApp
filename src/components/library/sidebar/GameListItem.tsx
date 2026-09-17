import type { LibraryGameDto } from '../../../DTOs/Game/LibraryGameDto';
import styles from '../../../css/libraryPage/sidebar/GameListItem.module.css';

interface GameListItemProps {
  game: LibraryGameDto;
  isActive: boolean;
  onSelect: (gameId: number) => void;
}

export default function GameListItem({ game, isActive, onSelect }: GameListItemProps) {
  return (
    <button
      type="button"
      className={isActive ? `${styles.item} ${styles.active}` : styles.item}
      onClick={() => onSelect(game.id)}
    >
      <img src={game.iconUrl} alt="" className={styles.icon} />
      <span className={styles.title}>{game.title}</span>
    </button>
  );
}