export interface ProfileDto {
    userId: string;
    avatar?: string | null;
    level: number;
    xp: number;
    badges?: string | null;
    showcase?: string | null;
}
