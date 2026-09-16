import GameBanner from './GameBanner';
import GameActionBar from './GameActionBar';
import GameSubNav from './GameSubNav';
import GameActivityFeed from './GameActivityFeed';
import type { UserGame } from '../library.types';
import { newsItems } from '../library.mocks';
import styles from '../../../css/libraryPage/details/GameDetails.module.css';

interface GameDetailsProps {
  userGame: UserGame;
  onBack: () => void;
}

export default function GameDetails({ userGame, onBack }: GameDetailsProps) {
  const gameNews = newsItems.filter((n) => n.gameName === userGame.game.title);

  return (
    <div>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Library
      </button>
      <GameBanner game={userGame.game} />
      <GameActionBar userGame={userGame} />
      <GameSubNav />
      <GameActivityFeed news={gameNews} date="August 15" />
    </div>
  );
}