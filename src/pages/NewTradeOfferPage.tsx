import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import type { InventoryItemDto } from "../DTOs/InventoryItem/InventoryItemDto";
import type { ProfileSearchResultDto } from "../DTOs/Profile/ProfileSearchResultDto";
import { inventoryService } from "../services/inventoryService";
import { profileService } from "../services/profileService";
import { tradeService } from "../services/tradeService";
import { decodeUserIdFromToken } from "../utils/jwt";
import "../css/newTradeOfferPage.css";

function ItemPicker({
    items,
    selectedId,
    onSelect,
    emptyLabel,
}: {
    items: InventoryItemDto[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    emptyLabel: string;
}) {
    const tradableItems = items.filter((invItem) => invItem.item.isTradable);

    return (
        <div className="item-picker">
            {tradableItems.length === 0 && <p className="item-picker-empty">{emptyLabel}</p>}
            <div className="item-picker-grid">
                {tradableItems.map((invItem) => (
                    <div
                        key={invItem.id}
                        className={`item-picker-cell ${invItem.id === selectedId ? "selected" : ""}`}
                        onClick={() => onSelect(invItem.id === selectedId ? null : invItem.id)}
                        title={invItem.item.name}
                    >
                        <img src={invItem.item.imageUrl} alt={invItem.item.name} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function NewTradeOfferPage() {
    const { accessToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const currentUserId = accessToken ? decodeUserIdFromToken(accessToken) : null;
    const preselectedSenderItemId = searchParams.get("senderInventoryItemId");

    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ProfileSearchResultDto[]>([]);
    const [receiver, setReceiver] = useState<ProfileSearchResultDto | null>(null);

    const [myInventory, setMyInventory] = useState<InventoryItemDto[]>([]);
    const [theirInventory, setTheirInventory] = useState<InventoryItemDto[]>([]);
    const [loadingTheirInventory, setLoadingTheirInventory] = useState(false);

    const [mySelectedId, setMySelectedId] = useState<number | null>(
        preselectedSenderItemId ? Number(preselectedSenderItemId) : null
    );
    const [theirSelectedId, setTheirSelectedId] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        inventoryService
            .getMyInventory()
            .then((result) => setMyInventory(result.items))
            .catch((error) => {
                console.error("Failed to load your inventory", error);
                toast.error("Failed to load your inventory.");
            });
    }, []);

    useEffect(() => {
        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timeout = setTimeout(() => {
            profileService
                .search(query.trim())
                .then((results) => setSearchResults(results.filter((r) => r.userId !== currentUserId)))
                .catch((error) => console.error("Failed to search users", error));
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, currentUserId]);

    const handleSelectReceiver = (profile: ProfileSearchResultDto) => {
        setReceiver(profile);
        setSearchResults([]);
        setQuery(profile.userName);
        setTheirSelectedId(null);
        setLoadingTheirInventory(true);

        inventoryService
            .getUserInventory(profile.userId)
            .then((result) => setTheirInventory(result.items))
            .catch((error) => {
                console.error("Failed to load user's inventory", error);
                toast.error("Failed to load user's inventory.");
            })
            .finally(() => setLoadingTheirInventory(false));
    };

    const handleSubmit = async () => {
        if (!receiver) {
            toast.error("Select a user to trade with.");
            return;
        }

        if (mySelectedId === null && theirSelectedId === null) {
            toast.error("You must offer an item or ask for an item.");
            return;
        }

        setSubmitting(true);
        try {
            await tradeService.createTradeOffer({
                receiverId: receiver.userId,
                senderInventoryItemId: mySelectedId,
                receiverInventoryItemId: theirSelectedId,
            });
            toast.success("Trade offer created successfully!");
            navigate("/trade");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create trade offer.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="new-trade-offer-page">
            <header className="new-trade-offer-header">
                <h1>New Trade Offer</h1>
            </header>

            <div className="receiver-search">
                <label>Trade with:</label>
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (receiver) setReceiver(null);
                    }}
                />
                {searchResults.length > 0 && (
                    <div className="receiver-search-results">
                        {searchResults.map((profile) => (
                            <div
                                key={profile.userId}
                                className="receiver-search-result"
                                onClick={() => handleSelectReceiver(profile)}
                            >
                                {profile.avatar && <img src={profile.avatar} alt="" />}
                                <span>{profile.userName}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {receiver && (
                <div className="trade-offer-builder">
                    <div className="trade-offer-column">
                        <h3>Your items</h3>
                        <ItemPicker
                            items={myInventory}
                            selectedId={mySelectedId}
                            onSelect={setMySelectedId}
                            emptyLabel="You have no tradable items."
                        />
                    </div>

                    <div className="trade-offer-column">
                        <h3>{receiver.userName}'s items</h3>
                        {loadingTheirInventory ? (
                            <p className="item-picker-empty">Loading...</p>
                        ) : (
                            <ItemPicker
                                items={theirInventory}
                                selectedId={theirSelectedId}
                                onSelect={setTheirSelectedId}
                                emptyLabel="This user has no tradable items."
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="new-trade-offer-actions">
                <button type="button" onClick={() => navigate("/trade")}>
                    Cancel
                </button>
                <button type="button" className="primary" onClick={handleSubmit} disabled={submitting || !receiver}>
                    {submitting ? "Sending..." : "Send Trade Offer"}
                </button>
            </div>
        </div>
    );
}