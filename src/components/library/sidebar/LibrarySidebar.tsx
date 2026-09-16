import { useMemo, useState } from 'react';
import type { UserGame } from '../library.types';
import SidebarHeader from './SidebarHeader';
import type { SortOption } from './SidebarHeader';
import GameListItem from './GameListItem';
import styles from '../../../css/libraryPage/sidebar/LibrarySidebar.module.css';

interface LibrarySidebarProps {
  games: UserGame[];
  selectedGameId: number | null;
  onSelectGame: (gameId: number) => void;
}

export default function LibrarySidebar({ games, selectedGameId, onSelectGame }: LibrarySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const visibleGames = useMemo(() => {
    const filtered = games.filter((ug) =>
      ug.game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === 'alphabetical') return a.game.title.localeCompare(b.game.title);
      if (sortBy === 'playtime') return b.playTimeMinutes - a.playTimeMinutes;
      return new Date(b.lastPlayDate).getTime() - new Date(a.lastPlayDate).getTime();
    });
  }, [games, searchTerm, sortBy]);

  return (
    <aside className={styles.sidebar}>
      <SidebarHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <div className={styles.list}>
        {visibleGames.map((ug) => (
          <GameListItem
            key={ug.gameId}
            game={ug.game}
            isActive={ug.gameId === selectedGameId}
            onSelect={onSelectGame}
          />
        ))}
      </div>
    </aside>
  );
}