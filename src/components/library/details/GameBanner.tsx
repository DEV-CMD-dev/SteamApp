import type { FullLibraryGameDto } from '../../../DTOs/Game/FullLibraryGameDto';
import styles from '../../../css/libraryPage/details/GameBanner.module.css';

interface GameBannerProps {
  game: FullLibraryGameDto;
}

export default function GameBanner({ game }: GameBannerProps) {
  return (
    <div className={styles.banner}>
      <img src={game.coverImageHorizontal} alt={game.title} className={styles.image} />
    </div>
  );
}