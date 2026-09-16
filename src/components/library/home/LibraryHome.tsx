import WhatsNewSection from './WhatsNewSection';
import RecentlyPlayedSection from './RecentlyPlayedSection';
import { ownedGames, newsItems } from '../library.mocks';

interface LibraryHomeProps {
  onSelectGame: (gameId: number) => void;
}

export default function LibraryHome({ onSelectGame }: LibraryHomeProps) {
  return (
    <>
      <WhatsNewSection news={newsItems} />
      <RecentlyPlayedSection games={ownedGames} onSelectGame={onSelectGame} />
    </>
  );
}