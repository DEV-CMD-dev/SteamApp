import Category from "../components/Category";
import Game from "../components/Game";
import "../css/storepage.css";
import { useState, useEffect } from "react";
import type { GameDto } from "../DTOs/GameDto";
import { useGameData } from "../services/storeService";
import type { TagDto } from "../DTOs/TagDto";

export default function StorePage() {
    const [gamePageNumber, setgamePageNumber] = useState(1);
    const [tagPageNumber, settagPageNumber] = useState(1);

    const {
        games,
        tags,
        gameLoading,
        tagLoading,
        fetchGames,
        fetchTags,
    } = useGameData();

    useEffect(() => {
        fetchGames(gamePageNumber);
        fetchTags(tagPageNumber);
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
                    
                    <div className="btn-container">
                        <button className="prev-btn" onClick={() => setgamePageNumber(num => num > 1 ? num - 1 : num)}></button>
                        <div className="games-container">
                            {gameLoading ? (
                                [...Array(3)].map((_, index) => <div key={index} className="game-loading" />)
                            ) : (
                                currentGames.map((game: GameDto) => <Game key={game.id} gameDto={game} />)
                            )}
                        </div>
                        <button className="next-btn" onClick={() => setgamePageNumber(num => num < totalGamePages ? num + 1 : num)}></button>
                    </div>

                    <div className="mobile-games-scroll">
                        {gameLoading ? (
                            [...Array(5)].map((_, index) => <div key={index} className="game-loading" />)
                        ) : (
                            games.map((game: GameDto) => <Game key={game.id} gameDto={game} />)
                        )}
                    </div>

                    <div className="categories-section">
                        <h3>Browse by Category</h3>

                        <div className="btn-container">
                            <button className="prev-btn" onClick={() => settagPageNumber(num => num > 1 ? num - 1 : num)}></button>
                            <div className="category-container">
                                {tagLoading ? (
                                    [...Array(5)].map((_, index) => <div key={index} className="category-loading" />)
                                ) : (
                                    currentTags.map((tag: TagDto) => <Category key={tag.id} tagDto={tag} />)
                                )}
                            </div>
                            <button className="next-btn" onClick={() => settagPageNumber(num => num < totalTagPages ? num + 1 : num)}></button>
                        </div>

                        <div className="mobile-tags-scroll">
                            {tagLoading ? (
                                [...Array(5)].map((_, index) => <div key={index} className="category-loading" />)
                            ) : (
                                tags.map((tag: TagDto) => <Category key={tag.id} tagDto={tag} />)
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}