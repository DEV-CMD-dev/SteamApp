import { useEffect, useState } from 'react';
import GameBanner from './GameBanner';
import GameActionBar from './GameActionBar';
import GameSubNav from './GameSubNav';
import GameActivityFeed from './GameActivityFeed';
import type { FullLibraryGameDto } from '../../../DTOs/Game/FullLibraryGameDto';
import type { LibraryGameVersionDto } from '../../../DTOs/GameVersion/LibraryGameVersionDto';
import type { FriendProfileDto } from '../../../DTOs/Profile/FriendProfileDto';
import { libraryService } from '../../../services/libraryService';
import { profileService } from '../../../services/profileService';
import styles from '../../../css/libraryPage/details/GameDetails.module.css';

interface GameDetailsProps {
  gameId: number;
  onBack: () => void;
}

export default function GameDetails({ gameId, onBack }: GameDetailsProps) {
  const [game, setGame] = useState<FullLibraryGameDto | null>(null);
  const [versions, setVersions] = useState<LibraryGameVersionDto[]>([]);
  const [friends, setFriends] = useState<FriendProfileDto[]>([]);

  useEffect(() => {
    setGame(null);
    setVersions([]);
    setFriends([]);

    libraryService.getLibraryGameById(gameId).then(setGame);
    libraryService.getGameVersions(gameId).then(setVersions).catch(console.error);

    profileService
      .GetFriends()
      .then((data) => setFriends(data.items))
      .catch(console.error);
  }, [gameId]);

  if (!game) return null;

  return (
    <div>
      <button type="button" className={styles.backButton} onClick={onBack}>Back to Library</button>
      <GameBanner game={game} />
      <GameActionBar game={game} />
      <GameSubNav />
      <GameActivityFeed versions={versions} friends={friends} />
    </div>
  );
}