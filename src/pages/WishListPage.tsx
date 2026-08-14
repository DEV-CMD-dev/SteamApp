import { useEffect, useState } from "react";
import GameList from "../components/Store/GameList";
import { wishlistService } from "../services/wishListService";
import type { GameDto } from "../DTOs/Game/GameDto";

export default function WishListPage(){

    const [wishlistGames, setWishlistGames] = useState<GameDto[]>([]);
    
        useEffect(() => {

        const fetchWishlist = async () => {
            try {
            const games = await wishlistService.getMyWishlist();
            setWishlistGames(games);
            } catch (err) {
            console.error(err);
            }
        };
    
        fetchWishlist();
        }, []);

    return (
        <>
            <GameList wishlist={true} games={wishlistGames}/>
        </>
    )
}