import styles from "../../css/Store/DiscoveryQueue.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

export default function DiscoveryQueue() {
    const { accessToken } = useContext(AuthContext);

    if (accessToken) {
        return null;
    }

    return (
        <Link to='/auth' style={{textDecoration: "none"}}>
            <div className={styles.discoveryWrapper}>
                <div className={styles.discoveryGradient}>
                    <div className={styles.discoveryContent}>
                        <div className={styles.widgetTitle}>
                            <span className={styles.primatyText}>Explore Your Discovery Queue</span>
                            <span className={styles.secondaryText}>Sign in to discover top-selling, new and recommended titles.</span>
                            <div className={styles.widgetButton}>Sign In</div>
                        </div>
                        <div className={styles.widgetScroll}>

                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
