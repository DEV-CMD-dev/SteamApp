import { Link } from "react-router-dom";
import styles from '../../../css/libraryPage/details/GameSubNav.module.css';

const TABS = [
  { name: 'Store Page', href: '/' },
  { name: 'Downloadable Content', href: '#' },
  { name: 'Community Hub', href: '#' },
  { name: 'Guides', href: '#' },
  { name: 'Workshop', href: '#' },
  { name: 'Discussions', href: '#' },
];

export default function GameSubNav() {
  return (
    <nav className={styles.subNav}>
      {TABS.map((tab) => (
        <Link key={tab.name} to={tab.href} className={styles.tab}>
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}