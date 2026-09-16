import type { GameDto } from '../../../DTOs/Game/GameDto'; 
import styles from '../../../css/libraryPage/sidebar/GameListItem.module.css';

interface GameListItemProps {
  game: GameDto;
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
      <img src={game.coverImageVertical} alt="" className={styles.icon} />
      <span className={styles.title}>{game.title}</span>
    </button>
  );
}