import { useEffect, useState, useContext } from "react"
import "./GameFilter.css"
import CustomCheckbox from "../CustomCheckbox";
import type { TagDto } from "../../DTOs/Tag/TagDto";
import { SearchContext } from "../../contexts/SearchContext";
import { searchService } from "../../services/searchService";

export default function TagFilter() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [tags, setTags] = useState<TagDto[]>([]);
    const [tagValue, setTagValue] = useState<string>("");
    const { TagIds, setTagIds } = useContext(SearchContext);


    async function getTags() {
        try {
            const data = await searchService.getAll(tagValue);
            setTags(data.items);
        } catch (error) {
            console.error(error);
        }
    }
    const handleTagChange = (tagId: number, isChecked: boolean) => {
        if (isChecked) {
            setTagIds((prev: number[]) => [...prev, tagId]);
        } else {
            setTagIds((prev: number[]) => prev.filter(id => id !== tagId));
        }
    };

    useEffect(() => {
        getTags()
    }, [tagValue])

    return (
        <div className="filter-container">
            <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
                Narrow by tag
            </div>
            {
                isOpen && (
                    <div className={`filter-content ${isOpen ? "open" : ""}`}>
                        <div className="checkbox-container">
                            {
                                tags?.map((tag, index) => (
                                    <CustomCheckbox checked={TagIds.includes(tag.id)} onChange={e => handleTagChange(tag.id, e)} key={index} title={tag.name} />
                                ))
                            }
                        </div>
                        <input value={tagValue} onChange={e => setTagValue(e.target.value)} className="tag-search-input" placeholder="search for more tags" type="text" />
                    </div>
                )
            }
        </div>
    )
}