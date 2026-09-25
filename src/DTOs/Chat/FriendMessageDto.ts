export interface FriendMessageDto {
    userId: string;
    avatar?: string | null;
    name: string;
    level: number;
    isOnline: boolean;
    lastMessage : string | null;
    unreadMessageCounter : number;
}
