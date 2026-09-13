import { useState } from "react";
import type { TagDto } from "../../../../DTOs/Tag/TagDto";
import { MIN_RATING_OPTIONS } from "./GameListPanel";
import styles from "./FiltersSidebar.module.css";

const STATIC_PLACEHOLDER_GROUPS = [
    "TOP-LEVEL GENRES",
    "SUB-GENRES",
    "VISUALS & VIEWPOINT",
    "THEMES & MOODS",
    "FEATURES",
    "PLAYERS",
    "TYPE",
    "CONTROLLER SUPPORT",
    "PLATFORM",
    "LANGUAGE",
    "CONTENT DESCRIPTOR",
    "PREFERENCES",
];

type FiltersSidebarProps = {
    matchesCount: number;
    genreOptions: TagDto[];
    selectedGenreIds: number[];
    onToggleGenre: (tagId: number) => void;
    selectedMinRating: number;
    onSelectMinRating: (rating: number) => void;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    onMinPriceChange: (value: number | undefined) => void;
    onMaxPriceChange: (value: number | undefined) => void;
};

export default function FiltersSidebar({
    matchesCount,
    genreOptions,
    selectedGenreIds,
    onToggleGenre,
    selectedMinRating,
    onSelectMinRating,
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange,
}: FiltersSidebarProps) {
    const [openGroup, setOpenGroup] = useState<string | null>(null);


    const toggleGroup = (group: string) => {
        setOpenGroup((prev) => (prev === group ? null : group));
    };

    return (
        <div className={styles.sidebar}>
            <p className={styles.heading}>FILTERS</p>
            <p className={styles.matches}>{matchesCount} MATCHES</p>

            <div className={styles.group}>
                <button type="button" className={styles.groupHeader} onClick={() => toggleGroup("GENRES")}>
                    <span>GENRES</span>
                    <span className={styles.chevron}>{openGroup === "GENRES" ? "⌃" : "⌄"}</span>
                </button>

                {openGroup === "GENRES" && (
                    <div className={styles.groupBody}>
                        {genreOptions.map((tag) => (
                            <label key={tag.id} className={styles.checkboxRow}>
                                <input
                                    type="checkbox"
                                    className={styles.checkboxInput}
                                    checked={selectedGenreIds.includes(tag.id)}
                                    onChange={() => onToggleGenre(tag.id)}
                                />
                                <span className={styles.checkboxBox} />
                                <span className={styles.checkboxLabel}>{tag.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.group}>
                <button type="button" className={styles.groupHeader} onClick={() => toggleGroup("PLAYER REVIEWS")}>
                    <span>PLAYER REVIEWS</span>
                    <span className={styles.chevron}>{openGroup === "PLAYER REVIEWS" ? "⌃" : "⌄"}</span>
                </button>

                {openGroup === "PLAYER REVIEWS" && (
                    <div className={styles.groupBody}>
                        {MIN_RATING_OPTIONS.map((option) => (
                            <label key={option.value} className={styles.checkboxRow}>
                                <input
                                    type="radio"
                                    name="minRating"
                                    className={styles.radioInput}
                                    checked={selectedMinRating === option.value}
                                    onChange={() => onSelectMinRating(option.value)}
                                />
                                <span className={styles.radioCircle} />
                                <span className={styles.checkboxLabel}>{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.group}>
                <button type="button" className={styles.groupHeader} onClick={() => toggleGroup("PRICE")}>
                    <span>PRICE</span>
                    <span className={styles.chevron}>{openGroup === "PRICE" ? "⌃" : "⌄"}</span>
                </button>

                {openGroup === "PRICE" && (
                    <div className={styles.groupBody}>
                        <div className={styles.priceInputs}>
                            <input
                                type="number"
                                min={0}
                                placeholder="Min"
                                className={styles.priceInput}
                                value={minPrice ?? ""}
                                onChange={(e) => onMinPriceChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                            <span className={styles.priceSeparator}>—</span>
                            <input
                                type="number"
                                min={0}
                                placeholder="Max"
                                className={styles.priceInput}
                                value={maxPrice ?? ""}
                                onChange={(e) => onMaxPriceChange(e.target.value === "" ? undefined : Number(e.target.value))}
                            />
                        </div>
                    </div>
                )}
            </div>

            {STATIC_PLACEHOLDER_GROUPS.map((group) => (
                <div key={group} className={styles.group}>
                    <button type="button" className={styles.groupHeader} onClick={() => toggleGroup(group)}>
                        <span>{group}</span>
                        <span className={styles.chevron}>{openGroup === group ? "⌃" : "⌄"}</span>
                    </button>

                    {openGroup === group && (
                        <div className={styles.groupBody}>
                            <p className={styles.groupPlaceholder}>Options coming soon</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}