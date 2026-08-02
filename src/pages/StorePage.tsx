import { useState, useEffect } from "react";
import Category from "../components/Category";
import Game from "../components/Game";
import "../css/storepage.css";
import type { GameDto } from "../DTOs/GameDto";
import { storeService } from "../services/storeService";
import type { TagDto } from "../DTOs/TagDto";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { PaginatedResponse } from "../DTOs/PaginatedList";

export default function StorePage() {
    const [gamePageNumber, setGamePageNumber] = useState(1);
    const [tagPageNumber, setTagPageNumber] = useState(1);

    const [games, setGames] = useState<PaginatedResponse<GameDto> | null>(null);
    const [tags, setTags] = useState<PaginatedResponse<TagDto> | null>(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 650);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                const gamePageSize = isMobile ? 9 : 3;

                const fetchedGames = await storeService.fetchGames(gamePageNumber, gamePageSize);
                setGames(fetchedGames);

                const fetchedTags = await storeService.fetchTags(tagPageNumber, 5);
                setTags(fetchedTags);
            } catch (error) {
                console.error("Error loading store data:", error);
            }
        };

        loadData();
    }, [gamePageNumber, tagPageNumber, isMobile]);

    const gamesList = games?.items || [];
    const tagsList = tags?.items || [];
    const totalGamePages = games?.totalPages || 1;
    const totalTagPages = tags?.totalPages || 1;

    return (
        <div className="main-container">
            <div className="store-header" />
            <div className="store-background">

                <div className="btn-container">
                    <button
                        className="prev-btn"
                        onClick={() => setGamePageNumber(num => Math.max(1, num - 1))}
                    />
                    <div className="games-container">
                        {gamesList.map((game: GameDto) => (
                            <Game key={game.id} gameDto={game} />
                        ))}
                    </div>
                    <button
                        className="next-btn"
                        onClick={() => setGamePageNumber(num => Math.min(totalGamePages, num + 1))}
                    />
                </div>

                <div className="mobile-games-scroll">
                    {gamesList.length > 0 && (
                        <Swiper
                            loop={true}
                            centeredSlides={true}
                            slidesPerView={1.5}
                            spaceBetween={0}
                            grabCursor={true}
                        >
                            {gamesList.map((game: GameDto) => (
                                <SwiperSlide key={game.id}>
                                    <div className="game-card-wrapper">
                                        <Game gameDto={game} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="categories-section">
                    <h3>Browse by Category</h3>

                    <div className="btn-tag-container">
                        <button
                            className="prev-btn"
                            onClick={() => setTagPageNumber(num => Math.max(1, num - 1))}
                        />
                        <div className="category-container">
                            {tagsList.map((tag: TagDto) => (
                                <Category key={tag.id} tagDto={tag} />
                            ))}
                        </div>
                        <button
                            className="next-btn"
                            onClick={() => setTagPageNumber(num => Math.min(totalTagPages, num + 1))}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}