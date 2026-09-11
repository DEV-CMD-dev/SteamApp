import { useState } from "react";
import styles from "./ListTabs.module.css";

const TABS = ["ALL", "NEW & TRENDING", "TOP SELLERS", "TOP RATED", "POPULAR UPCOMING"];

export default function ListTabs() {
    const [activeTab, setActiveTab] = useState(TABS[0]);

    return (
        <div className={styles.tabs}>
            {TABS.map((tab) => (
                <button
                    key={tab}
                    type="button"
                    className={`${styles.tab} ${tab === activeTab ? styles.tabActive : ""}`}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}