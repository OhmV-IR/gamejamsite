import styles from "./page.module.css";

export default function Footer(){
    return (
        <div>
        <div className={styles.footerpad}></div>
        <div className={styles.footerdiv}>
            <div className="hr-text">See Also</div>
            <h1>Contact us at: <a href="mailto:jambytesteam@gmail.com" className={styles.linktext}>jambytesteam@gmail.com</a></h1>
        </div>
        </div>
    )
}