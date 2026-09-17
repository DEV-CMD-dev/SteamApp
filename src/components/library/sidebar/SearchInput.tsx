import { Search } from 'lucide-react';
import styles from '../../../css/libraryPage/sidebar/SearchInput.module.css';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className={styles.searchInput}>
      <input
        type="text"
        value={value}
        placeholder={placeholder ?? ''}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" aria-label="Search" className={styles.searchButton}>
        <Search size={16} />
      </button>
    </div>
  );
}