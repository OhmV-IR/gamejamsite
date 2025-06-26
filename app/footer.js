import styles from "./page.module.css";

export default function Footer() {
    return (
        <div>
            <div className={styles.footerpad}></div>
            <div className={styles.footerdiv}>
                <div className="hr-text mt-3 mb-3">Additional Information</div>
                <div className={styles.footercontent}>
                    <a href="mailto:jambytesteam@gmail.com" className={styles.lefttext}>jambytesteam@gmail.com</a>
                    <div className={styles.righttext}>
                        <a href="/tos">Terms of Service</a> | <a href="/privacy">Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    )
}