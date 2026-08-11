import { useEffect, useState } from "react";
import type { TagDto } from "../../DTOs/Tag/TagDto";
import { tagService } from "../../services/tagService";
import Tag from "./Tag";
import styles from "../../css/Store/CategoryCarousel.module.css";
import arrow from "../../assets/store/arrow.svg";

export default function CategoryCarousel() {
    const [items, setItems] = useState<TagDto[]>([]);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tags = await tagService.getAll(1, 20);
                setItems(tags.items);
            } catch (err) {
                console.error(err);
            }
        };

        fetchTags();
    }, []);

    const handleScroll = (direction: "left" | "right") => {
        setItems((prevItems) => {
            if (prevItems.length <= 5) {
                return prevItems;
            }

            const copy = [...prevItems];

            if (direction === "right") {
                copy.push(...copy.splice(0, 5));
            } else {
                copy.unshift(...copy.splice(-5));
            }

            return copy;
        });
    };

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.carouselContent}>

                <h3 className={styles.carouselTitle}>
                    Browse by Category
                </h3>

                <button
                    className={styles.scrollButton}
                    onClick={() => handleScroll("left")}
                    aria-label="Previous">
                    <img
                        src={arrow}
                        className={styles.scrollButtonImageLeft}
                        alt=""/>
                </button>

                <div className={styles.carouselWrapper}>
                    <div className={styles.carouselRow}>
                        {items.map((tag) => (
                            <div
                                className={styles.cardWrapper}
                                key={tag.id}>
                                <Tag {...tag} />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className={styles.scrollButton}
                    onClick={() => handleScroll("right")}
                    aria-label="Next">
                    <img
                        src={arrow}
                        className={styles.scrollButtonImageRight}
                        alt=""/>
                </button>

            </div>
        </div>
    );
}