import type { ReactNode } from "react";
import styles from "../../css/dropdownPanels/NavDropdownPanel.module.css";

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
        <div className={`${styles.navDropdown} ${isOpen ? styles.open : ""}`}>
            <div
                className={styles.navDropdownInner}
                style={
                    panelStyle
                        ? { marginLeft: panelStyle.marginLeft, width: panelStyle.width }
                        : undefined
                }>
                <div className={styles.navDropdownContent}>
                    {children}
                </div>
            </div>
        </div>
    );
}