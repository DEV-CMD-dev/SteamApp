import "../css/category.css";

export default function Category({ name, imgUrl }: { name: string; imgUrl: string }) {
    return (
        <div className="category">
            <div
                className="category-bg"
                style={{ backgroundImage: `url(${imgUrl})` }}
            />

            <div className="category-content">
                <p>{name.toUpperCase()}</p>
            </div>
        </div>
    )
}
