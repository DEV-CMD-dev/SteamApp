import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GamePage from "../../pages/GamePage";
import type { GameDto } from "../../DTOs/Game/GameDto";
import { storeService } from "../../services/storeService";

export default function GamePageContainer() {
    const { id } = useParams<{ id: string }>();
    const [gameDto, setGameDto] = useState<GameDto | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadGame = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedGame = await storeService.fetchGameById(Number(id));
                setGameDto(fetchedGame);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load game.");
            } finally {
                setIsLoading(false);
            }
        };

        loadGame();
    }, [id]);

    if (isLoading) return <div className="game-page-status">Loading...</div>;
    if (error) return <div className="game-page-status">{error}</div>;
    if (!gameDto) return <div className="game-page-status">Game not found.</div>;

    return <GamePage gameDto={gameDto} />;
}