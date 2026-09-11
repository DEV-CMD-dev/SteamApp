import { useState } from "react";
import styles from "./FiltersSidebar.module.css";

const FILTER_GROUPS = [
    "TOP-LEVEL GENRES",
    "GENRES",
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
    "PRICE",
    "PREFERENCES",
];

type FiltersSidebarProps = {
    matchesCount: number;
};

export default function FiltersSidebar({ matchesCount }: FiltersSidebarProps) {
    const [openGroup, setOpenGroup] = useState<string | null>(null);

    const toggleGroup = (group: string) => {
        setOpenGroup((prev) => (prev === group ? null : group));
    };

    return (
        <div className={styles.sidebar}>
            <p className={styles.heading}>FILTERS</p>
            <p className={styles.matches}>{matchesCount} MATCHES</p>

            {FILTER_GROUPS.map((group) => (
                <div key={group} className={styles.group}>
                    <button
                        type="button"
                        className={styles.groupHeader}
                        onClick={() => toggleGroup(group)}
                    >
                        <span>{group}</span>
                        <span className={styles.chevron}>{openGroup === group ? "⌃" : "⌄"}</span>
                    </button>

                    {openGroup === group && (
                        <div className={styles.groupBody}>
                            {/* тут будуть реальні опції фільтра, поки заглушка */}
                            <p className={styles.groupPlaceholder}>Options coming soon</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}