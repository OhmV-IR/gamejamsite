import styles from "./page.module.css";

export default function Footer() {
    return (
        <div>
            <div className={styles.footerpad}></div>
            <div className={styles.footerdiv}>
                <div className="hr-text">Additional Information</div>
                <div className="row w-100">
                    <div className="col">
                        <h3><a href="mailto:jambytesteam@gmail.com" className={styles.linktext}>jambytesteam@gmail.com</a></h3>
                    </div>
                    <div className="col">
                        <a href="/tos" className={styles.greylink}>Terms of Service</a>
                    </div>
                    <div className="col">
                        <a href="/privacy" className={styles.greylink}>Privacy Policy</a>
                    </div>
                </div>
            </div>
        </div>
    )
}