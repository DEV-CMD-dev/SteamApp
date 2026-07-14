import Category from "../components/Category";
import Game from "../components/Game";
import "../css/storepage.css";
import { useState, useEffect } from "react";

export default function StorePage() {
    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);


    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch("http://localhost:5215/api/Game");
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error("Error fetching games:", error);
            }
        };
        const fetchTags = async () => {
            try {
                const response = await fetch("http://localhost:5215/api/Tag");
                const data = await response.json();
                setTags(data);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchGames();
        fetchTags();
    }, []);

    return (
        <>
            <div className="store-header" />
            <div className="store-background">
                <div className="games-container">
                    {games.slice(0, 3).map((game: any) => (
                        <Game key={game.id} price={game.price} discount={20} img={game.coverImage} />
                    ))}
                </div>
                
                <div className="categories-section">
                    <h3>Browse by Category</h3>
                    <div className="category-container">

                        {tags.slice(0,5).map((tag: any) => (
                            <Category key={tag.id} name={tag.name} imgUrl={tag.picture} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}