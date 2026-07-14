import "../css/game.css";

export default function Game({ price, discount, img }: { price: number; discount: number; img: string }) {
    return (
        <div className="game">
            <img className="game-image" src={img} alt="Game Image" />
            <div className="game-price">
                <div className="discount"><p>-{discount}%</p></div>
                <div className="price">
                    <p className="original-price">${price.toFixed(0)}</p>
                    <p className="discounted-price">${(price * (1 - discount / 100)).toFixed(0)}</p>
                </div>
            </div>
        </div>
    )
}
