export interface CreateTradeOfferDto {
    receiverId: string;
    senderInventoryItemId: number | null;
    receiverInventoryItemId: number | null;
}