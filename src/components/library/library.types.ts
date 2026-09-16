import type { GameDto } from '../../DTOs/Game/GameDto'; 

export interface UserGame {
  gameId: number;
  game: GameDto;
  purchasedAt: string;
  lastPlayDate: string;
  playTimeMinutes: number;
  isInstalled: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  imageUrl: string;
  gameName: string;
  gameIconUrl: string;
}