import type { TradeOfferItemDto } from "./TradeOfferItemDto";
import { TradeOfferStatus } from "./TradeOfferStatus";

export interface TradeOfferDto {
    id: number;

    senderId: string;
    senderName: string;

    receiverId: string;
    receiverName: string;

    senderInventoryItemId: number | null;
    senderItem: TradeOfferItemDto | null;

    receiverInventoryItemId: number | null;
    receiverItem: TradeOfferItemDto | null;

    status: TradeOfferStatus;
    createdAt: string;
}