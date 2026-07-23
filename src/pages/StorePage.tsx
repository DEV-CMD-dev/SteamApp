import Category from "../components/Category";
import Game from "../components/Game";
import "../css/storepage.css";
import { useState, useEffect } from "react";

export default function StorePage() {
    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);
    const [gamePageNumber, setgamePageNumber] = useState(1);
    const [tagPageNumber, settagPageNumber] = useState(1);
    const [gameLoading, setgameLoading] = useState(true);
    const [tagLoading, setTagLoading] = useState(true);

    const fetchGames = async () => {
        setgameLoading(true);
        try {
            const response = await fetch(`http://localhost:5215/api/Game?pageNumber=1&pageSize=9`);
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error("Error fetching games:", error);
        } finally {
            setgameLoading(false);
        }
    };

    const fetchTags = async () => {
        setTagLoading(true);
        try {
            const response = await fetch(`http://localhost:5215/api/Tag?pageNumber=1&pageSize=15`);
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        } finally {
            setTagLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
        fetchTags();
    }, []);


    const itemsPerGamePage = 3;
    const startGameIndex = (gamePageNumber - 1) * itemsPerGamePage;
    const currentGames = games.slice(startGameIndex, startGameIndex + itemsPerGamePage);
    const totalGamePages = Math.ceil(games.length / itemsPerGamePage);

    const itemsPerTagPage = 5;
    const startTagIndex = (tagPageNumber - 1) * itemsPerTagPage;
    const currentTags = tags.slice(startTagIndex, startTagIndex + itemsPerTagPage);
    const totalTagPages = Math.ceil(tags.length / itemsPerTagPage);

    return (
        <>
            <div className="main-container">
                <div className="store-header" />
                <div className="store-background">
                    <div className="btn-container desktop-only">
                        <button className="prev-btn" onClick={() => setgamePageNumber(num => num > 1 ? num - 1 : num)}></button>
                        <div className="games-container">
                            {gameLoading ? (
                                [...Array(3)].map((_, index) => <Game key={`desk-skel-game-${index}`} img="" price={0} discount={0} loading={true} />)
                            ) : (
                                currentGames.map((game: any) => <Game key={`desk-game-${game.id}`} img={game.coverImage} price={10} discount={10} loading={false} />)
                            )}
                        </div>
                        <button className="next-btn" onClick={() => setgamePageNumber(num => num < totalGamePages ? num + 1 : num)}></button>
                    </div>

                    <div className="mobile-scroll-container mobile-only">
                        {gameLoading ? (
                            [...Array(3)].map((_, index) => <Game key={`mob-skel-game-${index}`} img="" price={0} discount={0} loading={true} />)
                        ) : (
                            games.map((game: any) => <Game key={`mob-game-${game.id}`} img={game.coverImage} price={10} discount={10} loading={false} />)
                        )}
                    </div>

                    <div className="categories-section">
                        <h3>Browse by Category</h3>
                        
                        <div className="btn-container desktop-only">
                            <button className="prev-btn" onClick={() => settagPageNumber(num => num > 1 ? num - 1 : num)}></button>
                            <div className="category-container">
                                {tagLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    currentTags.map((tag: any) => <Category key={`desk-tag-${tag.id}`} name={tag.name} imgUrl={tag.picture} />)
                                )}
                            </div>
                            <button className="next-btn" onClick={() => settagPageNumber(num => num < totalTagPages ? num + 1 : num)}></button>
                        </div>

                        <div className="mobile-scroll-container tag-scroll mobile-only">
                            {tagLoading ? (
                                <p>Loading...</p>
                            ) : (
                                tags.map((tag: any) => <Category key={`mob-tag-${tag.id}`} name={tag.name} imgUrl={tag.picture} />)
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}