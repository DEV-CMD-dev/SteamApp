import { Link } from "react-router-dom";
import styles from "../css/NotFound.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.panel}>
        <div className={styles.code}>404</div>
        <h1>Page not found</h1>
        <p>The page you’re looking for doesn’t exist or has been moved.</p>
        <Link to="/" className={styles.btn}>
          Back to Store
        </Link>
      </div>
    </main>
  );
}