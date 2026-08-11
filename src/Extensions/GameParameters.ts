export interface GameFilters {
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
    tagIds?: number[];
    onSaleOnly?: boolean;
}