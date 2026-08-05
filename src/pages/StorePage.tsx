import DiscoveryQueue from "../components/Store/DiscoveryQueue";
import GameCarousel from "../components/Store/GameCarousel";

export default function StorePage(){
    return(
        <>
            <GameCarousel />
            <DiscoveryQueue />
        </>
    )
}