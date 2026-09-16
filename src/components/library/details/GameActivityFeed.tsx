import type { NewsItem } from '../library.types';
import NewsCard from '../home/NewsCard';
import styles from '../../../css/libraryPage/details/GameActivityFeed.module.css';

interface GameActivityFeedProps {
  news: NewsItem[];
  date: string;
}

export default function GameActivityFeed({ news, date }: GameActivityFeedProps) {
  return (
    <section className={styles.feed}>
      <h3>News {date}</h3>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} />
      ))}
    </section>
  );
}