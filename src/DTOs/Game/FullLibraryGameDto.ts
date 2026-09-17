export interface FullLibraryGameDto {
  id: number;
  title: string;
  developerId: string;
  releaseDate: string;
  coverImageVertical: string;
  coverImageHorizontal: string;
  iconUrl: string;
  purchasedAt: string;
  lastPlayDate: string;
  playTimeMinutes: number;
  isInstalled: boolean;
}