import "./SearchGame.css"
import windowsIcon from "../../assets/search/windows.svg"
import appleIcon from "../../assets/search/apple.svg"
import type { GameDto } from "../../DTOs/Game/GameDto"

export default function SearchGame({ gameDto }: { gameDto: GameDto }) {
    const hasDiscount = gameDto.discount > 0;
    const hasOs = gameDto.systemRequirements?.split(":")[1].toLowerCase()
    const finalPrice = hasDiscount
        ? (gameDto.price * (1 - gameDto.discount / 100)).toFixed(2)
        : gameDto.price.toFixed(2);

    console.log()
    return (
        <div className="search-game-container">
            <div className="search-game-image">
                <img
                    src={gameDto.coverImageHorizontal}
                    alt={gameDto.title}
                    className="search-item-image"
                />
            </div>
            <div className="search-game-info">
                <div className="search-game-title-container">
                    <h3 className="search-game-title">{gameDto.title}</h3>
                    <div className="search-game-os">
                        {hasOs?.includes("windows") && (<img className="os-icon" src={windowsIcon} alt="OS Icon" />)}
                        <img className="os-icon" src={appleIcon} alt="OS Icon" />
                    </div>
                </div>
                <div className="search-game-price">
                    {hasDiscount && (
                        <div className="search-discount">
                            <p>-{gameDto.discount}%</p>
                        </div>
                    )}
                    <div className="search-price">
                        {hasDiscount && (<p className="original-price">${gameDto.price}</p>)}
                        <p className="discounted-price">{gameDto.price <= 0 ? 'Free' : `$${finalPrice}`}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}