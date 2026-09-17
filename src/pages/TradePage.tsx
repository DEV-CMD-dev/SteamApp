import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { TradeOfferDto } from "../DTOs/TradeOffer/TradeOfferDto";
import { TradeOfferStatus } from "../DTOs/TradeOffer/TradeOfferStatus";
import { tradeService } from "../services/tradeService";
import { decodeUserIdFromToken } from "../utils/jwt";
import "../css/tradePage.css";

type TradeView = "incoming" | "incomingHistory" | "sent" | "sentHistory";

const statusLabel = (status: TradeOfferStatus) => {
    switch (status) {
        case TradeOfferStatus.Pending:
            return "Pending";
        case TradeOfferStatus.Accepted:
            return "Accepted";
        case TradeOfferStatus.Declined:
            return "Declined";
        case TradeOfferStatus.Canceled:
            return "Canceled";
        default:
            return "Unknown";
    }
};

function TradeOfferSide({ item }: { item: TradeOfferDto["senderItem"] }) {
    if (!item) {
        return <div className="trade-offer-side empty">Nothing offered</div>;
    }

    return (
        <div className="trade-offer-side">
            <img src={item.imageUrl} alt={item.name} />
            <div className="trade-offer-side-info">
                <span className="trade-offer-item-name">{item.name}</span>
                <span className="trade-offer-item-game">{item.gameTitle}</span>
            </div>
        </div>
    );
}

export default function TradePage() {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const [offers, setOffers] = useState<TradeOfferDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<TradeView>("incoming");
    const [processingId, setProcessingId] = useState<number | null>(null);

    const currentUserId = accessToken ? decodeUserIdFromToken(accessToken) : null;

    useEffect(() => {
        tradeService
            .getTradeOffers()
            .then((result) => setOffers(result.items))
            .catch((error) => {
                console.error("Failed to load trade offers", error);
                toast.error("Failed to load trade offers.");
            })
            .finally(() => setLoading(false));
    }, []);

    const incomingPending = useMemo(
        () => offers.filter((o) => o.receiverId === currentUserId && o.status === TradeOfferStatus.Pending),
        [offers, currentUserId]
    );
    const sentPending = useMemo(
        () => offers.filter((o) => o.senderId === currentUserId && o.status === TradeOfferStatus.Pending),
        [offers, currentUserId]
    );
    const incomingHistory = useMemo(
        () => offers.filter((o) => o.receiverId === currentUserId && o.status !== TradeOfferStatus.Pending),
        [offers, currentUserId]
    );
    const sentHistory = useMemo(
        () => offers.filter((o) => o.senderId === currentUserId && o.status !== TradeOfferStatus.Pending),
        [offers, currentUserId]
    );

    const visibleOffers =
        view === "incoming"
            ? incomingPending
            : view === "sent"
            ? sentPending
            : view === "incomingHistory"
            ? incomingHistory
            : sentHistory;

    const handleAccept = async (id: number) => {
        setProcessingId(id);
        try {
            await tradeService.acceptTradeOffer(id);
            const updated = await tradeService.getTradeOffers();
            setOffers(updated.items);
            toast.success("Trade offer accepted successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to accept trade offer.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleCancel = async (id: number) => {
        setProcessingId(id);
        try {
            await tradeService.cancelTradeOffer(id);
            const updated = await tradeService.getTradeOffers();
            setOffers(updated.items);
            toast.success("Trade offer updated.");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to cancel trade offer.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="trade-page">
            <header className="trade-header">
                <h1>Trade Offers</h1>
            </header>

            <div className="trade-body">
                <aside className="trade-sidebar">
                    <button type="button" className="new-trade-offer-button" onClick={() => navigate("/trade/new")}>
                        New Trade Offer...
                    </button>

                                        <nav className="trade-nav">
                        <div className="trade-nav-group">
                            <button
                                type="button"
                                className={`trade-nav-item ${view === "incoming" ? "active" : ""}`}
                                onClick={() => setView("incoming")}
                            >
                                <span>Incoming Offers</span>
                                <span className="trade-nav-count">({incomingPending.length} Pending)</span>
                            </button>
                            <button
                                type="button"
                                className={`trade-nav-subitem ${view === "incomingHistory" ? "active" : ""}`}
                                onClick={() => setView("incomingHistory")}
                            >
                                Incoming Offer History ({incomingHistory.length})
                            </button>
                        </div>

                        <div className="trade-nav-group">
                            <button
                                type="button"
                                className={`trade-nav-item ${view === "sent" ? "active" : ""}`}
                                onClick={() => setView("sent")}
                            >
                                <span>Sent Offers</span>
                                <span className="trade-nav-count">({sentPending.length} Pending)</span>
                            </button>
                            <button
                                type="button"
                                className={`trade-nav-subitem ${view === "sentHistory" ? "active" : ""}`}
                                onClick={() => setView("sentHistory")}
                            >
                                Sent Offer History ({sentHistory.length})
                            </button>
                        </div>
                    </nav>
                </aside>

                <main className="trade-list">
                    {loading && <p className="trade-loading">Loading...</p>}

                    {!loading && visibleOffers.length === 0 && (
                        <div className="trade-empty-state">
                            <strong>
                                {view === "incoming" && "You have no incoming trade offers at this time."}
                                {view === "sent" && "You have no sent trade offers at this time."}
                                {view === "incomingHistory" && "No incoming trade offer history."}
                                {view === "sentHistory" && "No sent trade offer history."}
                            </strong>
                            {view === "incoming" && (
                                <span>Friends can send you trade offers which you can accept, decline, or counter.</span>
                            )}
                        </div>
                    )}

                    {visibleOffers.map((offer) => (
                        <div key={offer.id} className="trade-offer-card">
                            <div className="trade-offer-parties">
                                <span>
                                    {offer.senderId === currentUserId ? "You" : offer.senderName}
                                    {" \u2192 "}
                                    {offer.receiverId === currentUserId ? "You" : offer.receiverName}
                                </span>
                                <span className={`trade-status-badge status-${offer.status}`}>
                                    {statusLabel(offer.status)}
                                </span>
                            </div>

                            <div className="trade-offer-items">
                                <TradeOfferSide item={offer.senderItem} />
                                <span className="trade-offer-arrow">⇄</span>
                                <TradeOfferSide item={offer.receiverItem} />
                            </div>

                            {offer.status === TradeOfferStatus.Pending && (
                                <div className="trade-offer-actions">
                                    {offer.receiverId === currentUserId && (
                                        <>
                                            <button
                                                type="button"
                                                className="accept-button"
                                                onClick={() => handleAccept(offer.id)}
                                                disabled={processingId === offer.id}
                                            >
                                                Accept
                                            </button>
                                            <button
                                                type="button"
                                                className="decline-button"
                                                onClick={() => handleCancel(offer.id)}
                                                disabled={processingId === offer.id}
                                            >
                                                Decline
                                            </button>
                                        </>
                                    )}
                                    {offer.senderId === currentUserId && (
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={() => handleCancel(offer.id)}
                                            disabled={processingId === offer.id}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}