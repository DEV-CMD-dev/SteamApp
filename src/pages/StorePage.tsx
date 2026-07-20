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

    const fetchGames = async () => {
        setgameLoading(true);
        try {
            const response = await fetch(`http://localhost:5215/api/Game?pageNumber=${gamePageNumber}&pageSize=3`);
            const data = await response.json();
            setGames(data);
        } catch (error) {
            console.error("Error fetching games:", error);
        }
        finally {
            setgameLoading(false);
        }
    };
    const fetchTags = async () => {
        try {
            const response = await fetch(`http://localhost:5215/api/Tag?pageNumber=${tagPageNumber}&pageSize=5`);
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    useEffect(() => {
        fetchGames();
    }, [gamePageNumber]);
    useEffect(() => {
        fetchTags();
    }, [tagPageNumber]);

    return (
        <>
            <div className="store-header" />
            <div className="store-background">

                <div className="btn-container">
                    <button className="prev-btn" onClick={() => setgamePageNumber(num => num > 1 ? num - 1 : num)}></button>
                    <div className="games-container">
                        {gameLoading ? (
                            [...Array(3)].map((index) => (
                                <Game key={index} img="" price={0} discount={0} loading={true} />
                            ))
                        ) : (
                            games.slice(0, 3).map((game: any) => (
                                <Game key={game.id} img={game.coverImage} price={10} discount={10} loading={false} />
                            ))
                        )}
                    </div>
                    <button className="next-btn" onClick={() => setgamePageNumber(num => num <= 3 ? num + 1 : num)}></button>
                </div>

                <div className="categories-section">
                    <h3>Browse by Category</h3>
                    <div className="btn-container">
                        <button className="prev-btn" onClick={() => settagPageNumber(num => num > 1 ? num - 1 : num)}></button>
                        <div className="category-container">

                            {tags.slice(0, 5).map((tag: any) => (
                                <Category key={tag.id} name={tag.name} imgUrl={tag.picture} />
                            ))}
                        </div>
                        <button className="next-btn" onClick={() => settagPageNumber(num => num <= 3 ? num + 1 : num)}></button>
                    </div>
                </div>

            </div>
        </>
    )
}