import { useEffect, useState } from 'react';
import LibraryPageLayout from '../components/library/layout/LibraryPageLayout';
import LibrarySidebar from '../components/library/sidebar/LibrarySidebar';
import LibraryHome from '../components/library/home/LibraryHome';
import GameDetails from '../components/library/details/GameDetails';
import type { LibraryGameDto } from '../DTOs/Game/LibraryGameDto';
import { libraryService } from '../services/libraryService';

export default function LibraryPage() {
  const [games, setGames] = useState<LibraryGameDto[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  useEffect(() => {
    libraryService.getLibraryGames().then(setGames);
  }, []);

  return (
    <LibraryPageLayout
      sidebar={
        <LibrarySidebar
          games={games}
          selectedGameId={selectedGameId}
          onSelectGame={setSelectedGameId}
        />
      }
    >
      {selectedGameId !== null ? (
        <GameDetails gameId={selectedGameId} onBack={() => setSelectedGameId(null)} />
      ) : (
        <LibraryHome games={games} onSelectGame={setSelectedGameId} />
      )}
    </LibraryPageLayout>
  );
}