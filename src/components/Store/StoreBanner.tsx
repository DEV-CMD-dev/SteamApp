import styles from "../../css/StoreBanner.module.css"
import bannerImg from "../../assets/store/banner.jpg"

export default function StoreBanner(){
    return(
        <>
            <div className={styles.BannerContainer}>
                <img className={styles.BannerImg} src={bannerImg} alt="Store banner" />
            </div>
        </>
    )
}