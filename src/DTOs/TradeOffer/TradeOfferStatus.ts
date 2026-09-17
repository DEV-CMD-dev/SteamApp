export const TradeOfferStatus = {
    Pending: 0,
    Accepted: 1,
    Declined: 2,
    Canceled: 3,
} as const;

export type TradeOfferStatus = (typeof TradeOfferStatus)[keyof typeof TradeOfferStatus];