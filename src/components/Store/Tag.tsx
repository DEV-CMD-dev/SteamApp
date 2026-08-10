import type { TagDto } from "../../DTOs/Tag/TagDto";
import styles from "../../css/Store/Tag.module.css";

export default function Tag(dto: TagDto) {
    return (
        <div className={styles.tag}>
            {dto.picture && (
                <img
                    src={dto.picture}
                    alt={dto.name}
                    className={styles.image}/>
            )}

            <div className={styles.overlay} />

            <div className={styles.title}>
                {dto.name}
            </div>
        </div>
    );
}