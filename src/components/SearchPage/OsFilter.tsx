import { useState,useContext} from "react"
import "./GameFilter.css"
import CustomCheckbox from "../CustomCheckbox";
import { SearchContext } from "../../contexts/SearchContext";

export default function OsFilter() {
    const {IsWindows,IsMacOS,setIsWindows, setIsMacOS} = useContext(SearchContext);
    const [isOpen, setIsOpen] = useState<boolean>(true);

    return (
        <div className="filter-container">
            <div className="filter-header" onClick={() => setIsOpen(!isOpen)}>
                Narrow by OS
            </div>
            {
                isOpen && (
                    <div className={`filter-content ${isOpen ? "open" : ""}`}>
                        <div className="checkbox-container">
                            <CustomCheckbox checked={IsWindows} onChange={e => setIsWindows(e)} title="Windows" />
                            <CustomCheckbox checked={IsMacOS} onChange={e => setIsMacOS(e)} title="macOS" />
                        </div>
                    </div>
                )
            }
        </div>
    )
}