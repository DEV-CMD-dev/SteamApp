import type { UserGame, NewsItem } from './library.types';
import { GameRating } from '../../DTOs/Game/GameDto';
import Vertical from '../../assets/mocks/1.png';
import Horizontal from '../../assets/mocks/2.png';
import Horizontal2 from '../../assets/mocks/3.png';
import Vertical2 from '../../assets/mocks/image.png';

export const ownedGames: UserGame[] = [
  {
    gameId: 1,
    game: {
      id: 1,
      title: 'Dota 2',
      description: '',
      developerId: '',
      developerName: 'Valve',
      releaseDate: '2013-07-09',
      price: 0,
      discount: 0,
      systemRequirements: '',
      coverImageHorizontal: Horizontal,
      coverImageVertical: Vertical,
      tagIds: [],
      screenshots: [],
      totalReviews: 0,
      recommendedReviews: 0,
      recommendationPercentage: 0,
      rating: GameRating.VeryPositive,
    },
    purchasedAt: '2018-01-10T00:00:00Z',
    lastPlayDate: new Date().toISOString(),
    playTimeMinutes: 89712,
    isInstalled: true,
  },
  {
    gameId: 2,
    game: {
      id: 2,
      title: 'Cs',
      description: '',
      developerId: '',
      developerName: 'Valve',
      releaseDate: '2013-06-09',
      price: 0,
      discount: 0,
      systemRequirements: '',
      coverImageHorizontal: Horizontal2,
      coverImageVertical: Vertical2,
      tagIds: [],
      screenshots: [],
      totalReviews: 0,
      recommendedReviews: 0,
      recommendationPercentage: 0,
      rating: GameRating.VeryPositive,
    },
    purchasedAt: '2018-01-10T00:00:00Z',
    lastPlayDate: new Date().toISOString(),
    playTimeMinutes: 89712,
    isInstalled: true,
  },
  // ...решта ігор за тим самим шаблоном
];

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: '1.61 Update: Volvo FH Series 6 100 Year Edition',
    imageUrl: '/mocks/news/ets2-update.jpg',
    gameName: 'Euro Truck Simulator 2',
    gameIconUrl: '/mocks/icons/ets2.png',
  },
];