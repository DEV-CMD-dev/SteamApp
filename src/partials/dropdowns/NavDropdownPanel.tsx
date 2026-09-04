import type { ReactNode } from "react";

export interface PanelStyle {
    marginLeft: number;
    width: number;
}

interface NavDropdownPanelProps {
    isOpen: boolean;
    panelStyle: PanelStyle | null;
    children: ReactNode;
}

export default function NavDropdownPanel({ isOpen, panelStyle, children }: NavDropdownPanelProps) {
    return (
        <div className={`nav-dropdown ${isOpen ? "open" : ""}`}>
            <div
                className="nav-dropdown-inner"
                style={
                    panelStyle
                        ? { marginLeft: panelStyle.marginLeft, width: panelStyle.width }
                        : undefined
                }>
                <div className="nav-dropdown-content">
                    {children}
                </div>
            </div>
        </div>
    );
}