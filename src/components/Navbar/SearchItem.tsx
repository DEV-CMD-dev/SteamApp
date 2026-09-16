import type { GameDto } from "../../DTOs/Game/GameDto";
import "./SearchItem.css"

export default function SearchItem({ game, onClick }: { game: GameDto; onClick?: () => void }) {
  const hasDiscount = game.discount > 0;
  const finalPrice = hasDiscount
    ? (game.price * (1 - game.discount / 100)).toFixed(2)
    : game.price.toFixed(2);

  return (
    <div className="search-item" onClick={onClick}  >
      <div className="search-item-image-container">
        <img
          src={game.coverImageHorizontal}
          alt={game.title}
          className="search-item-image"
        />
      </div>
      <div className="search-item-info-container">
        <p className="search-item-title">{game.title}</p>
        <div className="search-item-price-container">
          {game.discount > 0 && (
            <div className="search-item-discount-container">
              <div className="search-item-discount">
                <p>-{game.discount}%</p>
              </div>
              <span className="search-item-original-price">
                ${game.price.toFixed(2)}
              </span>
            </div>
          )}
          <div className="search-item-price">
            <p>
              ${finalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}