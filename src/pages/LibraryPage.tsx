import { useState } from 'react';
import LibraryPageLayout from '../components/library/layout/LibraryPageLayout';
import LibrarySidebar from '../components/library/sidebar/LibrarySidebar';
import LibraryHome from '../components/library/home/LibraryHome';
import GameDetails from '../components/library/details/GameDetails';
import { ownedGames } from '../components/library/library.mocks';

export default function LibraryPage() {
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  const selectedUserGame = ownedGames.find((ug) => ug.gameId === selectedGameId) ?? null;

  return (
    <LibraryPageLayout
      sidebar={
        <LibrarySidebar
          games={ownedGames}
          selectedGameId={selectedGameId}
          onSelectGame={setSelectedGameId}
        />
      }
    >
      {selectedUserGame ? (
        <GameDetails userGame={selectedUserGame} onBack={() => setSelectedGameId(null)} />
      ) : (
        <LibraryHome onSelectGame={setSelectedGameId} />
      )}
    </LibraryPageLayout>
  );
}