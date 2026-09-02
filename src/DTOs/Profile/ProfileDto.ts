export interface ProfileDto {
    userId: string;
    avatar?: string | null;
    level: number;
    xp: number;
    badges?: string | null;
    showcase?: string | null;
    recentlyPlayedGames: RecentGameDto[];
}

export interface RecentGameDto {
    id: number;
    title: string;
    coverImageHorizontal?: string | null;
    lastPlayDate: string;
    playTimeMinutes: number;
    achievements: AchievementProgressDto[];
}

export interface AchievementProgressDto {
    id: number;
    name: string;
    iconUrl?: string | null;
    isUnlocked: boolean;
}
