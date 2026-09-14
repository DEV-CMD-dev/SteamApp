import { Link } from "react-router-dom";
import styles from "../../css/Store/BigCard.module.css";

interface BigCardProps {
    image: string;
    label: string;
    to: string;
    onClick?: () => void;
}

export default function BigCard({ image, label, to, onClick }: BigCardProps) {
    return (
        <Link to={to} className={styles.card} onClick={onClick}>
            <img src={image} alt={label} className={styles.image} />
            <div className={styles.overlay} />
            <div className={styles.title}>{label}</div>
        </Link>
    );
}