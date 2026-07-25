import "../css/category.css";
import type { TagDto } from "../DTOs/TagDto";

export default function Category({ tagDto }: { tagDto: TagDto }) {
    return (
        <>
            <div className="category">
                <div
                    className="category-bg"
                    style={{ backgroundImage: `url(${tagDto.picture})` }}
                />
                <div className="category-content">
                    <p>{tagDto.name.toUpperCase()}</p>
                </div>
            </div>
        </>
    )
}
