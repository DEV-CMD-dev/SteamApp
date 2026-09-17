import type { LibraryGameVersionDto } from '../../../DTOs/GameVersion/LibraryGameVersionDto';
import NewsCard from './NewsCard';
import styles from '../../../css/libraryPage/home/WhatsNewSection.module.css';

interface WhatsNewSectionProps {
  versions: LibraryGameVersionDto[];
  onSelectGame: (gameId: number) => void;
}

export default function WhatsNewSection({ versions, onSelectGame }: WhatsNewSectionProps) {
  return (
    <section className={styles.section}>
      <h2>What's New</h2>
      <p className={styles.subtitle}>This week</p>
      <div className={styles.grid}>
        {versions.map((v) => (
          <NewsCard key={`${v.gameId}-${v.version}`} version={v} onSelect={onSelectGame} />
        ))}
      </div>
    </section>
  );
}