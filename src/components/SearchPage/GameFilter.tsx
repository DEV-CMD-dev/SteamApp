import { useState, useContext, useEffect } from "react"
import "./GameFilter.css"
import CustomCheckbox from "../CustomCheckbox";
import { SearchContext } from "../../contexts/SearchContext";

export default function GameFilter() {
    const { IsDiscounted,HideFreeToPlay,setIsDiscounted, setHideFreeToPlay, setMaxPrice } = useContext(SearchContext);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [price, setPrice] = useState<number>(13);
    const priceData = [
        { label: "Free", apiValue: 0 },
        { label: "Under 2$", apiValue: 2 },
        { label: "Under 5$", apiValue: 5 },
        { label: "Under 10$", apiValue: 10 },
        { label: "Under 15$", apiValue: 15 },
        { label: "Under 20$", apiValue: 20 },
        { label: "Under 25$", apiValue: 25 },
        { label: "Under 30$", apiValue: 30 },
        { label: "Under 40$", apiValue: 40 },
        { label: "Under 50$", apiValue: 50 },
        { label: "Under 60$", apiValue: 60 },
        { label: "Under 70$", apiValue: 70 },
        { label: "Under 100$", apiValue: 100 },
        { label: "Any Price", apiValue: null }
    ];

    useEffect(() => {
        const timer = setTimeout(() => {
            setMaxPrice(priceData[price].apiValue);
        }, 400);

        return () => clearTimeout(timer);
    }, [price]);

    return (
        <div className="filter-container">
            <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
                Narrow by Price
            </div>
            {
                isOpen && (
                    <div className={`filter-content ${isOpen ? "open" : ""}`}>
                        <input
                            className="content-input-range"
                            type="range"
                            min={0}
                            max={13}
                            step={1}
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                        />
                        <p className="price-label">{priceData[price].label}</p>
                        <div className="input-hr"></div>
                        <div className="checkbox-container">
                            <CustomCheckbox checked={IsDiscounted} onChange={(checked) => setIsDiscounted(checked)} title="Discounts and events" />
                            <CustomCheckbox checked={HideFreeToPlay} onChange={(checked) => setHideFreeToPlay(checked)} title="Hide free to play games" />
                        </div>
                    </div>
                )
            }
        </div>
    )
}