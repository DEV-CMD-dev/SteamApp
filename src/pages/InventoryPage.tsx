import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import type { InventoryItemDto } from "../DTOs/InventoryItem/InventoryItemDto";
import { inventoryService } from "../services/inventoryService";
import type { ProfileDto } from "../DTOs/Profile/ProfileDto";
import { profileService } from "../services/profileService";
import "../css/inventoryPage.css";

type GameGroup = {
  gameId: number;
  gameTitle: string;
  gameIconUrl?: string | null;
  items: InventoryItemDto[];
};

const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return (
      payload.sub ??
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ??
      null
    );
  } catch {
    return null;
  }
};

const MIN_ROWS = 5;

export default function InventoryPage() {
  const { username, accessToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<InventoryItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGameId, setActiveGameId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selling, setSelling] = useState(false);
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(5);

  // Sync React column count with actual CSS Grid layout to perfectly calculate empty slots
  useEffect(() => {
    if (!gridRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        
        // These match the CSS minmax constraints and gap sizes
        const isMobile = window.innerWidth <= 640;
        const minCellWidth = isMobile ? 76 : 96; 
        const gap = isMobile ? 4 : 6;
        
        const calculatedCols = Math.floor(
          (containerWidth + gap) / (minCellWidth + gap)
        );
        
        setColumns(Math.max(calculatedCols, 1));
      }
    });

    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    inventoryService
      .getMyInventory()
      .then((result) => {
        setInventory(result.items);
      })
      .catch((error) => {
        console.error("Failed to load inventory", error);
        toast.error("Failed to load inventory.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const userId = getUserIdFromToken(accessToken);
    if (!userId) {
      console.error("User ID was not found in access token.");
      return;
    }

    profileService
      .getProfile(userId)
      .then((result) => {
        setProfile(result);
      })
      .catch((error) => {
        console.error("Failed to load profile", error);
      });
  }, [accessToken]);

  const games: GameGroup[] = useMemo(() => {
    const groups: GameGroup[] = [];

    inventory.forEach((invItem) => {
      const group = groups.find((game) => game.gameId === invItem.item.gameId);

      if (group) {
        group.items.push(invItem);
      } else {
        groups.push({
          gameId: invItem.item.gameId,
          gameTitle: invItem.item.gameTitle,
          gameIconUrl: invItem.item.gameIconUrl,
          items: [invItem],
        });
      }
    });

    return groups;
  }, [inventory]);

  useEffect(() => {
    if (activeGameId === null && games.length > 0) {
      setActiveGameId(games[0].gameId);
    }
  }, [games, activeGameId]);

  const activeGame = games.find((game) => game.gameId === activeGameId) ?? null;

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return (activeGame?.items ?? []).filter((invItem) =>
      invItem.item.name.toLowerCase().includes(query)
    );
  }, [activeGame, searchQuery]);

  const totalSlots = useMemo(() => {
    const minSlots = columns * MIN_ROWS;
    const needed = Math.max(minSlots, visibleItems.length);
    return Math.ceil(needed / columns) * columns;
  }, [visibleItems.length, columns]);

  const emptySlotCount = Math.max(0, totalSlots - visibleItems.length);

  const selectedItem = visibleItems.find((invItem) => invItem.id === selectedItemId) ?? null;

  const handleSelectGame = (gameId: number) => {
    setActiveGameId(gameId);
    setSelectedItemId(null);
    setSearchQuery("");
  };

  const handleSelectItem = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  const handleSell = async () => {
    if (!selectedItem) return;

    setSelling(true);

    try {
      await inventoryService.sellItem(selectedItem.id);

      setInventory((prev) =>
        prev.filter((invItem) => invItem.id !== selectedItem.id)
      );

      setSelectedItemId(null);
      toast.success("Item sold successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to sell item."
      );
    } finally {
      setSelling(false);
    }
  };

  const closeDetails = () => {
    setSelectedItemId(null);
  };

  return (
    <div className="inventory-page">
      <header className="inventory-header">
        <div className="inventory-title">
          <div className="inventory-user">
            {profile?.avatar && (
              <img
                src={profile.avatar}
                alt={username ?? "User"}
                className="inventory-avatar"
              />
            )}
            <div>
              <h1>{username}</h1>
            </div>
          </div>
        </div>

        <div className="inventory-actions">
          <button
            type="button"
            className="trade-offers-button"
            onClick={() => navigate("/trade")}
          >
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
            {game.gameIconUrl && (
              <img src={game.gameIconUrl} alt="" className="game-tab-icon" />
            )}
            <span>
              {game.gameTitle} ({game.items.length})
            </span>
          </button>
        ))}
      </nav>

      {activeGame && (
        <div className="inventory-panel">
          <div className="inventory-panel-header">
            {activeGame.gameIconUrl && (
              <img
                src={activeGame.gameIconUrl}
                alt=""
                className="inventory-panel-icon"
              />
            )}
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
            <div className="inventory-grid" ref={gridRef}>
              {visibleItems.map((invItem) => (
                <div
                  key={invItem.id}
                  className={`inventory-cell ${
                    invItem.id === selectedItemId ? "selected" : ""
                  }`}
                  onClick={() => handleSelectItem(invItem.id)}
                >
                  <img src={invItem.item.imageUrl} alt={invItem.item.name} />
                </div>
              ))}

              {Array.from({ length: emptySlotCount }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="inventory-cell empty"
                  aria-hidden="true"
                />
              ))}
            </div>

            <div
              className={`item-details-overlay ${selectedItem ? "open" : ""}`}
              onClick={closeDetails}
            />

            <div className={`item-details-panel ${selectedItem ? "open" : ""}`}>
              <button
                type="button"
                className="item-details-close"
                onClick={closeDetails}
                aria-label="Close"
              >
                ×
              </button>

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
                    <p className="item-details-description">
                      {selectedItem.item.description}
                    </p>
                  )}

                  {selectedItem.quantity > 1 && (
                    <p className="item-details-quantity">
                      Quantity: {selectedItem.quantity}
                    </p>
                  )}

                  {selectedItem.item.isTradable ? (
                    <div className="item-details-actions">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/trade/new?senderInventoryItemId=${selectedItem.id}`
                          )
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
                <p className="item-details-placeholder">
                  Select an item to see details.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}