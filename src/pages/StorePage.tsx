import CategoryCarousel from "../components/Store/CategoryCarousel";
import DiscountGames from "../components/Store/DiscountGames";
import DiscoveryQueue from "../components/Store/DiscoveryQueue";
import GameCarousel from "../components/Store/GameCarousel";

export default function StorePage(){
    return(
        <>
            <GameCarousel />
            <DiscoveryQueue />
            <DiscountGames />
            <CategoryCarousel />
        </>
    )
}