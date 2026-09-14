import { useEffect, useState } from "react";
import type { TagDto } from "../../DTOs/Tag/TagDto";
import { tagService } from "../../services/tagService";
import Tag from "../../components/Store/Tag";
import NavDropdownPanel, { type PanelStyle } from "./NavDropdownPanel";
import styles from "../../css/dropdownPanels/CategoriesDropdown.module.css";

const TOP_CATEGORIES_COUNT = 6;

interface CategoriesDropdownProps {
    isOpen: boolean;
    panelStyle: PanelStyle | null;
    onNavigateToAllTags: () => void;
    onLinkClick: () => void;
}

export default function CategoriesDropdown({
    isOpen,
    panelStyle,
    onNavigateToAllTags,
    onLinkClick,
}: CategoriesDropdownProps) {
    const [categories, setCategories] = useState<TagDto[]>([]);

    useEffect(() => {
        if (!isOpen || categories.length > 0) {
            return;
        }

        const fetchTags = async () => {
            try {
                const tags = await tagService.getAll(1, TOP_CATEGORIES_COUNT);
                setCategories(tags.items);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTags();
    }, [isOpen, categories.length]);

    return (
        <NavDropdownPanel isOpen={isOpen} panelStyle={panelStyle}>
            <span className={styles.title}>YOUR TOP CATEGORIES</span>

            <div className={styles.grid}>
                {categories.slice(0, TOP_CATEGORIES_COUNT).map((tag) => (
                    <div className={styles.item} key={tag.id} onClick={onLinkClick}>
                        <Tag {...tag} />
                    </div>
                ))}
            </div>

            <button
                type="button"
                className={styles.viewAll}
                onClick={onNavigateToAllTags}>
                View all tags &gt;
            </button>
        </NavDropdownPanel>
    );
}