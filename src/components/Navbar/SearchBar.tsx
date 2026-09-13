import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchItem from "./SearchItem";
import type { GameDto } from "../../DTOs/Game/GameDto";
import searchIcon from "../../assets/navbar/search.svg";
import "../../css/navbar.css"
export default function SearchBar() {
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState<GameDto[]>([]);
    const [popularGames, setPopularGames] = useState<GameDto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    async function GetSearchResults() {
        try {
            const response = await fetch(`https://localhost:7166/api/Games?SearchTerm=${searchTerm}&pageSize=4`);
            const data = await response.json();
            console.log(data.items);
            setSearchResults(data.items);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
        }
    }
    useEffect(() => {
        if (searchTerm.trim() === "") {
            return;
        }
        if (searchTerm.length < 3) {
            return;
        }
        GetSearchResults();
    }, [searchTerm]);




    async function GetPopularGames() {
        try {
            const response = await fetch(`https://localhost:7166/api/Games?OnSaleOnly=true&pageNumber=1&pageSize=4`);
            const data = await response.json();
            setPopularGames(data.items);
        } catch (error) {
            console.error("Error fetching popular games:", error);
            setPopularGames([]);
        }
    }

    useEffect(() => {
        GetPopularGames();
    }, []);

    return (
        <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-bar-container">
                <input
                    className="search-bar"
                    type="text"
                    placeholder="Search for games"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <button onClick={() => {
                    const params = new URLSearchParams();
                    if (searchTerm.trim() !== "") {
                        params.set("term", searchTerm);
                    }
                    navigate(`/search?${params.toString()}`);
                    setSearchTerm("");
                    setIsFocused(false);
                }} type="submit" className="search-bar-button">
                    <img src={searchIcon} alt="Search" />
                </button>
                {
                    isFocused && (
                        <div className="nav-search-container" onMouseDown={(e) => e.preventDefault()}>
                            <p>{searchTerm.length >= 3 ? `Search results for "${searchTerm}"` : "Popular Searches"}</p>
                            {searchTerm.length < 3 ? (
                                popularGames?.map((game, index) => (
                                    <SearchItem onClick={() => {
                                        setSearchTerm("");
                                        navigate(`/game/${game.id}`);
                                        setIsFocused(false);
                                    }} key={index} game={game} />
                                ))
                            ) : (
                                searchResults?.map((game, index) => (
                                    <SearchItem onClick={() => {
                                        setSearchTerm("");
                                        navigate(`/game/${game.id}`);
                                        setIsFocused(false);
                                    }} key={index} game={game} />
                                )))}
                            <button onClick={() => {
                                const params = new URLSearchParams();
                                if (searchTerm.trim() !== "") {
                                    params.set("term", searchTerm);
                                }
                                navigate(`/search?${params.toString()}`);
                                setSearchTerm("");
                                setIsFocused(false);
                            }} type="button" className="advanced-search-button">
                                Advanced Search
                            </button>
                        </div>
                    )
                }
            </div>
        </form>
    )
}