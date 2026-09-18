import SearchInput from './SearchInput';
import styles from '../../../css/libraryPage/sidebar/SidebarHeader.module.css';

export type SortOption = 'recent' | 'alphabetical' | 'playtime';

interface SidebarHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export default function SidebarHeader({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}: SidebarHeaderProps) {
  return (
    <div className={styles.sidebarHeader}>
      <SearchInput value={searchTerm} onChange={onSearchChange} />
      <div className={styles.sortRow}>
        <span>SORT BY:</span>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value as SortOption)}>
          <option value="recent">Recent</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="playtime">Playtime</option>
        </select>
      </div>
    </div>
  );
}