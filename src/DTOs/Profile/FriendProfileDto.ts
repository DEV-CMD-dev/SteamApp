export interface FriendProfileDto {
    userId: string;
    avatar?: string | null;
    name: string;
    level: number;
    isOnline: boolean;
}
