import styles from "../css/Footer.module.css";
import logo from "../assets/logo.svg";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                <div className={styles.brand}>
                    <img src={logo} alt="Nexus" className={styles.logo} />

                    <p>
                        © 2026 Nexus. All rights reserved.<br />
                        All trademarks are the property of<br />
                        their respective owners.<br />
                        Powered by the Nexus<br />
                        gaming platform.
                    </p>
                </div>

                <div className={styles.column}>
                    <h3>NEXUS</h3>
                    <a>About Nexus</a>
                    <a>News</a>
                    <a>Community</a>
                    <a>Gift Cards</a>
                </div>

                <div className={styles.column}>
                    <h3>SUPPORT</h3>
                    <a>Help Center</a>
                    <a>Contact Us</a>
                    <a>Report a Bug</a>
                    <a>System Status</a>
                </div>

                <div className={styles.column}>
                    <h3>LEGAL</h3>
                    <a>Privacy Policy</a>
                    <a>Terms of Service</a>
                    <a>Accessibility</a>
                    <a>Documentation</a>
                </div>

                <div className={styles.column}>
                    <h3>MORE</h3>
                    <a>Download Launcher</a>
                    <a>Mobile App</a>
                    <a>My Account</a>
                    <a>Support</a>
                </div>

            </div>
        </footer>
    );
}