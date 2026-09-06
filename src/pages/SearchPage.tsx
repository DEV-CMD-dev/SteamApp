import { useEffect, useState } from "react";
import SearchGame from "../components/SearchPage/SearchGame"
import "../css/Search/SearchPage.css"
import type { GameDto } from "../DTOs/Game/GameDto";
import GameFilter from "../components/SearchPage/GameFilter";
export default function SearchPage() {
    const [games, setGames] = useState<GameDto[]>()
    async function GetGameSearch() {
        try {
            const response = await fetch(`https://localhost:7166/api/Games?pageSize=20`);
            const data = await response.json();
            console.log(data.items);
            setGames(data.items);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setGames([]);
        }
    }
    useEffect(() => {
        GetGameSearch();
    }, [])

    return (
        <div className="search-background">
            <div className="search-gradient">
                <h2 className="search-all-products">All products</h2>
            </div>
            <div className="search-page-container">
                <div className="search-page-content">
                    <div className="search-inputs">
                        <div className="search-method">
                            <input className="search-input" placeholder="Enter a search criterion or tag." type="text" />
                            <button className="search-button">Search</button>
                        </div>
                    </div>
                    <div className="search-results">
                        {
                            games?.map((game, index) => (
                                <SearchGame key={index} gameDto={game} />

                            ))
                        }
                    </div>
                </div>
                <div className="search-page-filters">
                    <GameFilter/>
                    <GameFilter/>
                    <GameFilter/>
                    <GameFilter/>

                </div>
            </div>
        </div>
    )
}