export interface ItemDto {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    gameId: number;
    gameTitle: string;
    gameIconUrl?: string | null;
    isTradable: boolean;
}