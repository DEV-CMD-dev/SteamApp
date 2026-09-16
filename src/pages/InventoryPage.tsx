import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { InventoryItemDto } from "../DTOs/InventoryItem/InventoryItemDto";
import { inventoryService } from "../services/inventoryService";
import "../css/inventoryPage.css";

const GRID_SIZE = 25;

type GameGroup = {
    gameId: number;
    gameTitle: string;
    gameIconUrl?: string | null;
    items: InventoryItemDto[];
};

export default function InventoryPage() {
    const { username } = useContext(AuthContext);
    const navigate = useNavigate();

    const [inventory, setInventory] = useState<InventoryItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeGameId, setActiveGameId] = useState<number | null>(null);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selling, setSelling] = useState(false);

    useEffect(() => {
        inventoryService
            .getMyInventory()
            .then((result) => setInventory(result.items))
            .catch((error) => {
                console.error("Failed to load inventory", error);
                toast.error("Failed to load inventory.");
            })
            .finally(() => setLoading(false));
    }, []);

    const games: GameGroup[] = [];
    inventory.forEach((invItem) => {
        const group = games.find((g) => g.gameId === invItem.item.gameId);
        if (group) {
            group.items.push(invItem);
        } else {
            games.push({
                gameId: invItem.item.gameId,
                gameTitle: invItem.item.gameTitle,
                gameIconUrl: invItem.item.gameIconUrl,
                items: [invItem],
            });
        }
    });

    useEffect(() => {
        if (activeGameId === null && games.length > 0) {
            setActiveGameId(games[0].gameId);
        }
    }, [games, activeGameId]);

    const activeGame = games.find((g) => g.gameId === activeGameId) ?? null;

    const visibleItems = (activeGame?.items ?? []).filter((invItem) =>
        invItem.item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const cells = Array.from({ length: GRID_SIZE }, (_, index) => visibleItems[index] ?? null);

    const selectedItem = visibleItems.find((invItem) => invItem.id === selectedItemId) ?? null;

    const handleSelectGame = (gameId: number) => {
        setActiveGameId(gameId);
        setSelectedItemId(null);
        setSearchQuery("");
    };

    const handleSell = async () => {
        if (!selectedItem) return;

        setSelling(true);
        try {
            await inventoryService.sellItem(selectedItem.id);
            setInventory((prev) => prev.filter((invItem) => invItem.id !== selectedItem.id));
            setSelectedItemId(null);
            toast.success("Item sold successfully!");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to sell item.");
        } finally {
            setSelling(false);
        }
    };

    return (
        <div className="inventory-page">
            <header className="inventory-header">
                <div className="inventory-title">
                    <h1>{username}</h1>
                    <span>Item Inventory</span>
                </div>

                <div className="inventory-actions">
                    <button type="button" className="trade-offers-button" onClick={() => navigate("/trade")}>
                        Trade Offers
                    </button>
                </div>
            </header>

            <nav className="game-tabs">
                {loading && <span className="inventory-loading">Loading...</span>}
                {!loading && games.length === 0 && (
                    <span className="inventory-empty">No items in your inventory yet.</span>
                )}
                {games.map((game) => (
                    <button
                        key={game.gameId}
                        type="button"
                        className={`game-tab ${game.gameId === activeGameId ? "active" : ""}`}
                        onClick={() => handleSelectGame(game.gameId)}
                    >
                        {game.gameIconUrl && <img src={game.gameIconUrl} alt="" className="game-tab-icon" />}
                        <span>{game.gameTitle} ({game.items.length})</span>
                    </button>
                ))}
            </nav>

            {activeGame && (
                <div className="inventory-panel">
                    <div className="inventory-panel-header">
                        <img
                            src={activeGame.gameIconUrl ?? ""}
                            alt=""
                            className="inventory-panel-icon"
                            style={{ visibility: activeGame.gameIconUrl ? "visible" : "hidden" }}
                        />
                        <h2>{activeGame.gameTitle}</h2>
                    </div>

                    <div className="inventory-toolbar">
                        <input
                            type="text"
                            placeholder="Search within listings:"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="inventory-body">
                        <div className="inventory-grid">
                            {cells.map((invItem, index) => (
                                <div
                                    key={invItem?.id ?? `empty-${index}`}
                                    className={`inventory-cell ${invItem ? "" : "empty"} ${
                                        invItem?.id === selectedItemId ? "selected" : ""
                                    }`}
                                    onClick={() => invItem && setSelectedItemId(invItem.id)}
                                >
                                    {invItem && <img src={invItem.item.imageUrl} alt={invItem.item.name} />}
                                </div>
                            ))}
                        </div>

                        <div className="item-details-panel">
                            {selectedItem ? (
                                <>
                                    <img
                                        className="item-details-image"
                                        src={selectedItem.item.imageUrl}
                                        alt={selectedItem.item.name}
                                    />
                                    <h3>{selectedItem.item.name}</h3>
                                    <p className="item-details-game">{selectedItem.item.gameTitle}</p>
                                    {selectedItem.item.description && (
                                        <p className="item-details-description">{selectedItem.item.description}</p>
                                    )}
                                    {selectedItem.quantity > 1 && (
                                        <p className="item-details-quantity">Quantity: {selectedItem.quantity}</p>
                                    )}

                                    {selectedItem.item.isTradable ? (
                                        <div className="item-details-actions">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(`/trade/new?senderInventoryItemId=${selectedItem.id}`)
                                                }
                                            >
                                                Trade
                                            </button>
                                            <button type="button" onClick={handleSell} disabled={selling}>
                                                {selling ? "Selling..." : "Sell"}
                                            </button>
                                        </div>
                                    ) : (
                                        <p className="item-not-tradable">(Not Tradable)</p>
                                    )}
                                </>
                            ) : (
                                <p className="item-details-placeholder">Select an item to see details.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}