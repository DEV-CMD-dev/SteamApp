import styles from "./ListTabs.module.css";

export const TABS = ["ALL", "NEW & TRENDING", "TOP SELLERS", "TOP RATED", "POPULAR UPCOMING"] as const;
export type ListTab = (typeof TABS)[number];

const DISABLED_TABS: ListTab[] = ["POPULAR UPCOMING"];

type ListTabsProps = {
    activeTab: ListTab;
    onTabChange: (tab: ListTab) => void;
};

export default function ListTabs({ activeTab, onTabChange }: ListTabsProps) {
    return (
        <div className={styles.tabs}>
            {TABS.map((tab) => {
                const isDisabled = DISABLED_TABS.includes(tab);

                return (
                    <button
                        key={tab}
                        type="button"
                        disabled={isDisabled}
                        className={`${styles.tab} ${tab === activeTab ? styles.tabActive : ""} ${isDisabled ? styles.tabDisabled : ""}`}
                        onClick={() => !isDisabled && onTabChange(tab)}
                    >
                        {tab}
                    </button>
                );
            })}
        </div>
    );
}