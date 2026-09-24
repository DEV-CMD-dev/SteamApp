export interface MessageDto {
    id: number;
    senderId: string;
    receiverId: string;
    text: string;
    createdAt: string;
    isRead: boolean;
}