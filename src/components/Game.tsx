import "../css/game.css";

export default function Game({ img, price, discount, loading }: { img: string, price: number, discount: number, loading: boolean }) {
    return (

        <>
            {!loading ? (
                <div className="game-card">
                    <img className="game-image" src={img} alt="Game Cover" />
                    <div className="game-price">
                        <div className="discount">
                            <p>-{discount}%</p>
                        </div>
                        <div className="price">
                            <p className="original-price">${price.toFixed(0)}</p>
                            <p className="discounted-price">${(price * (1 - discount / 100)).toFixed(0)}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="game-card-null"/>
            )}

        </>

    );
}