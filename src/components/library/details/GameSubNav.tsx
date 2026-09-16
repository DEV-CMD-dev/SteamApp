import styles from '../../../css/libraryPage/details/GameSubNav.module.css';

const TABS = ['Store Page', 'Downloadable Content', 'Community Hub', 'Guides', 'Workshop', 'Discussions'];

export default function GameSubNav() {
  return (
    <nav className={styles.subNav}>
      {TABS.map((tab) => (
        <button type="button" key={tab} className={styles.tab}>{tab}</button>
      ))}
    </nav>
  );
}