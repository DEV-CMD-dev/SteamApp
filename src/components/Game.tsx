import "../css/game.css";
import type { GameDto } from "../DTOs/GameDto";

export default function Game({ gameDto }: { gameDto: GameDto }) {
    return (
        <>
            <div className="game-card">
                <img className="game-image" src={gameDto.coverImage} alt="Game Cover" />
                <div className="game-price">
                    <div className="discount">
                        <p>-{10}%</p>
                    </div>
                    <div className="price">
                        <p className="original-price">${gameDto.price.toFixed(0)}</p>
                        <p className="discounted-price">${(gameDto.price * (1 - 10 / 100)).toFixed(0)}</p>
                    </div>
                </div>
            </div>
        </>
    );
}