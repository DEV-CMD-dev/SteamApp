import { useEffect, useState } from 'react';
import WhatsNewSection from './WhatsNewSection';
import RecentlyPlayedSection from './RecentlyPlayedSection';
import type { LibraryGameDto } from '../../../DTOs/Game/LibraryGameDto';
import type { LibraryGameVersionDto } from '../../../DTOs/GameVersion/LibraryGameVersionDto';
import { libraryService } from '../../../services/libraryService';

interface LibraryHomeProps {
  games: LibraryGameDto[];
  onSelectGame: (gameId: number) => void;
}

export default function LibraryHome({ games, onSelectGame }: LibraryHomeProps) {
  const [versions, setVersions] = useState<LibraryGameVersionDto[]>([]);

  useEffect(() => {
    libraryService.getRecentGameVersions().then(setVersions);
  }, []);

  const libraryGameIds = games.map((game) => game.id);

  return (
    <>
      <WhatsNewSection
        versions={versions}
        libraryGameIds={libraryGameIds}
        onSelectGame={onSelectGame}
      />
      <RecentlyPlayedSection games={games} onSelectGame={onSelectGame} />
    </>
  );
}