import { useEffect, useState } from "react";
import GameList from "../components/Store/GameList";
import { cartService } from "../services/cartService";
import type { GameDto } from "../DTOs/Game/GameDto";

export default function CartPage() {

    const [cartGames, setCartGames] = useState<GameDto[]>([]);
    const [cartError, setCartError] = useState<string | null>(null);

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const games = await cartService.getMyCart();

                setCartGames(games);

            } catch (err) {

                console.error(err);
                setCartError(
                    err instanceof Error ? err.message : "Failed to load cart."
                );

            }

        };

        fetchCart();

    }, []);

    if (cartError) {
        return <div className="cart-error">{cartError}</div>;
    }

    return (
        <>
            <GameList
                cart={true}
                games={cartGames}
            />
        </>
    );
}