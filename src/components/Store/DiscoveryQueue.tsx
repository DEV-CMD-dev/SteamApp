import styles from "../../css/Store/DiscoveryQueue.module.css"

export default function DiscoveryQueue(){
    return (
        <>
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
        </>
    )
}