import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { GameDto } from "../../DTOs/Game/GameDto";
import { gameService } from "../../services/gameService";
import NavDropdownPanel, { type PanelStyle } from "./NavDropdownPanel";
import styles from "../../css/dropdownPanels/RecommendationsDropdown.module.css";

const RECOMMENDATIONS_COUNT = 3;

interface PriceInfo {
    isFree: boolean;
    hasDiscount: boolean;
    discountPercent: number;
    originalPrice: string;
    finalPrice: string;
}

function getPriceInfo(game: GameDto): PriceInfo {
    if (game.price === 0) {
        return {
            isFree: true,
            hasDiscount: false,
            discountPercent: 0,
            originalPrice: "",
            finalPrice: "Free to Play",
        };
    }

    const hasDiscount = game.discount > 0;
    const finalPriceValue = hasDiscount
        ? game.price * (1 - game.discount / 100)
        : game.price;

    const formatValue = (value: number) =>
        `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;

    return {
        isFree: false,
        hasDiscount,
        discountPercent: game.discount,
        originalPrice: formatValue(game.price),
        finalPrice: formatValue(finalPriceValue),
    };
}

interface RecommendationsDropdownProps {
    isOpen: boolean;
    panelStyle: PanelStyle | null;
    onLinkClick: () => void;
}

export default function RecommendationsDropdown({ isOpen, panelStyle, onLinkClick }: RecommendationsDropdownProps) {
    const [games, setGames] = useState<GameDto[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen || games.length > 0) {
            return;
        }

        const fetchGames = async () => {
            try {
                const result = await gameService.getTopSellers(1, RECOMMENDATIONS_COUNT);
                setGames(result.items);
            } catch (err) {
                console.error(err);
            }
        };

        fetchGames();
    }, [isOpen, games.length]);

    const handleRowClick = (gameId: number) => {
        onLinkClick();
        navigate(`/game/${gameId}`);
    };

    return (
        <NavDropdownPanel isOpen={isOpen} panelStyle={panelStyle}>
            <span className={styles.title}>Top-sellers</span>

            {games.length === 0 ? (
                <div className={styles.message}>Loading recommendations</div>
            ) : (
                <div className={styles.list}>
                    {games.map((game) => {
                        const priceInfo = getPriceInfo(game);

                        return (
                            <div
                                key={game.id}
                                className={styles.row}
                                onClick={() => handleRowClick(game.id)}>
                                <div className={styles.imageContainer}>
                                    <img
                                        src={game.coverImageHorizontal}
                                        alt={game.title || "Game cover"}
                                        className={styles.coverImage} />
                                </div>

                                <div className={styles.info}>
                                    <span className={styles.gameTitle}>{game.title}</span>

                                    <div className={styles.priceRow}>
                                        {priceInfo.isFree ? (
                                            <span className={styles.price}>{priceInfo.finalPrice}</span>
                                        ) : priceInfo.hasDiscount ? (
                                            <>
                                                <span className={styles.discountBadge}>
                                                    -{priceInfo.discountPercent}%
                                                </span>
                                                <span className={styles.originalPrice}>
                                                    {priceInfo.originalPrice}
                                                </span>
                                                <span className={styles.finalPrice}>
                                                    {priceInfo.finalPrice}
                                                </span>
                                            </>
                                        ) : (
                                            <span className={styles.price}>{priceInfo.finalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </NavDropdownPanel>
    );
}