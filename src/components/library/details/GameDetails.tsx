import { useEffect, useState } from 'react';
import GameBanner from './GameBanner';
import GameActionBar from './GameActionBar';
import GameSubNav from './GameSubNav';
import type { FullLibraryGameDto } from '../../../DTOs/Game/FullLibraryGameDto';
import { libraryService } from '../../../services/libraryService';
import styles from '../../../css/libraryPage/details/GameDetails.module.css';

interface GameDetailsProps {
  gameId: number;
  onBack: () => void;
}

export default function GameDetails({ gameId, onBack }: GameDetailsProps) {
  const [game, setGame] = useState<FullLibraryGameDto | null>(null);

  useEffect(() => {
    setGame(null);
      libraryService.getLibraryGameById(gameId).then(setGame);
  }, [gameId]);

  if (!game) return null;

  return (
    <div>
      <button type="button" className={styles.backButton} onClick={onBack}>← Library</button>
      <GameBanner game={game} />
      <GameActionBar game={game} />
      <GameSubNav />
    </div>
  );
}