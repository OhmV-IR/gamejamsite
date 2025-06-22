import styles from './page.module.css';

export default function EventDetails(){
    return (
        <div>
            <h1 className={styles.centertext}>Event Details</h1>
            <h2 className={styles.subheader}>Age Groups</h2>
            <p className={styles.answertext}>Junior: 11-14 years old</p>
            <p className={styles.answertext}>Senior: 14-18 years old</p>
            <h2 className={styles.subheader}>Date</h2>
            <p className={styles.answertext}>August 2025</p>
            <h2 className={styles.subheader}>What to bring</h2>
            <ul>
                <li className={styles.answertext}>Your own device</li>
                <li className={styles.answertext}>Charger for your device</li>
                <li className={styles.answertext}>Your required software such as VSCode or Blender</li>
                <li className={styles.answertext}>Food and water</li>
            </ul>
            <p className={styles.subheader}>Junior attendees are required to be present in-person to take part in the competition</p>
            <p className={styles.subheader}>Senior attendees can either take part online or in-person</p>
        </div>
    )
}