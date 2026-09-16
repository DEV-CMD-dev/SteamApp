import type { GameDto } from '../../../DTOs/Game/GameDto';
import styles from '../../../css/libraryPage/details/GameBanner.module.css';

interface GameBannerProps {
  game: GameDto;
}

export default function GameBanner({ game }: GameBannerProps) {
  return (
    <div className={styles.banner}>
      <img src={game.coverImageHorizontal} alt={game.title} className={styles.image} />
    </div>
  );
}