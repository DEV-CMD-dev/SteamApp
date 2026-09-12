import { useEffect, useState, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import SearchGame from "../components/SearchPage/SearchGame"
import "../css/Search/SearchPage.css"
import type { GameDto } from "../DTOs/Game/GameDto";
import GameFilter from "../components/SearchPage/GameFilter";
import OsFilter from "../components/SearchPage/OsFilter";
import TagFilter from "../components/SearchPage/TagFilter";
import { SearchContext } from "../contexts/SearchContext";

export default function SearchPage() {
    const lastChunk = useRef(0);
    const [games, setGames] = useState<GameDto[]>()
    const [pageNumber, setpageNumber] = useState(1);
    const [searchParams] = useSearchParams();
    const initialTerm = searchParams.get("term") || "";
    const [searchValue, setSearchValue] = useState<string>(initialTerm);
    const [searchDiv, setSearchDiv] = useState<string>(initialTerm);
    const { TagIds, IsWindows, IsMacOS, IsDiscounted, HideFreeToPlay, MaxPrice } = useContext(SearchContext);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    async function GetGameSearch(currentPage: number) {
        try {
            const url = new URL("https://localhost:7166/api/Games");

            url.searchParams.append("pageNumber", currentPage.toString());
            url.searchParams.append("pageSize", "20");

            if (searchValue.trim() !== "") {
                url.searchParams.append("SearchTerm", searchValue);
            }
            if (MaxPrice !== null) {
                url.searchParams.append("MaxPrice", MaxPrice.toString());
            }
            if (IsDiscounted) {
                url.searchParams.append("OnSaleOnly", "true");
            }
            if (HideFreeToPlay) {
                url.searchParams.append("HideFreeToPlay", "true");
            }
            if (IsWindows)
                url.searchParams.append("OsFilter", "windows");

            if (IsMacOS)
                url.searchParams.append("OsFilter", "macos");

            if (TagIds && TagIds.length > 0) {
                TagIds.forEach(id => {
                    url.searchParams.append("TagIds", id.toString());
                });
            }

            const response = await fetch(url.toString());
            const data = await response.json();

            if (currentPage === 1) {
                setGames(data.items);
            } else {
                setGames((prevGames) => [...(prevGames || []), ...data.items]);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            setGames([]);
        }
    }

    const handleSearchClick = () => {
        setpageNumber(1);
        lastChunk.current = 0;
        setSearchDiv(searchValue);
        GetGameSearch(1);
    };

    const handleDeleteSearchClick = () => {
        setpageNumber(1);
        lastChunk.current = 0;
        setSearchValue("");
        setSearchDiv("");
    };

    useEffect(() => {
        setpageNumber(1);
        lastChunk.current = 0;
        GetGameSearch(1);
    }, [searchDiv, IsDiscounted, HideFreeToPlay, MaxPrice, IsWindows, IsMacOS, TagIds])

    useEffect(() => {
        if (pageNumber > 1) {
            GetGameSearch(pageNumber);
        }
    }, [pageNumber])

    useEffect(() => {
        const handleScroll = () => {
            const currentChunck = Math.floor(window.scrollY / (window.innerHeight / 2));

            if (currentChunck > lastChunk.current) {
                lastChunk.current = currentChunck;
                setpageNumber(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className="search-background">
            <p style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                color: "#c9c9c9",
                fontSize: "30px"
            }}>
                {games?.length || 0} games found
            </p>
            <div className="search-gradient">

                {
                    searchDiv.trim() != "" ?
                        (
                            <div className="search-term-container">
                                <p className="search-term-p">"{searchDiv}"</p>
                                <button onClick={handleDeleteSearchClick} className="delete-term-btn"></button>
                            </div>
                        )
                        :
                        (
                            <h2 className="search-all-products">All products</h2>
                        )
                }
            </div>
            <div className="search-page-container">
                <button
                    className="mobile-filter-btn"
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                    ☰
                </button>
                <div className="search-page-content">
                    <div className="search-inputs">
                        <div className="search-method">
                            <input value={searchValue} onChange={e => setSearchValue(e.target.value)} className="search-input" placeholder="Enter a search criterion or tag." type="text" />
                            <button onClick={handleSearchClick} className="search-button">Search</button>
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
                {isFiltersOpen && (
                    <div
                        className="mobile-overlay"
                        onClick={() => setIsFiltersOpen(false)}
                    ></div>
                )}
                <div className={`search-page-filters ${isFiltersOpen ? "open" : ""}`}>
                    <GameFilter />
                    <TagFilter />
                    <OsFilter />
                </div>
            </div>
        </div>
    )
}