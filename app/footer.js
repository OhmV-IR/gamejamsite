import styles from "./page.module.css";
import Link from "next/link";

export default function Footer() {
    return (
        <div>
            <div className={styles.footerpad}></div>
            <div className={styles.footerdiv}>
                <div className="hr-text mt-3 mb-3">Additional Information</div>
                <div className={styles.footercontent}>
                    <a href="mailto:jambytesteam@gmail.com" className={styles.lefttext}>jambytesteam@gmail.com</a>
                    <div className={styles.righttext}>
                        <Link href="/tos">Terms of Service</Link> | <Link href="/privacy">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}