import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GameList from "../components/Store/GameList";
import { cartService } from "../services/cartService";
import type { GameDto } from "../DTOs/Game/GameDto";

import "../css/cartPage.css";
import Computer from "../assets/cart_page/computer.png";

export default function CartPage() {

    const [cartGames, setCartGames] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const games = await cartService.getMyCart();

                setCartGames(games);

            } catch (err) {

                console.error("Failed to load cart:", err);

            } finally {

                setLoading(false);

            }

        };

        fetchCart();

    }, []);

    const handleRemoveFromCart = async (gameId: number) => {

        try {

            await cartService.removeGame(gameId);

            setCartGames(prev =>
                prev.filter(game => game.id !== gameId)
            );

        } catch (err) {

            console.error("Failed to remove game from cart:", err);

        }
    };

    const totalPrice = cartGames.reduce((total, game) => {

        const price = game.discount > 0
            ? game.price * (1 - game.discount / 100)
            : game.price;

        return total + price;

    }, 0);

    if (loading) {

        return (
            <div className="cart-page">
                <div className="cart-loading">
                    Loading cart...
                </div>
            </div>
        );

    }

    return (

        <div className="cart-page">

            <h1 className="cart-title">
                Your Cart (games: {cartGames.length})
            </h1>

            <div className="cart-layout">

                {/* LEFT SIDE */}

                <div className="cart-main">

                    <GameList
                        cart={true}
                        games={cartGames}
                        onRemoveFromCart={handleRemoveFromCart}
                    />

                    <div className="cart-bottom-buttons">

                        <button
                            className="cart-back-btn"
                            onClick={() => navigate("/")}
                        >
                            Back to Store
                        </button>

                        <button
                            className="cart-checkout-btn"
                            onClick={() => navigate("/checkout")}
                            disabled={cartGames.length === 0}
                        >
                            Proceed to Checkout
                        </button>

                    </div>

                </div>


                {/* RIGHT SIDEBAR */}

                <aside className="cart-sidebar">

                    <div className="cart-summary">

                        <div className="cart-summary-title">
                            SUBTOTAL
                        </div>

                        <div className="cart-total">
                            ${totalPrice.toFixed(2)}
                        </div>

                        <p className="cart-tax-text">
                            Taxes and additional fees, if applicable,
                            will be calculated at checkout.
                        </p>

                        <button
                            className="cart-sidebar-checkout-btn"
                            onClick={() => navigate("/checkout")}
                            disabled={cartGames.length === 0}
                        >
                            Proceed to Checkout
                        </button>

                    </div>


                    <div className="cart-info">

                        <div className="cart-info-image">
                            <img
                                src={Computer}
                                alt="Steam purchase"
                            />
                        </div>

                        <p>
                            Purchasing digital products gives you
                            a license to use them on Steam.
                        </p>

                        <span>
                            All applicable terms and conditions
                            can be reviewed during checkout.
                        </span>

                    </div>

                </aside>

            </div>

        </div>

    );
}