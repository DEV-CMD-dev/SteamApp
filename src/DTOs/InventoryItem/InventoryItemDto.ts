import type { ItemDto } from "../Item/ItemDto";

export interface InventoryItemDto {
    id: number;
    userId: string;
    itemId: number;
    acquiredAt: string;
    quantity: number;
    item: ItemDto;
}