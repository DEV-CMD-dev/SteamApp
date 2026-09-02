import { useLocation, useNavigate } from "react-router-dom";
import "../css/settingsPage.css";

const sidebarItems = [
    "Security",
    "Notifications",
    "Interface",
    "Downloads",
    "Storage",
];

const normalizeSection = (value: string | null) => {
    if (!value) return "security";
    const normalized = value.toLowerCase();
    return sidebarItems.some((item) => item.toLowerCase() === normalized) ? normalized : "security";
};

const securityActions = [
    {
        label: "Login",
        detail: "lailallyllowcat",
        action: "Change password",
    },
    {
        label: "Don't save account login details on this computer",
        detail: "This setting is recommended for shared computers. Enabling it will disable Offline Mode.",
        action: "",
        toggle: true,
    },
];

export default function SettingsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeSection = normalizeSection(new URLSearchParams(location.search).get("section"));

    return (
        <div className="settings-page">
            <div className="settings-breadcrumbs" aria-label="Breadcrumb">
                <button type="button" className="crumb-button" onClick={() => navigate("/")}>
                    nexus
                </button>
                <span className="crumb-separator">›</span>
                <button type="button" className="crumb-button" onClick={() => navigate("/profile")}>
                    nexus
                </button>
                <span className="crumb-separator">›</span>
                <span className="crumb-current">edit profile</span>
            </div>

            <div className="settings-layout">
                <nav className="settings-sidebar" aria-label="Settings navigation">
                    {sidebarItems.map((item) => {
                        const itemKey = item.toLowerCase();
                        return (
                            <button
                                key={item}
                                type="button"
                                className={`settings-tab ${activeSection === itemKey ? "active" : ""}`}
                                onClick={() => navigate(`/settings?section=${itemKey}`)}>
                                {item}
                            </button>
                        );
                    })}
                </nav>

                <main className="settings-content">
                    <section className="settings-section">
                        <h2>Security</h2>
                        {securityActions.map((entry) => (
                            <div key={entry.label} className="settings-list-item">
                                <div className="settings-copy">
                                    <span className="settings-label">{entry.label}</span>
                                    {entry.detail && <small>{entry.detail}</small>}
                                </div>
                                {entry.action ? (
                                    <button type="button" className="settings-action-button">
                                        {entry.action}
                                    </button>
                                ) : (
                                    <div className="toggle-box" aria-label="Toggle setting">
                                        <span className="toggle-mark">✓</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </section>
                </main>
            </div>
        </div>
    );
}
