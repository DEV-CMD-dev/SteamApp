export interface LibraryGameVersionDto {
  gameId: number;
  gameTitle: string;
  gameImageUrl: string;
  version: string;
  patchNotes?: string | null;
  createdAt: string;
}