import { useState } from "react"
import "./GameFilter.css"
import CustomCheckbox from "../CustomCheckbox";

export default function GameFilter() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
        <div className="filter-container">
            <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
                Check the price
            </div>
            {
                isOpen && (
                    <div className={`filter-content ${isOpen ? "open" : ""}`}>
                        <CustomCheckbox title="Discounts and events" />
                        <CustomCheckbox title="Hide free-to-play games" />
                    </div>
                )
            }
        </div>
    )
}