import { Link } from "react-router-dom";
import NavDropdownPanel, { type PanelStyle } from "./NavDropdownPanel";
import BigCard from "../../components/Store/BigCard";
import topSellersImg from "../../assets/navbar/browse/top-sellers.png";
import discountsEventsImg from "../../assets/navbar/browse/discounts-events.png";

interface BrowseDropdownProps {
    isOpen: boolean;
    panelStyle: PanelStyle | null;
    onLinkClick: () => void;
}

const BROWSE_LINKS = [
    { label: "Store Home", description: undefined, to: "/" },
    { label: "New Releases", description: "Explore new content on nexus", to: "/new-releases" },
    { label: "Upcoming Releases", description: "See what's on the release calendar", to: "/upcoming-releases" },
    { label: "All Charts & Stats", description: "Explore top titles by week, month, or year", to: "/charts" },
];

export default function BrowseDropdown({ isOpen, panelStyle, onLinkClick }: BrowseDropdownProps) {
    return (
        <NavDropdownPanel isOpen={isOpen} panelStyle={panelStyle}>
            <div className="browse-dropdown-layout">
                <ul className="browse-dropdown-links">
                    {BROWSE_LINKS.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} className="browse-dropdown-link" onClick={onLinkClick}>
                                <span className="browse-dropdown-link-title">{link.label}</span>
                                {link.description && (
                                    <span className="browse-dropdown-link-description">{link.description}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="browse-dropdown-cards">
                    <BigCard image={topSellersImg} label="Top Sellers" to="/top-sellers" onClick={onLinkClick} />
                    <BigCard image={discountsEventsImg} label="Discounts & Events" to="/discounts" onClick={onLinkClick} />
                </div>
            </div>
        </NavDropdownPanel>
    );
}