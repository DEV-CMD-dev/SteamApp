import CategoryCarousel from "../components/Store/CategoryCarousel";
import DiscountGames from "../components/Store/DiscountGames";
import DiscoveryQueue from "../components/Store/DiscoveryQueue";
import GameCarousel from "../components/Store/GameCarousel";
import GameList from "../components/Store/GameList";
import SmallGameCarousel from "../components/Store/SmallGameCarousel";

export default function StorePage(){
    return(
        <>
            <GameCarousel />
            <DiscoveryQueue />
            <DiscountGames />
            <GameList />
            <CategoryCarousel />
            <SmallGameCarousel />
        </>
    );
}