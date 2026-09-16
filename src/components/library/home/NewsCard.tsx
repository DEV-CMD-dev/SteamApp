import type { NewsItem } from '../library.types';
import styles from '../../../css/libraryPage/home/NewsCard.module.css';

interface NewsCardProps {
  news: NewsItem;
}

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className={styles.card}>
      <img src={news.imageUrl} alt={news.title} className={styles.image} />
      <p className={styles.title}>{news.title}</p>
      <div className={styles.game}>
        <img src={news.gameIconUrl} alt="" className={styles.gameIcon} />
        <span>{news.gameName}</span>
      </div>
    </div>
  );
}