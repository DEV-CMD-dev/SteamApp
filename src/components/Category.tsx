import "../css/category.css";

export default function Category({ name, imgUrl }: { name: string; imgUrl: string }) {
    return (
        <div className="category" style={{ backgroundImage: `url(${imgUrl})` }}>
            <p className="category-text">{name}</p>
        </div>
    )
}
