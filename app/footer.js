import styles from "./page.module.css";

export default function Footer() {
    return (
        <div>
            <div className={styles.footerpad}></div>
            <div className="hr-text">Additional Information</div>
            <div className={styles.footerdiv}>
                <h3><a href="mailto:jambytesteam@gmail.com" className={styles.linktext}>jambytesteam@gmail.com</a></h3>
            </div>
        </div>
    )
}