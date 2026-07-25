import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGameData = () => {
    const [games, setGames] = useState([]);
    const [tags, setTags] = useState([]);
    const [gameLoading, setGameLoading] = useState(true);
    const [tagLoading, setTagLoading] = useState(true);

    const fetchGames = useCallback(async (pageGameNum: number) => {
        setGameLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/Game?pageNumber=${pageGameNum}&pageSize=9`);
            const data = await response.json();
            setGames(data);
            if (data && data.length > 0) {
                setGameLoading(false);
            }
        } catch (error) {
            console.error("Error fetching games:", error);
        }
    }, []);

    const fetchTags = useCallback(async (pageTagNum: number) => {
        setTagLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/Tag?pageNumber=${pageTagNum}&pageSize=15`);
            const data = await response.json();
            setTags(data);
            if (data && data.length > 0) {
                setTagLoading(false);
            }
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    }, []);

    return {
        games,
        tags,
        gameLoading,
        tagLoading,
        fetchGames,
        fetchTags
    };
};