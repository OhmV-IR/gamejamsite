import styles from "./page.module.css";

export default function Footer() {
    return (
        <div>
            <div className={styles.footerpad}></div>
            <div className="hr-text">For More Information</div>
            <div className={styles.footerdiv}>
                <div className="row">
                    <div className="col">
                        <h1>Contact us at: <a href="mailto:jambytesteam@gmail.com" className={styles.linktext}>jambytesteam@gmail.com</a></h1>
                    </div>
                    <div className="col"><a href="/tos" className={styles.greylink}>Terms of Service</a></div>
                    <div className="col"><a href="/privacy" className={styles.greylink}>Privacy Policy</a></div>
                </div>
            </div>
        </div>
    )
}