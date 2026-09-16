import type { NewsItem } from '../library.types';
import NewsCard from './NewsCard';
import styles from '../../../css/libraryPage/home/WhatsNewSection.module.css';

interface WhatsNewSectionProps {
  news: NewsItem[];
}

export default function WhatsNewSection({ news }: WhatsNewSectionProps) {
  return (
    <section className={styles.section}>
      <h2>What's New</h2>
      <p className={styles.subtitle}>This week</p>
      <div className={styles.grid}>
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>
    </section>
  );
}