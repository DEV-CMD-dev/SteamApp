import type { UserGame } from '../library.types';
import GamePosterCard from './GamePosterCard';
import styles from '../../../css/libraryPage/home/RecentlyPlayedSection.module.css';

interface RecentlyPlayedSectionProps {
  games: UserGame[];
  onSelectGame: (gameId: number) => void;
}

export default function RecentlyPlayedSection({ games, onSelectGame }: RecentlyPlayedSectionProps) {
  const sorted = [...games].sort(
    (a, b) => new Date(b.lastPlayDate).getTime() - new Date(a.lastPlayDate).getTime()
  );

  return (
    <section className={styles.section}>
      <h2>Recently Played</h2>
      <div className={styles.grid}>
        {sorted.map((ug, index) => (
          <GamePosterCard
            key={ug.gameId}
            userGame={ug}
            isFeatured={index === 0}
            onSelect={onSelectGame}
          />
        ))}
      </div>
    </section>
  );
}